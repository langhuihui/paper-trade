import crypto from 'crypto'
const algorithm = 'aes-128-cbc';
const key = '5c9f3f4bb2f6c518';
const clearEncoding = 'utf8';
const iv = "0e868177a2513898";
//var cipherEncoding = 'hex';
//If the next line is uncommented, the final cleartext is wrong.
const cipherEncoding = 'base64';

function encrypt(data) {
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let crypted = cipher.update(data, clearEncoding, 'binary');
    crypted += cipher.final('binary');
    crypted = new Buffer(crypted, 'binary').toString(cipherEncoding);
    return crypted;
}

function decrypt(crypted) {
    crypted = new Buffer(crypted, cipherEncoding).toString('binary');
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decoded = decipher.update(crypted, 'binary', clearEncoding);
    decoded += decipher.final(clearEncoding);
    return decoded;
}
export { encrypt, decrypt }