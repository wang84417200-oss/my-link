export interface LinkData {
  id: string;
  title: string;
  url: string;
  icon?: string;
  clicks: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface UserData {
  username: string;
  displayName: string;
  bio: string;
  photoURL: string;
}
