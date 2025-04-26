import { User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient'

/**
 * subscribeAuthState:
 *  Calls the provided callback whenever the auth state changes.
 */
export const subscribeAuthState = (
    callback: (user: User | null) => void
): (() => void) => {
    const { data: listener } = supabase.auth.onAuthStateChange(
        (event, session) => {
            const user = session?.user ?? null;
            if (user) {
                console.log('User signed in:', user.id);
            } else {
                console.log('User signed out');
            }
            callback(user);
        }
    );
    // Return an unsubscribe function
    return () => {
        listener?.subscription.unsubscribe();
    };
};

/**
 * signUpWithEmail:
 *  Registers a new user using email & password.
 */
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<User | null> => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error('Sign-up error:', error.message);
    return null;
  }
  return data.user;
};

/**
 * signInWithEmail:
 *  Logs in an existing user using email & password.
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User | null> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Sign-in error:', error.message);
    return null;
  }
  return data.user;
};

/**
 * signOutUser:
 *  Signs out the current user.
 */
export const signOutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign-out error:', error.message);
  }
};

/**
 * signInWithProvider:
 *  Initiates OAuth login with the given provider.
 */
export const signInWithProvider = async (
  provider: 'google' | 'github' | 'facebook' | 'twitter'
): Promise<void> => {
  const { error } = await supabase.auth.signInWithOAuth({ provider });
  if (error) {
    console.error('OAuth sign-in error:', error.message);
  }
};

/**
 * sendPasswordResetEmail:
 *  Sends a password recovery email to the provided address.
 */
export const sendPasswordResetEmail = async (
  email: string
): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail?.(email) 
    ?? await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    console.error('Password reset error:', error.message);
  } else {
    console.log('Password reset email sent to', email);
  }
};

/**
 * getCurrentUser:
 *  Retrieves the currently authenticated user, or null if none is signed in.
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Get current user error:', error.message);
    return null;
  }
  return user;
};
