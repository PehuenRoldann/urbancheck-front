export interface User {
  id?: string;
  authProviderId: string;
  email: string;
  dni: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  postalCode?: number | null;
  street?: string | null;
  streetNumber?: number | null;
  roleId: number;
  its?: Date;
  uts?: Date | null;
  dts?: Date | null;
}
