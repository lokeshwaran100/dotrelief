import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FundraiseModal, FundraiseFormData } from './components/FundraiseModal';
import { useWallet } from './hooks/useWallet';
import { useFundraise } from './hooks/useFundraise';
import './App.css';

function App() {
  const { isConnected, account, chainId, walletType, connectWallet, disconnectWallet } = useWallet();
  const { createFundraiseProposal, isLoading } = useFundraise();
  const [isFundraiseModalOpen, setIsFundraiseModalOpen] = useState(false);

  const handleStartFundraise = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first', {
        duration: 4000,
        position: 'top-center',
        icon: '🦊'
      });
      return;
    }
    setIsFundraiseModalOpen(true);
  };

  const handleFundraiseSubmit = async (formData: FundraiseFormData) => {
    if (!account) {
      toast.error('Wallet not connected', {
        duration: 4000,
        position: 'top-center',
        icon: '🦊'
      });
      return;
    }

    const toastId = toast.loading('Creating fundraise...', {
      position: 'top-center'
    });

    try {
      const result = await createFundraiseProposal(formData, account);
      toast.success(
        <div>
          <p>Fundraise created successfully!</p>
          <p className="text-sm mt-1">Proposal ID: {result.proposalId}</p>
          <p className="text-xs mt-1 text-gray-500 break-all">{result.transactionHash}</p>
        </div>,
        {
          duration: 5000,
          position: 'top-center',
          icon: '🎉'
        }
      );
      setIsFundraiseModalOpen(false);
    } catch (error: any) {
      console.error('Error creating fundraise:', error);
      toast.error(
        <div>
          <p>Failed to create fundraise</p>
          <p className="text-sm mt-1 text-red-500">{error.message}</p>
        </div>,
        {
          duration: 5000,
          position: 'top-center',
          icon: '❌'
        }
      );
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster />
      <Navbar 
        onConnectWallet={connectWallet}
        onDisconnectWallet={disconnectWallet}
        onStartFundraise={handleStartFundraise}
        isWalletConnected={isConnected}
        account={account}
        walletType={walletType}
      />
      <Hero />
      
      {/* Fundraise Modal */}
      <FundraiseModal
        isOpen={isFundraiseModalOpen}
        onClose={() => setIsFundraiseModalOpen(false)}
        onSubmit={handleFundraiseSubmit}
        isLoading={isLoading}
      />
      
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
