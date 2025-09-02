export interface AuthUser {
  id: string;
  email: string;
  name: string;
  referralCode: string;
}

export const signUpWithEmail = async (
  email: string, 
  password: string, 
  name: string,
  referralCode?: string
) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a mock user ID and referral code
  const mockUser = {
    id: Math.random().toString(36).substring(2, 15),
    email,
    user_metadata: { name }
  };

  const mockProfile = {
    id: mockUser.id,
    email,
    name,
    referral_code: `${name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 8)}`,
  };

  return {
    user: mockUser,
    profile: mockProfile,
  };
};

export const signInWithEmail = async (email: string, password: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockUser = {
    id: Math.random().toString(36).substring(2, 15),
    email,
  };

  const mockProfile = {
    id: mockUser.id,
    email,
    name: 'Demo User',
    referral_code: `demo-${Math.random().toString(36).substring(2, 8)}`,
  };

  return {
    user: mockUser,
    profile: mockProfile,
  };
};

export const signOut = async () => {
  // Simulate sign out
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  // Return null as there's no persistent authentication
  return null;
};

export const getAuthStateChange = () => {
  // Return a mock function since there's no real auth state to monitor
  return () => {};
};