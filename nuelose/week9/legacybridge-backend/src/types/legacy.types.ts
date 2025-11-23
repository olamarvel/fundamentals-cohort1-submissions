export interface LegacyUser {
  id: number;
  name: string;
  username: string;
  email: string;
  company: {
    name: string;
  };
}

export interface LegacyPost {
  userId: number;
  id: number;
  title: string;
  body: string;
  amount: number
}
