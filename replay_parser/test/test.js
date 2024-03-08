const fs = require('fs');
const {parseReplay, parseStateFile, parseActionFile} = require('../replay_parser');
const util = require('util');

function pp(obj) {
  console.log(util.inspect(obj, false, null));
}

const replayId = '1126836';
//const replayActions = fs.readFileSync('replays/a' + replayId);
//pp(parseActionFile(replayActions));
//const replay = fs.readFileSync('replays/' + replayId);
//console.log(parseStateFile(replay));

const zip = 'replays/' + replayId + '.zip';
parseReplay(zip).then((replay) => { console.log(replay); });
