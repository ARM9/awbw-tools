const //jison = require('jison'),
      zlib = require('zlib'),
      unzip = require('yauzl');

//const grammar = fs.readFileSync('parser.jison', 'utf8'),
      //parser = jison.Parser(grammar);

const parser = require('./parser');

function parse (gzipped) {
    let unzipped = zlib.gunzipSync(gzipped).toString('utf8');
    return parser.parse(unzipped);
};

function parseZip (zipName) {
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
                            //resolve(parse(Buffer.concat(file)));
                            files['replay'] = parse(Buffer.concat(file));
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
                            files['moves'] = zlib.gunzipSync(Buffer.concat(file)).toString('utf8')
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
function parseDecompressed (unzipped) {
    return parser.parse(unzipped);
};

module.exports = {parse, parseZip, parseDecompressed};

