import NodeRSA from "node-rsa";
import crypto from "crypto";

const key = new NodeRSA({ b: 2048 });
const aesKey = 'D#HqO1i01duaP!#@!fjaSUzjdPqDWQE2';
const IV_LENGTH = 16;

const iv = crypto.randomBytes(IV_LENGTH);
const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(aesKey), iv);
const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(aesKey), iv);

class ChatEncryption {
  public encrypt(data: string, publicKey: NodeRSA.Key | null): string | null {
    if (!publicKey) {
      return key.encrypt(data, 'base64');
    } else if (publicKey) {
      let tempKey: NodeRSA = new NodeRSA();
      tempKey.importKey(publicKey, 'pkcs8-public-pem');
    }
  }

  public decrypt(cipherText: string): string {
    return key.decrypt(cipherText, 'utf8');
  }

  public getKeyPair(): NodeRSA {
    return key;
  }

  public getPublicKey(): string {
    return key.exportKey('pkcs8-public-pem');
  };
}

export default ChatEncryption;
