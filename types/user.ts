export type UserProfile = {
  uid: string;
  displayName: string;
  email: string;
  avatar?: string;
  premium: boolean;
  familyIds: string[];
  createdAt: string;
};
