
"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CommonKarnaContractSetup } from '@/helpers/commonSetup/CommonActionSetup';
import { executeCampaign } from '../server/Actions';
import { useAccount } from 'wagmi';
import { useToast } from '@/components/ui/use-toast';
// context type
interface DaoContextType {
    approveCampiagn:(signer:any, id:number)=>void;
    addMembers:(signer:any, address:string)=>void;
    isDaoMember:(signer:any)=>Promise<boolean>;
}

// Creating the context with an initial value
const DaoContext = createContext<DaoContextType | undefined>(undefined);

// Create a context provider component
interface DaoContextProviderProps {
  children: React.ReactNode;
}

// provider for the user context
export const DaoContextProvider: React.FC<DaoContextProviderProps> = ({ children }) => {
    // toaster
    const {toast}=useToast();
    // to get the address
    const {address}=useAccount();
    // to check if the member is a dao member
    const isDaoMember=async(signer:any)=> {
      try {
          // Call the contract function
          console.log("signer check in the context",signer);
          const campaign_contract=await CommonKarnaContractSetup(signer);
          console.log("the address is",address);
          const isMember = await campaign_contract?.isDaoMember(address);
          console.log("Is member from the context:",campaign_contract,isMember);
          toast({
            title: "Sucess",
            description: "Transaction Excuted Sucessfully",
          });
          return isMember;
      } catch (error) {
          toast({
            variant: "destructive",
            title: "Try Again",
            description: "Sorry the transaction failed",
          });
          console.log("Error:", error);
          return false;
      }
    }

    // to approve campaign by the dao members
    const approveCampiagn=async(signer:any, id:number)=>{
      try{
        console.log("aproving proposal",id);
        const karna_contract=await CommonKarnaContractSetup(signer);
        console.log("contract from the setup",karna_contract);
        const tx=await karna_contract?.vote(id, { gasLimit: 5000000 });
        const respose=await tx.wait();
        const proposal=await karna_contract?.proposals(id);
        console.log("the resposne is",respose.events[1].args[1]);
        console.log("the proposal details",proposal);
        toast({
          title: "Sucess",
          description: "Voted to the Proposal Sucessfully",
        });
        if(proposal[3])
        {
          console.log("the resposne is",respose);
          const address=respose.events[1].args[1];
          await executeCampaign(id,address);
        }
      }
      catch(e)
      {
        toast({
          variant: "destructive",
          title: "Try Again",
          description: "Sorry the transaction failed",
        });
        console.log("the error message is",e);
      }
    }

    // to add members to the dao
    const addMembers=async(signer:any, address:string)=>{
      try{
        console.log("add member",address);
        const karna_contract=await CommonKarnaContractSetup(signer);
        console.log("contract from the setup",karna_contract);
        const respose=await karna_contract?.addMember(address);
        toast({
          title: "Sucess",
          description: "Added a DAO Member successfully"
        });
      }
      catch(e)
      {
        toast({
          variant: "destructive",
          title: "Try Again",
          description: "Sorry the transaction failed",
        });
        console.log("the error message is",e);
      }
    }
  // add all the function here
  return <DaoContext.Provider value={{approveCampiagn, addMembers, isDaoMember}}>{children}</DaoContext.Provider>;
};

// custom hook for accessing the user context 
export const useDaoContext = () => {
  const context = useContext(DaoContext);
  if (!context) {
    throw new Error('useDaoContext must be used within a DaoContextProvider');
  }
  return context;
};
