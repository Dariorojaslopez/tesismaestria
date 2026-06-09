export type PublicUser = {
  id: string;
  email: string;
  names: string;
  address: string;
  department: string;
  city: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  names: string;
  address: string;
  department: string;
  city: string;
};

export type LoginInput = {
  email: string;
  password: string;
};
