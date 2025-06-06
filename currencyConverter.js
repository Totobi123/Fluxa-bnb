
export const currencyConverter = {
  BNB_TO_USD: 650,
  USD_TO_NGN: 1500,
  
  bnbToUsd(bnbAmount) {
    return bnbAmount * this.BNB_TO_USD;
  },
  
  usdToNgn(usdAmount) {
    return usdAmount * this.USD_TO_NGN;
  },
  
  bnbToNgn(bnbAmount) {
    const usd = this.bnbToUsd(bnbAmount);
    return this.usdToNgn(usd);
  }
};
