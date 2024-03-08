# awbw replay parser

### usage

From js
```
import {parseReplay} from 'replay_parser.js';
let {replay, actions} = parseReplay('replay.zip');
```

From command line
```
node main.js replay.zip > out.json
```

Parsing individual files
```
import {parseStateFile, parseActionFile} from 'replay_parser.js';
let gameStates = parseStateFile(fs.readFileSync('123456'));
let actions = parseActionFile(fs.readFileSync('a123456'));
```

# awbw replay format

A replay zip file named `123456.zip` contains two files;
- 123456: each line contains the game state of one turn as an object in php `serialize()` format with the 
- a123456: each line contains the actions for one turn. Lines start with a header followed by an array in php `serialize()` format, containing `[playerId, day, actions]` where playerId and day are integers, actions is a string containing JSON.

one of my older replays (2018) is missing the first turn of the first day for some reason

