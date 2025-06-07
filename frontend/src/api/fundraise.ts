import { supabase } from '../lib/supabase';

export interface FundraiseApiData {
  proposalId: number;
  title: string;
  name: string;
  email: string;
  description: string;
  amount: number;
  type: string;
  endDate: Date;
  driveLink: string;
  walletAddress: string;
}

export const createFundraise = async (data: FundraiseApiData) => {
  try {
    console.log('Creating fundraise with Supabase...', data);

    // Insert fundraise record
    const { data: fundraiseData, error: fundraiseError } = await supabase
      .from('fundraises')
      .insert({
        proposal_id: data.proposalId,
        title: data.title,
        name: data.name,
        email: data.email,
        description: data.description,
        amount: data.amount,
        type: data.type,
        end_date: data.endDate.toISOString(),
        drive_link: data.driveLink,
        wallet_address: data.walletAddress,
        approved: false,
        donated_amount: 0,
        upvotes: 0,
        deployed_contract_address: ""
      })
      .select()
      .single();

    if (fundraiseError) {
      console.error('Error creating fundraise:', fundraiseError);
      throw fundraiseError;
    }

    console.log('Fundraise created successfully:', fundraiseData);

    // Check if user exists
    const { data: existingUser, error: userFindError } = await supabase
      .from('users')
      .select('*')
      .eq('address', data.walletAddress)
      .single();

    if (userFindError && userFindError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error finding user:', userFindError);
      throw userFindError;
    }

    if (existingUser) {
      // Update existing user
      console.log('Updating existing user...', existingUser);
      const updatedCreated = [...(existingUser.created || []), data.proposalId];
      const updateData: any = { created: updatedCreated };
      
      if (!existingUser.name || existingUser.name === "") {
        updateData.name = data.name;
      }

      const { error: userUpdateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('address', data.walletAddress);

      if (userUpdateError) {
        console.error('Error updating user:', userUpdateError);
        throw userUpdateError;
      }
    } else {
      // Create new user
      console.log('Creating new user...', {
        name: data.name,
        address: data.walletAddress,
        proposalId: data.proposalId
      });
      const { error: userCreateError } = await supabase
        .from('users')
        .insert({
          name: data.name,
          address: data.walletAddress,
          upvoted: [],
          created: [data.proposalId]
        });

      if (userCreateError) {
        console.error('Error creating user:', userCreateError);
        throw userCreateError;
      }
    }

    console.log('User record updated successfully');

    return {
      success: true,
      data: fundraiseData,
      message: 'Fundraise created successfully'
    };

  } catch (error: any) {
    // Log the full error object for debugging
    console.error('Full error object:', error);
    console.error('Error type:', typeof error);
    console.error('Error constructor:', error.constructor?.name);
    console.error('Error stack:', error.stack);
    
    console.error('Detailed database error:', {
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code
    });
    
    // Provide more specific error messages based on the error type
    if (error?.code === '23505') { // Unique constraint violation
      throw new Error('A record with this information already exists');
    } else if (error?.message?.includes('Missing Supabase environment variables')) {
      throw new Error('Database configuration error: Supabase connection not configured');
    } else {
      throw new Error(`Database error: ${error?.message || 'Unknown error occurred'}`);
    }
  }
}; 