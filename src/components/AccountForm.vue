<script setup lang="ts">
import Button from 'primevue/button';
import { useAccountStore } from '../stores/accountStore';
import AccountEntry from './AccountEntry.vue';

const accountStore = useAccountStore();

const headerTitle = "Управление учетными записями";
const labelHint = "Введите текстовые метки через знак ;";

const handleAddAccount = () => {
  accountStore.addAccount();
};
</script>

<template>
  <div class="page-container">
    <div class="form-container">
      <div class="heading-container">
        <h1>{{ headerTitle }}</h1>
        <Button 
          icon="pi pi-plus" 
          outlined 
          severity="primary" 
          aria-label="Добавить учетную запись" 
          @click="handleAddAccount"
        />
      </div>
      
      <div class="field-hint">
        <i class="pi pi-info-circle mr-2"></i>{{ labelHint }}
      </div>
      
      <div v-if="accountStore.accounts.length === 0" class="empty-state p-4 text-center">
        <p class="text-neutral-500">Список учетных записей пуст</p>
        <Button 
          label="Добавить учетную запись" 
          icon="pi pi-plus" 
          @click="handleAddAccount"
        />
      </div>
      
      <div v-else class="account-list">
        <AccountEntry 
          v-for="account in accountStore.accounts" 
          :key="account.id" 
          :account="account" 
        />
      </div>
    </div>
  </div>
</template>