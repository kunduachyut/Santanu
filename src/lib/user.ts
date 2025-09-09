import { clerkClient } from '@clerk/nextjs/server';
import User, { IUser } from '@/models/User';
import { dbConnect } from '@/lib/db';

export async function getOrCreateUser(clerkUserId: string): Promise<any> {
  await dbConnect();
  
  // Try to find existing user
  let user = await (User as any).findOne({ clerkId: clerkUserId });
  
  if (user) {
    return user;
  }
  
  // If user doesn't exist, fetch from Clerk and create
  try {
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(clerkUserId);
    
    // Extract email - Clerk stores emails in an array
    const primaryEmail = clerkUser.emailAddresses.find(email => email.id === clerkUser.primaryEmailAddressId);
    const email = primaryEmail?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;
    
    if (!email) {
      throw new Error('User has no email address');
    }
    
    // Create new user
    user = await (User as any).create({
      clerkId: clerkUserId,
      email: email,
      firstName: clerkUser.firstName || undefined,
      lastName: clerkUser.lastName || undefined
    });
    
    return user;
  } catch (error) {
    console.error('Error fetching user from Clerk:', error);
    throw new Error('Failed to fetch user information');
  }
}

export async function getUserByClerkId(clerkUserId: string): Promise<any> {
  await dbConnect();
  const user = await (User as any).findOne({ clerkId: clerkUserId });
  return user;
}