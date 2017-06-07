require('babel-register')({
    //presets: ['es2015']
    plugins: ['transform-es2015-modules-commonjs']
});
require('./getDWData2/index.js');