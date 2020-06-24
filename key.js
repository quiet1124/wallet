import crypto from "crypto";
import secp256k1 from "secp256k1";
import createKeccakHash from "keccak";
import Mnemonic from "bitcore-mnemonic";
import { create } from "domain";

function createPrivateKey() {
    let privateKey;
    do {
        privateKey = crypto.randomBytes(32); // 개인키는 32bytes
    } while (secp256k1.privateKeyVerify(privateKey) === false);
    return privateKey;
}

function createPublicKey(privateKey, compressed = false) {
    return Buffer.from(secp256k1.publicKeyCreate(privateKey, compressed));
}

function createAddress(publicKey) {
    const hash = createKeccakHash("keccak256").update(publicKey.slice(1)).digest("hex");
    return "0x" + hash.slice(24);
}

function toChecksumAddress (address) {
    address = address.toLowerCase().replace('0x', '')
    var hash = createKeccakHash('keccak256').update(address).digest('hex')
    var ret = '0x'
  
    for (var i = 0; i < address.length; i++) {
      if (parseInt(hash[i], 16) >= 8) {
        ret += address[i].toUpperCase()
      } else {
        ret += address[i]
      }
    }
  
    return ret
  }

function privateKeyToAddress(privateKey) {
  const publicKey = createPublicKey(privateKey);
  const address = createAddress(publicKey);
  return toChecksumAddress(address);
}

function createMnemonic(wordsCount = 12) {
  if (wordsCount < 12 || wordsCount > 24 || wordsCount % 3 !== 0) {
    throw new Error("invalid number of words");
  }
  const entropy = (16 + (wordsCount - 12) / 3 * 4) * 8;
  return new Mnemonic(entropy);
  // return new Mnemonic(crypto.randomBytes(entropy / 8)); 
}

function mnemonicToPrivateKey(mnemonic) {
  const privateKey = mnemonic.toHDPrivateKey().derive("m/44'/60'/0'/0/0").privateKey; // 0이면 비트코인, 60이면 이더리움
  return Buffer.from(privateKey.toString(), "hex");
}

const mnemonic = createMnemonic(12);
// const mnemonic = new Mnemonic("단어") => mnemonic 단어들을 넣어도 개인키, 주소 생성됨
console.log(mnemonic.toString());

const privateKey = mnemonicToPrivateKey(mnemonic);
console.log(privateKey.toString("hex"));

const address = privateKeyToAddress(privateKey);
console.log(address);