
"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { FundRaiseProps, CampaignCardProps, AddFundRaiseProps } from '../types';
import { storeFundDetails, donateCampaign  } from '../server/Actions';
import axios from 'axios';
import { CommonKarnaContractSetup,CommonCampaignContractSetup } from '@/helpers/commonSetup/CommonActionSetup';
import { ethers } from 'ethers';
import { secondsLeft } from '@/helpers/functions';
import { useToast } from '@/components/ui/use-toast';

// context type
interface FundRaiseContextType {
    daoMembers: string[];
    storeInitialFundDetails: (signer:any, ProductData:AddFundRaiseProps) => void;
    fundRaiseDetails: CampaignCardProps[];
    setFundRaiseDetails: React.Dispatch<React.SetStateAction<CampaignCardProps[]>>;
    donateToOrganisation: (signer:any, amount: number)=>void;
    donateToCampaign: (signer:any, amount: number, address: string, id:number)=>void;
    getNumberOfUpvotes: (signer:any, address: string)=>void;
    upvoteCampaign: (signer:any, address: string)=>void;
}

// Creating the context with an initial value
const FundRaiseContext = createContext<FundRaiseContextType | undefined>(undefined);

// Create a context provider component
interface FundRaiseContextProviderProps {
  children: React.ReactNode;
}

// provider for the user context
export const FundRaiseContextProvider: React.FC<FundRaiseContextProviderProps> = ({ children }) => {
  // for the toaster
  const { toast } = useToast();
  // to store all the dao members
  const [daoMembers, setDaoMembers] = useState<string[]>([]);
  // to store all the funds from the database
  const [fundRaiseDetails, setFundRaiseDetails] = useState<CampaignCardProps[]>([]);
  const url=process.env.NEXT_PUBLIC_URL;
  useEffect(()=>{
    getAllDaoMembers();
    getAllFundRaise();
  },[]);

  // a function to get all the fund details from the database
  const getAllFundRaise=async ()=>{
    try {
      const fundRaise=await axios.get(`${url}api/campaigns`);
      console.log("details from the database",fundRaise.data.message);
      setFundRaiseDetails(fundRaise.data.message);
    } catch (error) {
      console.log("some error occured", error);
    }
  }

  // a fucntion to get the list of dao members from the databse
  const getAllDaoMembers=async ()=>{
    try {
      setDaoMembers([""]);
    } catch (error) {
      console.log("some error occured", error);
      
    }
  }

  // a function to store the initial fund details
  const storeInitialFundDetails=async (signer:any,ProductData:AddFundRaiseProps)=>{
    try {
      if(ProductData.type==="Campaign")
      {
        const karna_contract=await CommonKarnaContractSetup(signer);
        const timeLeft:Number=secondsLeft(ProductData.endDate);
        const tx=await karna_contract?.createCampaignProposal(ProductData.title,timeLeft,ethers.utils.parseEther(ProductData.amount.toString()));
        const respose=await tx.wait();
        let proposalId=parseInt(respose.events[0].data);
        console.log("the proposal id is",proposalId);
        const newProductData:FundRaiseProps={proposalId,...ProductData};
        storeFundDetails(newProductData); 
        toast({
          title: "Sucess",
          description: "Transaction Excuted Sucessfully",
        });
      }
      else{
        const karna_contract=await CommonKarnaContractSetup(signer);
        const timeLeft:Number=secondsLeft(ProductData.endDate);
        const tx=await karna_contract?.createDirectProposal(ProductData.title,ethers.utils.parseEther(ProductData.amount.toString()));
        console.log("the tx is", tx, tx.wait());
        const respose=await tx.wait();
        let proposalId=parseInt(respose.events[0].data);
        console.log("the proposal id is",proposalId);
        const newProductData:FundRaiseProps={proposalId,...ProductData};
        storeFundDetails(newProductData); 
        toast({
          title: "Sucess",
          description: "Transaction Excuted Sucessfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Try Again",
        description: "Sorry the transaction failed",
      });
      console.log("error in the transaction", error);
    }
  }

  // a function to donate to the organisation
  const donateToOrganisation=async (signer:any, amount:number)=>{
    try{
      console.log("DONATE TO THE ORGANISATION INITIATED",amount);
      const campaign_contract=await CommonKarnaContractSetup(signer);
      const tx=await campaign_contract?.donate({value: ethers.utils.parseEther(amount.toString())});
      const respose=await tx.wait();
      toast({
        title: "Sucess",
        description: "Transaction Excuted Sucessfully",
      });
    }
    catch(e)
    {
      toast({
        variant: "destructive",
        title: "Try Again",
        description: "Sorry the transaction failed",
      });
      console.log("error in executing the transaction",e); 
    }
  }

  // to donate to a campaign
  const donateToCampaign=async (signer:any, amount:number, address: string, id: number)=>{
    try{
      console.log("DONATE TO THE CAMPAIGN INITIATED",amount,address);
      const campaign_contract=await CommonCampaignContractSetup(signer,address);
      const tx=await campaign_contract?.donate({value: ethers.utils.parseEther(amount.toString())});
      const respose=await tx.wait(2);
      await donateCampaign(id,amount);
      toast({
        title: "Sucess",
        description: "Transaction Excuted Sucessfully",
      });
    }
    catch(e)
    {
      toast({
        variant: "destructive",
        title: "Try Again",
        description: "Sorry the transaction failed",
      });
      console.log("there is an error in the donate context",e);
    }
  }

  // a function to get the number of upvotes
  const getNumberOfUpvotes=async (signer:any, address: string)=>{
    try{
      console.log("the data form the contract ",signer,address);
      const campaign_contract=await CommonCampaignContractSetup(signer,address);
      const upvotes=await campaign_contract?.totalUpvotes({ gasLimit: 500000 });
      console.log("the number of upvotes are",upvotes);
      return upvotes;
    }
    catch(e)
    {
      console.log(" there is an error ",e);
    }
  }

  // a function to upvote the campaign
  const upvoteCampaign=async (signer:any, address: string)=>{
    try{
      console.log("the data form the contract ",signer,address);
      const campaign_contract=await CommonCampaignContractSetup(signer,address);
      const tx=await campaign_contract?.upvote({ gasLimit: 500000 });
      const res=tx.wait();
      console.log("upvoted successfully");
      toast({
        title: "Sucess",
        description: "You Upvoted Successfully",
      });
    }
    catch(e)
    {
      toast({
        variant: "destructive",
        title: "Try Again",
        description: "Sorry the transaction failed",
      });
      console.log(" there is an error ",e);
    }
  }

  // add all the function here
  return <FundRaiseContext.Provider value={{storeInitialFundDetails, daoMembers, fundRaiseDetails, setFundRaiseDetails, donateToOrganisation, donateToCampaign, getNumberOfUpvotes, upvoteCampaign}}>{children}</FundRaiseContext.Provider>;
};

// custom hook for accessing the user context 
export const useFundRaiseContext = () => {
  const context = useContext(FundRaiseContext);
  if (!context) {
    throw new Error('useFundRaiseContext must be used within a FundRaiseContextProvider');
  }
  return context;
};
