const fs = require('fs'),
      path = require('path'),
      jison = require('jison'),
      parser = require('./replay_parser.js'),
      zlib = require('zlib'),
      util = require('util');

function pr(obj){console.log(util.inspect(obj, false, null, false));}
function pp(obj){console.log(util.inspect(obj, false, null, true));}

//const grammar = fs.readFileSync('parser.jison', 'utf8'),
      //parser = jison.Parser(grammar);

//const parser = require('./parser');

const argv = process.argv.slice(2);

let in_file = '-',
    input = '',
    out_file = '';

if (argv.length === 1) {
    in_file = argv[0];
}

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
        parser.parseZip(in_file)
        .then(pr)
        .catch(console.error);
    } else {
        input = fs.readFileSync(in_file);
        main();
    }
}

function main () {
    //let unzipped = zlib.gunzipSync(input).toString('utf8');
    //pr (unzipped);
    //let ast = parser.parse(unzipped);

    //parser.parseZip('replays/testme.zip')
    //.then(pr);

    let ast = parser.parse(input);
    pr(ast)
}

