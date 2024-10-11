interface UserInputData {
  id?: string;
  userName: string;
  email?: string;
  password: string;
  role: string;
  refreshToken?: string;
}

interface User {
  id: string;
  user_name: string;
  email?: string;
  role: string;
  refreshToken: string;
}

export { UserInputData, User };
