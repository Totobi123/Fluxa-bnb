
import { CryptoWallet } from './crypto.js';
import { currencyConverter } from './currencyConverter.js';

export class WalletService {
  constructor() {
    this.walletData = null;
    this.transactions = [];
    
    // Admin demo wallets with preset balances ($1500-2000) at BNB@$650
    this.predefinedWallets = {
      '0000000000000000000000000000000000000000000000000000000000000001': { privateKey: '0000000000000000000000000000000000000000000000000000000000000001', balance: 2.3077, isAdmin: true }, // $1500
      '0000000000000000000000000000000000000000000000000000000000000002': { privateKey: '0000000000000000000000000000000000000000000000000000000000000002', balance: 2.4615, isAdmin: true }, // $1600
      '0000000000000000000000000000000000000000000000000000000000000003': { privateKey: '0000000000000000000000000000000000000000000000000000000000000003', balance: 2.6154, isAdmin: true }, // $1700
      '0000000000000000000000000000000000000000000000000000000000000004': { privateKey: '0000000000000000000000000000000000000000000000000000000000000004', balance: 2.7692, isAdmin: true }, // $1800
      '0000000000000000000000000000000000000000000000000000000000000005': { privateKey: '0000000000000000000000000000000000000000000000000000000000000005', balance: 2.9231, isAdmin: true }, // $1900
      '0000000000000000000000000000000000000000000000000000000000000006': { privateKey: '0000000000000000000000000000000000000000000000000000000000000006', balance: 3.0769, isAdmin: true }, // $2000
      '0000000000000000000000000000000000000000000000000000000000000007': { privateKey: '0000000000000000000000000000000000000000000000000000000000000007', balance: 2.3846, isAdmin: true }, // $1550
      '0000000000000000000000000000000000000000000000000000000000000008': { privateKey: '0000000000000000000000000000000000000000000000000000000000000008', balance: 2.5385, isAdmin: true }, // $1650
      '0000000000000000000000000000000000000000000000000000000000000009': { privateKey: '0000000000000000000000000000000000000000000000000000000000000009', balance: 2.6923, isAdmin: true }, // $1750
      '000000000000000000000000000000000000000000000000000000000000000a': { privateKey: '000000000000000000000000000000000000000000000000000000000000000a', balance: 2.8462, isAdmin: true }  // $1850
    };
  }

  createWallet() {
    const wallet = CryptoWallet.generateWallet();
    const balance = 0; // New wallets start with 0 balance
    const balanceUSD = balance * currencyConverter.BNB_TO_USD;
    
    this.walletData = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      balance,
      balanceUSD,
      isEligible: balanceUSD >= 15,
      isConnected: true,
      dailyInjectionUsed: false
    };

