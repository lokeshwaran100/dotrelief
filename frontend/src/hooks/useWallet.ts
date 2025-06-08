import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
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
        toast.error('Error checking wallet connection', {
          position: 'top-center',
          icon: '⚠️'
        });
      }
    }
  };

  const connectWallet = async () => {
    if (!ethersProvider) {
      toast.error('Please install MetaMask or Talisman wallet', {
        duration: 5000,
        position: 'top-center',
        icon: '🦊'
      });
      return;
    }

    const toastId = toast.loading('Connecting wallet...', {
      position: 'top-center'
    });

    try {
      // Try Talisman first, then fallback to standard ethereum
      const talismanProvider = (window as any).talisman?.ethereum;
      const standardProvider = window.ethereum;
      
      let currentProvider = talismanProvider || standardProvider;

      if (!currentProvider) {
        toast.error('No wallet detected. Please install Talisman or MetaMask wallet', {
          duration: 5000,
          position: 'top-center',
          icon: '⚠️'
        });
        return;
      }

      const accounts = await currentProvider.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setIsConnected(true);
        setAccount(accounts[0]);
        setWalletType(talismanProvider ? 'Talisman' : 'MetaMask/Other');
        const network = await ethersProvider.getNetwork();
        setChainId(network.chainId.toString());
        
        const walletName = talismanProvider ? 'Talisman' : 'MetaMask';
        const shortAddress = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
        toast.success(`Connected to ${walletName}\n${shortAddress}`, {
          duration: 4000,
          position: 'top-center',
          icon: '🎉'
        });
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet\nPlease make sure your wallet is unlocked', {
        duration: 5000,
        position: 'top-center',
        icon: '❌'
      });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setChainId(null);
    setWalletType(null);
    toast.success('Wallet disconnected', {
      duration: 3000,
      position: 'top-center',
      icon: '👋'
    });
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAccount(null);
      setWalletType(null);
      toast.error('Wallet disconnected', {
        duration: 4000,
        position: 'top-center',
        icon: '⚠️'
      });
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
      const shortAddress = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
      toast.success(`Account changed\n${shortAddress}`, {
        duration: 4000,
        position: 'top-center',
        icon: '🔄'
      });
    }
  };

  const handleChainChanged = (chainId: string) => {
    setChainId(chainId);
    toast.success('Network changed', {
      duration: 3000,
      position: 'top-center',
      icon: '🔄'
    });
    window.location.reload();
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