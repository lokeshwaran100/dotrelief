import { useState } from 'react';
import { Contract, parseEther } from 'ethers';
import { ethersProvider } from '../ethersProvider';
import { FundraiseFormData } from '../components/FundraiseModal';
import { createFundraise } from '../api/fundraise';
import { DOTRELIEF_CONTRACT_ADDRESS, DOTRELIEF_ABI } from '../constants/contracts';

export const useFundraise = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createFundraiseProposal = async (formData: FundraiseFormData, walletAddress: string) => {
    if (!ethersProvider) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);

    try {
      const signer = await ethersProvider.getSigner();
      
      // Create contract instance with constants
      const contract = new Contract(DOTRELIEF_CONTRACT_ADDRESS, DOTRELIEF_ABI, signer);

      let proposalId: number;
      let transactionResponse;

      // Create blockchain proposal based on type
      if (formData.type === 'Campaign') {
        // Calculate duration in seconds from end date
        const endDate = new Date(formData.endDate);
        const now = new Date();
        const durationInSeconds = Math.floor((endDate.getTime() - now.getTime()) / 1000);
        
        if (durationInSeconds <= 0) {
          throw new Error('End date must be in the future');
        }

        // Convert amount to Wei and ensure it's a BigInt
        const amountInWei = parseEther(formData.amount.toString());

        console.log('Creating campaign proposal...', {
          title: formData.title,
          duration: durationInSeconds,
          amount: amountInWei.toString(),
          contractAddress: DOTRELIEF_CONTRACT_ADDRESS
        });

        // Call contract function with proper BigInt parameters
        transactionResponse = await contract.createCampaignProposal(
          formData.title,
          BigInt(durationInSeconds),
          amountInWei
        );
      } else {
        // Direct Request
        console.log('Creating direct request proposal...', {
          title: formData.title,
          amount: parseEther(formData.amount.toString()).toString(),
          contractAddress: DOTRELIEF_CONTRACT_ADDRESS
        });

        // Call contract function with proper BigInt parameters
        transactionResponse = await contract.createDirectProposal(
          formData.title,
          parseEther(formData.amount.toString())
        );
      }

      console.log('Transaction sent:', transactionResponse.hash);
      
      // Wait for transaction confirmation
      const receipt = await transactionResponse.wait();
      console.log('Transaction confirmed:', receipt);

      if (!receipt) {
        throw new Error('Transaction failed');
      }

      // Get the proposal ID from the transaction logs
      const totalProposals = await contract.totalProposals();
      proposalId = Number(totalProposals) - 1; // Convert BigInt to number for proposal ID

      console.log('Proposal created with ID:', proposalId);

      // Save to MongoDB using API service
      const dbData = {
        proposalId,
        title: formData.title,
        name: formData.name,
        email: formData.email,
        description: formData.description,
        amount: formData.amount,
        type: formData.type,
        endDate: formData.type === 'Campaign' ? new Date(formData.endDate) : new Date(),
        driveLink: formData.driveLink,
        walletAddress
      };

      console.log('Saving to database...');
      const result = await createFundraise(dbData);
      console.log('Successfully saved to database:', result);

      return {
        success: true,
        proposalId,
        transactionHash: transactionResponse.hash,
        dbResult: result
      };

    } catch (error: any) {
      console.error('Error creating fundraise:', error);
      
      // Handle specific error types
      if (error.message.includes('user rejected')) {
        throw new Error('Transaction was cancelled by user');
      } else if (error.message.includes('insufficient funds')) {
        throw new Error('Insufficient funds for gas fees');
      } else if (error.message.includes('Cannot mix BigInt')) {
        throw new Error('Data type conversion error. Please try again.');
      } else if (error.message.includes('call revert exception')) {
        throw new Error('Smart contract execution failed. Please check your inputs and try again.');
      } else if (error.message.includes('only member')) {
        throw new Error('Only DAO members can create proposals. Please contact an admin to be added as a member.');
      } else {
        throw new Error(error.message || 'Failed to create fundraise');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createFundraiseProposal,
    isLoading
  };
}; 