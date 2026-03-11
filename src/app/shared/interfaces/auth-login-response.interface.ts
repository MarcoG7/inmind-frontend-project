export interface ILoginResponse {
  token: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    dateOfBirth: string;
    bio: string;
    createdAt: string;
    updatedAt: string;
  };
}
