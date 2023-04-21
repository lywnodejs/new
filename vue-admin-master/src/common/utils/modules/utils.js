import { JSEncrypt } from 'jsencrypt'

// 加密 
export function encryptedData(data) {
    const key = `MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAOMOaJ0tcJ5uP2LxHyI8Os4KSkYdznQqR7wRSrHxJ0xjsUSkQaHAmt8H4q4GSSyTYVFUIYSGKi07z5wsFZIvnLUCAwEAAQ==`
    // 新建JSEncrypt对象
    let encryptor = new JSEncrypt();
    // 设置公钥
    encryptor.setPublicKey(key);
    // 加密数据
    return encryptor.encrypt(data);
  }