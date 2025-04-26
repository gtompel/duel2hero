import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Account, ValidationErrors } from '../types/account';

export const useAccountStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([]);
  
  const addAccount = () => {
    const newAccount: Account = {
      id: generateId(),
      labels: [],
      type: 'LOCAL',
      login: '',
      password: '',
    };
    accounts.value.push(newAccount);
  };
  
  const updateAccount = (updatedAccount: Account) => {
    const index = accounts.value.findIndex(acc => acc.id === updatedAccount.id);
    if (index !== -1) {
      accounts.value[index] = { ...updatedAccount };
    }
  };
  
  const deleteAccount = (id: string) => {
    accounts.value = accounts.value.filter(acc => acc.id !== id);
  };
  
  const validateAccount = (account: Account): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    // Валидация логина
    if (!account.login.trim()) {
      errors.login = 'Логин обязателен к заполнению';
    } else if (account.login.length > 100) {
      errors.login = 'Максимальная длина логина 100 символов';
    }
    
    // Валидация пароля (только если тип учетной записи LOCAL)
    if (account.type === 'LOCAL') {
      if (!account.password) {
        errors.password = 'Пароль обязателен к заполнению';
      } else if (account.password.length > 100) {
        errors.password = 'Максимальная длина пароля 100 символов';
      }
    }
    
    // Валидация меток
    const labelsText = account.labels.map(label => label.text).join(';');
    if (labelsText.length > 50) {
      errors.labels = 'Максимальная длина меток 50 символов';
    }
    
    return errors;
  };
  
  const parseLabels = (labelsString: string): { text: string }[] => {
    if (!labelsString.trim()) return [];
    
    return labelsString
      .split(';')
      .filter(label => label.trim() !== '')
      .map(label => ({ text: label.trim() }));
  };
  
  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
  };
  
  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    validateAccount,
    parseLabels
  };
}, {
  persist: true
});