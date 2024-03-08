import fs from 'fs';
import path from 'path';
import {parseReplay} from './replay_parser.js';
import util from 'util';

function pr(obj){console.log(util.inspect(obj, false, null, false));}
function pp(obj){console.log(util.inspect(obj, false, null, true));}

const argv = process.argv.slice(2);

let in_file = '-',
    input = '',
    out_file = '';

if (argv.length < 1) {
    console.error('Usage: node main.mjs <replay_file> [output_file]');
    process.exit(1);
}
in_file = argv[0];

main();
/*
if (in_file === '-' || in_file === '') {
    process.stdin.on('data', function (data) {
        input += data;
    });
    process.stdin.on('end', function () {
        main();
    })
} else {
    let file = path.parse(in_file);
    out_file = file.name + '.json';
    if (file.ext === '.zip') {
        parseReplay(in_file)
        .then(pr)
        .catch(console.error);
    } else {
        input = fs.readFileSync(in_file);
        main();
    }
}
*/

function main () {
    parseReplay(in_file).then(pr).catch(console.error);
}

