import { BrowserProvider } from "ethers";

// Check for different wallet providers
const getWalletProvider = () => {
  // Check for Talisman wallet specifically
  if (typeof window !== 'undefined' && (window as any).talisman?.ethereum) {
    console.log("Talisman wallet detected (Ethereum mode)");
    return (window as any).talisman.ethereum;
  }
  
  // Check for standard Ethereum provider (MetaMask, Talisman in Ethereum mode, etc.)
  if (typeof window !== 'undefined' && window.ethereum) {
    console.log("Ethereum wallet detected");
    return window.ethereum;
  }
  
  console.warn("No Web3 wallet detected. Please install MetaMask or Talisman wallet.");
  return null;
};

const walletProvider = getWalletProvider();

export const ethersProvider = walletProvider ? new BrowserProvider(walletProvider) : null;
