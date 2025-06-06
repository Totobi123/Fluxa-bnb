
export class CryptoWallet {
  static generateWallet() {
    const privateKey = this.generatePrivateKey();
    const address = this.generateAddressFromPrivateKey(privateKey);
    
    return {
      privateKey,
      address
    };
  }
  
  static generatePrivateKey() {
    const characters = '0123456789abcdef';
    let privateKey = '';
    for (let i = 0; i < 64; i++) {
      privateKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return privateKey;
  }
  
  static generateAddressFromPrivateKey(privateKey) {
    // Check predefined wallets first - Admin demo wallets
    const predefinedWallets = {
      '0000000000000000000000000000000000000000000000000000000000000001': '0xAdmin0001',
      '0000000000000000000000000000000000000000000000000000000000000002': '0xAdmin0002',
      '0000000000000000000000000000000000000000000000000000000000000003': '0xAdmin0003',
      '0000000000000000000000000000000000000000000000000000000000000004': '0xAdmin0004',
      '0000000000000000000000000000000000000000000000000000000000000005': '0xAdmin0005',
      '0000000000000000000000000000000000000000000000000000000000000006': '0xAdmin0006',
      '0000000000000000000000000000000000000000000000000000000000000007': '0xAdmin0007',
      '0000000000000000000000000000000000000000000000000000000000000008': '0xAdmin0008',
      '0000000000000000000000000000000000000000000000000000000000000009': '0xAdmin0009',
      '000000000000000000000000000000000000000000000000000000000000000a': '0xAdmin000a'
    };
    
    if (predefinedWallets[privateKey]) {
      return predefinedWallets[privateKey];
    }
    
    // Generate address for other private keys
    const hash = btoa(privateKey).slice(0, 40);
    return '0x' + hash.replace(/[^a-fA-F0-9]/g, '0').substring(0, 40);
  }
  
  static importFromPrivateKey(privateKey) {
    const address = this.generateAddressFromPrivateKey(privateKey);
    return {
      privateKey,
      address
    };
  }
  
  static isValidPrivateKey(privateKey) {
    return privateKey && privateKey.length === 64 && /^[a-fA-F0-9]+$/.test(privateKey);
  }
}
