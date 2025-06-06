"use client"
import { useSigner, useProvider, useAccount, useConnect } from "wagmi";
import { ethers } from "ethers";

// Extend the Window interface to include Talisman
declare global {
  interface Window {
    talismanEth?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

export function GetTransactionProvider()
{
    const {data: signer} = useSigner();
    const provider = useProvider();
    const { isConnected } = useAccount();
    const { connectors } = useConnect();
    
    console.log("=== GetTransactionProvider Debug ===");
    console.log("isConnected:", isConnected);
    console.log("signer:", signer);
    console.log("signer?.provider:", signer?.provider);
    console.log("provider:", provider);
    console.log("connectors:", connectors);
    console.log("====================================");
    
    // If we have a working signer with provider, return it as expected by CommonActionSetup
    if (signer && signer.provider) {
        return signer;
    }
    
    // If we have the provider but no signer, create a compatible object
    if (provider && isConnected) {
        try {
            return {
                provider: provider,
                getSigner: () => new ethers.providers.Web3Provider(provider as any).getSigner()
            };
        } catch (error) {
            console.error("Error creating provider wrapper:", error);
        }
    }
    
    // Try to get provider from Talisman directly if wagmi provider fails
    if (typeof window !== 'undefined' && window.talismanEth && isConnected) {
        try {
            const talismanProvider = window.talismanEth;
            const ethersProvider = new ethers.providers.Web3Provider(talismanProvider as any);
            return {
                provider: {
                    getSigner: () => ethersProvider.getSigner()
                }
            };
        } catch (error) {
            console.error("Error creating Talisman provider:", error);
        }
    }
    
    console.warn("No signer available");
    return null;
}