import { Session } from "better-auth";

export interface ExtendedUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  onboardingCompleted: boolean;
  childName?: string | null;
  childDob?: Date | null;
  childGender?: string | null;
  childClass?: number | null;
  schoolname?: string | null;
  phoneNumber?: string | null;
}

export interface ExtendedSession extends Omit<Session, 'user'> {
  user: ExtendedUser;
} 