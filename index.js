require('babel-register')(require('./babelconfig'));
require('./' + process.argv[2] + '/index.js');