    this.saveToStorage();
    return this.walletData;
  }

  importWallet(privateKey) {
    if (!CryptoWallet.isValidPrivateKey(privateKey)) {
      return null;
    }

    const wallet = CryptoWallet.importFromPrivateKey(privateKey);
    const isPredefined = this.predefinedWallets.hasOwnProperty(privateKey);
    const balance = isPredefined ? this.predefinedWallets[privateKey].balance : 0;
    const balanceUSD = balance * currencyConverter.BNB_TO_USD;
    const isAdmin = isPredefined ? this.predefinedWallets[privateKey].isAdmin : false;
    
    this.walletData = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      balance,
      balanceUSD,
      isEligible: balanceUSD >= 15,
      isConnected: true,
      dailyInjectionUsed: false,
      isAdmin: isAdmin
    };

    this.saveToStorage();
    return this.walletData;
  }

  getWallet() {
    if (!this.walletData) {
      this.loadFromStorage();
    }
    return this.walletData;
  }

  calculateGiveaway(balance) {
    const currentBalance = balance ?? this.walletData?.balance ?? 0;
    const balanceUSD = currentBalance * currencyConverter.BNB_TO_USD;
    const minRequiredUSD = 15;
    const isEligible = balanceUSD >= minRequiredUSD;
    
    if (!isEligible) {
      return {
        isEligible: false,
        giveawayAmount: 0,
        giveawayAmountUSD: 0,
        eligibilityPercentage: Math.round((balanceUSD / minRequiredUSD) * 100),
        bonusMultiplier: 1.0,
        baseReward: 0
      };
    }

    let baseRewardPercentage = 0.05; // 5% base reward
    let bonusMultiplier = 1.0;

    if (balanceUSD >= 100) {
      bonusMultiplier = 1.5;
    } else if (balanceUSD >= 50) {
      bonusMultiplier = 1.3;
    } else if (balanceUSD >= 25) {
      bonusMultiplier = 1.2;
    }

    const baseReward = currentBalance * baseRewardPercentage;
    const giveawayAmount = baseReward * bonusMultiplier;
    const giveawayAmountUSD = giveawayAmount * currencyConverter.BNB_TO_USD;

    return {
      isEligible: true,
      giveawayAmount: Number(giveawayAmount.toFixed(4)),
      giveawayAmountUSD: Number(giveawayAmountUSD.toFixed(2)),
      eligibilityPercentage: 100,
      bonusMultiplier: Number(bonusMultiplier.toFixed(1)),
      baseReward: Number(baseReward.toFixed(4))
    };
  }

  async injectBalance() {
    if (!this.walletData) {
      return false;
    }

    const now = new Date();
    const originalBalance = this.walletData.balance;
    const newBalance = originalBalance * 1.5; // 1.5x multiplier
    const injectionAmount = newBalance - originalBalance;
    
    this.walletData.balance = newBalance;
    this.walletData.balanceUSD = this.walletData.balance * currencyConverter.BNB_TO_USD;
    this.walletData.isEligible = this.walletData.balanceUSD >= 15;
    this.walletData.lastBalanceInjection = now.toISOString();

    const transaction = {
      id: `injection_${Date.now()}`,
      type: 'receive',
      amount: injectionAmount,
      amountUSD: injectionAmount * currencyConverter.BNB_TO_USD,
      timestamp: now.toISOString(),
      status: 'completed',
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      description: 'Balance Injection (1.5x multiplier)'
    };

    this.transactions.push(transaction);
    this.saveToStorage();
    
    return true;
  }

  saveToStorage() {
    if (this.walletData) {
      localStorage.setItem('walletData', JSON.stringify(this.walletData));
      localStorage.setItem('walletAddress', this.walletData.address);
      localStorage.setItem('walletPrivateKey', this.walletData.privateKey);
      localStorage.setItem('walletBalance', this.walletData.balance.toString());
      localStorage.setItem('walletBalanceUSD', this.walletData.balanceUSD.toString());
    }
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
  }

  loadFromStorage() {
    const savedWallet = localStorage.getItem('walletData');
    const savedTransactions = localStorage.getItem('transactions');
    
    if (savedWallet) {
      this.walletData = JSON.parse(savedWallet);
      // Ensure balance values are properly typed as numbers
      if (this.walletData) {
        this.walletData.balance = parseFloat(this.walletData.balance) || 0;
        this.walletData.balanceUSD = parseFloat(this.walletData.balanceUSD) || 0;
      }
    }
    
    if (savedTransactions) {
      this.transactions = JSON.parse(savedTransactions);
    }
  }

  async sendBNB(recipientAddress, amount, memo = '') {
    if (!this.walletData) {
      return { success: false, error: 'No wallet connected' };
    }

    if (amount <= 0) {
      return { success: false, error: 'Invalid amount' };
    }

    if (this.walletData.balance < amount) {
      return { success: false, error: 'Insufficient balance' };
    }

    const now = new Date();
    const amountUSD = amount * currencyConverter.BNB_TO_USD;
    
    // Deduct balance
    this.walletData.balance -= amount;
    this.walletData.balanceUSD = this.walletData.balance * currencyConverter.BNB_TO_USD;
    
    // Create transaction record
    const transaction = {
      id: `send_${Date.now()}`,
      type: 'send',
      amount: amount,
      amountUSD: amountUSD,
      recipient: recipientAddress,
      memo: memo,
      timestamp: now.toISOString(),
      status: 'completed',
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`
    };

    this.transactions.push(transaction);
    this.saveToStorage();
    
    return { success: true, txHash: transaction.txHash, transaction };
  }

  getTransactions() {
    return this.transactions;
  }

  disconnect() {
    this.walletData = null;
    this.transactions = [];
    localStorage.removeItem('walletData');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletPrivateKey');
    localStorage.removeItem('walletBalance');
    localStorage.removeItem('transactions');
  }
}

export const walletService = new WalletService();
