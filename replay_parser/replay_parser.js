const unserialize = require('./unserialize').unserialize,
      zlib = require('zlib'),
      unzip = require('yauzl');

/* Parses the state file of a game
 * @param {Buffer} gzipped - The compressed state file
 * @returns {Array} - An array of turn start states (awbwGame object)
 */
function parseStateFile (gzipped) {
    let text = zlib.gunzipSync(gzipped).toString('utf8');
    let i = 0;
    let states = [];
    while (i < text.length) {
        let line = text.substring(i, text.indexOf('\n', i));
        i += line.length + 1;
        let state = unserialize(line);
        states.push(state);
    }
    return states;
}

/* Parses the action file of a game
 * @param {Buffer} gzipped - The compressed action file
 * @returns {Array} - An array of turns, each turn is an object with the following properties:
 * - playerId: The id of the player who made the turn
 *   day: The day of the turn
 *   actions: An array of actions, each action is an object
 */
function parseActionFile (gzipped) {
    let text = zlib.gunzipSync(gzipped).toString('utf8');
    let turns = [];
    let curr_line = 1;
    let i = 0;
    try {
        while (i < text.length) {
            let line = text.substring(i, text.indexOf('\n', i));
            i += line.length + 1;
            let turnHeader = line.match(/p:(\d+);d:(\d+);a:/);
            let playerId = turnHeader[1];
            let day = turnHeader[2];
            line = line.substring(turnHeader[0].length);
            let actions = Object.values(unserialize(line)[2]).map(action => {
                return JSON.parse(action);
            });
            turns.push({playerId, day, actions});
            curr_line++;
        }
    } catch (e) {
        e.message = `Error parsing action file at line ${curr_line}, byte ${i}\n` + text.substring(0, 100) + '\n' + e.message;
        throw e;
    }
    return turns;
}

/* Parses a replay zip file
 * @param {String} zipName - The name of the zip file
 * @returns {Promise} - A promise that resolves to an object with the following properties:
 * - replay: An array of turn start game states
 *   actions: An array of turns, each turn is an object
 */
function parseReplay (zipName) {
    return new Promise((resolve, reject) => {
        unzip.open(zipName, {lazyEntries: true}, (err, zipFile) => {
            let files = {};
            if (err) reject(err);
            zipFile.on('entry', entry => {
                //const name = zipName.replace('\\','/').split('/').pop().slice(0,-4);
                if (entry.fileName[0] !== 'a') {
                    zipFile.openReadStream(entry, (err, readStream) => {
                        if (err) reject(err);
                        let file = [];
                        readStream.on('error', reject);
                        readStream.on('data', chunk => file.push(chunk));
                        readStream.on('end', () => {
                            files['replay'] = parseStateFile(Buffer.concat(file));
                            zipFile.readEntry();
                        })
                        //readStream.pipe();
                    });
                } else {
                    zipFile.openReadStream(entry, (err, readStream) => {
                        if (err) reject(err);
                        let file = [];
                        readStream.on('error', reject);
                        readStream.on('data', chunk => file.push(chunk));
                        readStream.on('end', () => {
                            files['actions'] = parseActionFile(Buffer.concat(file));
                            zipFile.readEntry();
                        })
                        //readStream.pipe();
                    });
                }
            });
            zipFile.once('end', function () {
                resolve(files);
            });
            zipFile.on('error', reject);
            zipFile.readEntry();
        });
    });
}

module.exports = {parseStateFile, parseActionFile, parseReplay};

