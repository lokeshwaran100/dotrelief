import { useState, useEffect } from 'react';
import { ethersProvider } from '../ethersProvider';

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
    
    // Listen for account changes on different wallet providers
    const providers = [window.ethereum, (window as any).talisman?.ethereum].filter(Boolean);
    
    providers.forEach(provider => {
      if (provider) {
        provider.on('accountsChanged', handleAccountsChanged);
        provider.on('chainChanged', handleChainChanged);
      }
    });

    return () => {
      providers.forEach(provider => {
        if (provider) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleChainChanged);
        }
      });
    };
  }, []);

  const checkConnection = async () => {
    if (ethersProvider) {
      try {
        // Check Talisman first
        const talismanProvider = (window as any).talisman?.ethereum;
        const standardProvider = window.ethereum;
        
        let currentProvider = talismanProvider || standardProvider;
        
        if (currentProvider) {
          const accounts = await currentProvider.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setIsConnected(true);
            setAccount(accounts[0]);
            setWalletType(talismanProvider ? 'Talisman' : 'MetaMask/Other');
            const network = await ethersProvider.getNetwork();
            setChainId(network.chainId.toString());
          }
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!ethersProvider) {
      alert('Please install MetaMask or Talisman wallet');
      return;
    }

    try {
      // Try Talisman first, then fallback to standard ethereum
      const talismanProvider = (window as any).talisman?.ethereum;
      const standardProvider = window.ethereum;
      
      let currentProvider = talismanProvider || standardProvider;

      if (!currentProvider) {
        alert('No wallet detected. Please install Talisman or MetaMask wallet.');
        return;
      }

      const accounts = await currentProvider.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setIsConnected(true);
        setAccount(accounts[0]);
        setWalletType(talismanProvider ? 'Talisman' : 'MetaMask/Other');
        const network = await ethersProvider.getNetwork();
        setChainId(network.chainId.toString());
        
        console.log(`Connected to ${talismanProvider ? 'Talisman' : 'MetaMask/Other'} wallet`);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please make sure your wallet is unlocked and try again.');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setChainId(null);
    setWalletType(null);
    console.log('Wallet disconnected');
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAccount(null);
      setWalletType(null);
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
    }
  };

  const handleChainChanged = (chainId: string) => {
    setChainId(chainId);
    window.location.reload(); // Reload the page when network changes
  };

  return {
    isConnected,
    account,
    chainId,
    walletType,
    connectWallet,
    disconnectWallet
  };
}; 