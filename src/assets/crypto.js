// Bring Environment Need
const crypto = require('crypto');
const md5 = require('md5');
const config = require('./config');

// Initialize Constant variable
const _AES_256_CBC = config.crypto.algo.aes_256_cbc;
const _AES_256_ECB = config.crypto.algo.aes_256_ecb;

const _IV_LENGTH = config.crypto.ivLength;
const _SECRET_KEY = config.crypto.key.secret;
const _SECOND_KEY = config.crypto.key.second;

function doEncrypt(text, secret = null, mode, iv) {
    const secretKey = secret !== null ? secret : _SECRET_KEY;
    let cipher = crypto.createCipheriv(mode, secretKey, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('base64');
}

function doDecrypt(text, secret = null, mode, iv) {
    const secretKey = secret !== null ? secret : _SECRET_KEY;
    let encryptedText = Buffer.from(text, 'base64');
    let decipher = crypto.createDecipheriv(mode, secretKey, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

function encryptAesCbc(text, iv, key = null) {
    return doEncrypt(text, key, _AES_256_CBC, iv);
}

function encryptAesEcb(text, key = null) {
    return doEncrypt(text, key, _AES_256_ECB, '');
}

function decryptAesCbc(text, iv, key = null) {
    return doDecrypt(text, key, _AES_256_CBC, iv);
}

function decryptAesEcb(text, key = null) {
    return doDecrypt(text, key, _AES_256_ECB, '');
}


function getIv() {
    return md5(crypto.randomBytes(_IV_LENGTH)).substr(0, _IV_LENGTH);
}

function encrypt(text, key = null) {
    // Set IV
    try {
        const messageIv = getIv();
        // Create New key
        const ivSecretKey = md5(getIv());
        // Encrypt Real IV
        const encryptedIv = encryptAesEcb(messageIv, ivSecretKey);
        // Encrypt Encryption key
        const encryptedIvSecret = encryptAesEcb(ivSecretKey, _SECOND_KEY);
        // Encrypt Message
        let encryptedMessage = encryptAesCbc(text, messageIv, key);
        // Encrypt Message with $encryptedIvSecret
        encryptedMessage = encryptAesEcb(encryptedMessage, ivSecretKey);
        // Concat String
        const rtnMessage = encryptedMessage + ":" + encryptedIv + ":" + encryptedIvSecret;
        return encodeURIComponent(rtnMessage);
    } catch (e) {
        return false;
    }
}

function decrypt(cipherText, key = null) {
    try {
        const encodedCipherText = decodeURIComponent(cipherText);
        const explodeCipherText = encodedCipherText.split(":");
        if(explodeCipherText.length != 3) {
            return false;
        }
        const firstSection = explodeCipherText[0]; // Message
        const secondSection = explodeCipherText[1]; // IV
        const thirdSection = explodeCipherText[2]; // Key for Encrypted IV

        const decryptedSecretIv = decryptAesEcb(thirdSection, _SECOND_KEY);
        const decyptedIv = decryptAesEcb(secondSection, decryptedSecretIv);
        const decryptDecryptedMessage = decryptAesEcb(firstSection, decryptedSecretIv);
        const decryptedMessage = decryptAesCbc(decryptDecryptedMessage, decyptedIv, key);

        return decryptedMessage;
    } catch (e) {
        return false;
    }
}

module.exports = {
    encrypt,
    decrypt
}