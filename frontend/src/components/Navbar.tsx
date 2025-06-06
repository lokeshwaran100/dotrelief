import React, { useState, useEffect } from 'react';
import { ethersProvider } from '../ethersProvider';

interface NavbarProps {
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  isWalletConnected: boolean;
  account?: string | null;
  walletType?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onConnectWallet, 
  onDisconnectWallet, 
  isWalletConnected, 
  account,
  walletType 
}) => {
  return (
    <nav className="bg-white shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-pink-500">
          Dot Relief
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <a href="#" className="text-gray-700 hover:text-pink-500 font-medium">Home</a>
          <a href="#" className="text-gray-700 hover:text-pink-500 font-medium">Donate</a>
          <a href="#" className="text-gray-700 hover:text-pink-500 font-medium">Contact Us</a>
          <a href="#" className="text-gray-700 hover:text-pink-500 font-medium">About</a>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 items-center">
          <button className="bg-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-pink-600 transition-colors">
            Start a Fundraise
          </button>
          
          {isWalletConnected ? (
            <div className="flex items-center space-x-3">
              {/* Wallet Info */}
              <div className="text-sm text-gray-600">
                <span className="font-medium text-green-600">{walletType}</span>
                <br />
                <span className="text-xs">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
              </div>
              
              {/* Disconnect Button */}
              <button 
                onClick={onDisconnectWallet}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors text-sm"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={onConnectWallet}
              className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}; 