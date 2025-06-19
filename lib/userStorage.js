import { supabase } from '../services/supabaseClient';

export async function storeUser(user) {
  console.log('📝 Storing user:', {
    id: user.id,
    email: user.email,
    name: user.name,
    picture: user.picture
  });

  try {
    // First check if user exists
    console.log('🔍 Checking if user exists...');
    const { data: existingUser, error: fetchError } = await supabase
      .from('Users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchError) {
      console.error('❌ Error checking existing user:', {
        code: fetchError.code,
        message: fetchError.message,
        details: fetchError.details,
        hint: fetchError.hint
      });
      
      // If the error is not "not found", throw it
      if (fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
    }

    if (existingUser) {
      console.log('ℹ️ User already exists:', {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name
      });
      
      console.log('📝 Updating user information...');
      const { data: updatedUser, error: updateError } = await supabase
        .from('Users')
        .update({
          name: user.name,
          picture: user.picture,
          email: user.email
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error updating user:', {
          code: updateError.code,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint
        });
        throw updateError;
      }
      console.log('✅ User updated successfully:', updatedUser);
      return updatedUser;
    }

    console.log('ℹ️ Creating new user...');
    // Try direct insert first
    const { data: newUser, error: insertError } = await supabase
      .from('Users')
      .insert({
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        credits: 100 // Default credits for new users
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creating user:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });

      // If the error is about a missing column, let's check the table structure
      if (insertError.code === '42703') {
        console.log('🔍 Checking table structure...');
        const { data: tableInfo, error: tableError } = await supabase
          .from('Users')
          .select('*')
          .limit(1);

        if (tableError) {
          console.error('❌ Error checking table structure:', tableError);
        } else {
          console.log('📊 Table structure:', tableInfo);
        }
      }
      throw insertError;
    }

    console.log('✅ New user created successfully:', {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    });
    return newUser;
  } catch (error) {
    console.error('❌ Error in storeUser:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    throw error;
  }
}

export async function getUser(userId) {
  console.log('🔍 Fetching user:', userId);
  try {
    const { data: user, error } = await supabase
      .from('Users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Error fetching user:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('✅ User fetched successfully:', user ? {
      id: user.id,
      email: user.email,
      name: user.name,
      credits: user.credits
    } : 'not found');
    return user;
  } catch (error) {
    console.error('❌ Error in getUser:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    throw error;
  }
}

export async function updateUserCredits(userId, newCredits) {
  console.log('💳 Updating user credits:', { userId, newCredits });
  try {
    const { error } = await supabase
      .from('Users')
      .update({ credits: newCredits })
      .eq('id', userId);

    if (error) {
      console.error('❌ Error updating credits:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('✅ Credits updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error in updateUserCredits:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    throw error;
  }
}

export async function updateUserLastSignIn(email) {
  try {
    const { error } = await supabase
      .from('Users')
      .update({ 
        last_sign_in: new Date().toISOString()
      })
      .eq('email', email);

    if (error) {
      console.error('Error updating last sign in:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in updateUserLastSignIn:', error);
    throw error;
  }
} 