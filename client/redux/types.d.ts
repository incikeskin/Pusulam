export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  role?: string; // ileride backend’den role gelirse
}