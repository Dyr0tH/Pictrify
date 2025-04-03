import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createServiceRoleClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check if the requester is an admin
    const { data: { user } } = await supabase.auth.getUser();

    
    if (!user) {
      return NextResponse.json({
        error: 'Unauthorized'
      }, { status: 401 });
    }
    console.log(`Checking admin status for user ID: ${user.id}`);
    
    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (userError || !userData || !userData.is_admin) {
      return NextResponse.json({
        error: 'Unauthorized - Admin access required'
      }, { status: 403 });
    }
    
    // Create a service role client to access auth tables
    const supabaseAdmin = createServiceRoleClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Fetch users data from auth.users table with service role client
    const { data: authUsers, error: authError } = await supabaseAdmin
      .from('users')  // This is actually the auth.users table when using admin
      .select('id, email, created_at, raw_user_meta_data')  // user_metadata is raw_user_meta_data in the admin API
      .order('created_at', { ascending: false });
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      throw new Error('Failed to fetch user data from auth tables');
    }
    
    // Fetch credits from public.users table (regular client is fine for this)
    const { data: userCredits, error: creditsError } = await supabase
      .from('users')
      .select('id, credits');
    
    if (creditsError) {
      throw creditsError;
    }
    
    // Combine the data
    const usersData = authUsers.map(authUser => {
      const userCredit = userCredits.find(uc => uc.id === authUser.id);
      return {
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.raw_user_meta_data?.full_name || 'N/A',
        created_at: authUser.created_at,
        credits: userCredit?.credits || 0
      };
    });
    
    return NextResponse.json({
      success: true,
      users: usersData
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    
    // Provide more detailed error message
    let errorMessage = 'An error occurred while fetching users';
    
    if (error instanceof Error) {
      errorMessage = `${errorMessage}: ${error.message}`;
      
      // Check for missing environment variables
      if (error.message.includes('service_role') || 
          !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        errorMessage = 'Configuration error: Missing service role key. Please check your environment variables.';
      }
    }
    
    return NextResponse.json({
      error: errorMessage
    }, { status: 500 });
  }
}
