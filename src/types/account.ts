export type AccountType = 'LDAP' | 'LOCAL';

export interface Label {
  text: string;
}

export interface Account {
  id: string;
  labels: Label[];
  type: AccountType;
  login: string;
  password: string | null;
}

export interface ValidationErrors {
  login?: string;
  password?: string;
  labels?: string;
}

export const accountTypeOptions = [
  { label: 'LDAP', value: 'LDAP' },
  { label: 'Локальная', value: 'LOCAL' }
];