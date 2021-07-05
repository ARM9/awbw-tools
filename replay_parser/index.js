const //jison = require('jison'),
      zlib = require('zlib');

//const grammar = fs.readFileSync('parser.jison', 'utf8'),
      //parser = jison.Parser(grammar);

const parser = require('./parser');

module.exports.parse = function (zip) {
    let unzipped = zlib.gunzipSync(zip).toString('utf8');
    return parser.parse(unzipped);
};

module.exports.parseUnzipped = function (unzipped) {
    return parser.parse(unzipped);
};

