const forge = require("node-forge");

class KeyPairEncryption {
  constructor(otherPublicKey = null) {
    this.keyPair = this.generateKeyPairs();
    this.otherPublicKey = otherPublicKey;
  }

  generateKeyPairs() {
    return forge.pki.rsa.generateKeyPair({ bits: 2048 });
  }

  setOtherPublicKey(otherPublicKey) {
    this.otherPublicKey = otherPublicKey;
  }

  encrypt(decString){
    return this.getOtherPublicKey().encrypt(decString)
  }

  decrypt(encString){
    return this.getPrivateKeyObj().decrypt(encString)
  }

  getPublicKey() {
    return forge.pki.publicKeyToPem(this.keyPair.publicKey);
  }
  getOtherPublicKey(){
    return forge.pki.rsa.publicKeyFromPem(otherPublicKey);
  }

  getPublicKeyObj() {
    return forge.pki.publicKeyFromPem(this.getPublicKey());
  }

  getPublicKeyObj() {
    return forge.pki.publicKeyFromPem(this.getPublicKey());
  }

  getPrivateKey() {
    return forge.pki.privateKeyToPem(this.keyPair.privateKey);
  }

  getPrivateKeyObj() {
    return forge.pki.privateKeyFromPem(this.getPrivateKey());
  }
}

// console.log(forge.pki.publicKeyFromPem(new KeyPairEncryption().getPublicKey()).encrypt("Hello"))

module.exports = new KeyPairEncryption();
