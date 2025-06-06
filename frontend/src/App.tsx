import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { useWallet } from './hooks/useWallet';
import './App.css';

function App() {
  const { isConnected, account, chainId, walletType, connectWallet, disconnectWallet } = useWallet();

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        onConnectWallet={connectWallet}
        onDisconnectWallet={disconnectWallet}
        isWalletConnected={isConnected}
        account={account}
        walletType={walletType}
      />
      <Hero />
      
      {/* Wallet Status (for development) - can be removed in production */}
      {isConnected && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg shadow-lg max-w-xs">
          <p className="text-sm">
            <strong>🎉 {walletType} Connected</strong><br/>
            Account: {account?.slice(0, 6)}...{account?.slice(-4)}<br/>
            Chain ID: {chainId}
          </p>
        </div>
      )}
      
      {/* Wallet Not Detected Warning */}
      {!window.ethereum && !(window as any).talisman?.ethereum && (
        <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg shadow-lg max-w-xs">
          <p className="text-sm">
            <strong>⚠️ No Wallet Detected</strong><br/>
            Please install Talisman or MetaMask wallet
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
