<script setup lang="ts">
import { ref, watch } from 'vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { useAccountStore } from '../stores/accountStore';
import { accountTypeOptions } from '../types/account';
import type { Account, ValidationErrors } from '../types/account';

const props = defineProps<{
  account: Account;
}>();

const accountStore = useAccountStore();
const errors = ref<ValidationErrors>({});

// Локальное состояние для отслеживания значений формы
const localAccount = ref<Account>({ ...props.account });

// Для поля ввода меток нужно преобразовать массив объектов меток в строку
const labelsString = ref(localAccount.value.labels.map(label => label.text).join(';'));

// При обновлении строки меток, разбираем её и обновляем учетную запись
const updateLabels = (value: string) => {
  localAccount.value.labels = accountStore.parseLabels(value);
  labelsString.value = value;
  saveChanges();
};

// При изменении типа учетной записи, устанавливаем пароль в null если выбран LDAP
watch(() => localAccount.value.type, (newType) => {
  if (newType === 'LDAP') {
    localAccount.value.password = null;
  } else {
    localAccount.value.password = '';
  }
  saveChanges();
});

// Сохраняем изменения в хранилище и проводим валидацию
const saveChanges = () => {
  errors.value = accountStore.validateAccount(localAccount.value);
  
  // Обновляем только если нет ошибок
  if (Object.keys(errors.value).length === 0) {
    accountStore.updateAccount(localAccount.value);
  }
};

// Удаляем учетную запись
const deleteEntry = () => {
  accountStore.deleteAccount(props.account.id);
};

// Обновляем локальную учетную запись при изменении props
watch(() => props.account, (newAccount) => {
  localAccount.value = { ...newAccount };
  labelsString.value = newAccount.labels.map(label => label.text).join(';');
}, { deep: true });
</script>

<template>
  <div class="account-entry fade-in">
    <div class="grid">
      <div class="col-12 md:col-12 lg:col-4 mb-3">
        <label class="block mb-2">Метка</label>
        <InputText 
          class="w-full" 
          :class="{ 'p-invalid': errors.labels }" 
          :value="labelsString"
          maxlength="50"
          placeholder="Метка1;Метка2;Метка3"
          @input="(e) => updateLabels((e.target as HTMLInputElement).value)"
          @blur="saveChanges"
        />
        <small v-if="errors.labels" class="p-error">{{ errors.labels }}</small>
      </div>
      
      <div class="col-12 md:col-6 lg:col-2 mb-3">
        <label class="block mb-2">Тип записи</label>
        <Dropdown 
          class="w-full" 
          v-model="localAccount.type" 
          :options="accountTypeOptions" 
          optionLabel="label" 
          optionValue="value"
          placeholder="Выберите тип"
        />
      </div>
      
      <div class="col-12 md:col-6 lg:col-3 mb-3">
        <label class="block mb-2">Логин</label>
        <InputText 
          class="w-full" 
          :class="{ 'p-invalid': errors.login }" 
          v-model="localAccount.login" 
          maxlength="100"
          placeholder="Введите логин"
          @blur="saveChanges"
        />
        <small v-if="errors.login" class="p-error">{{ errors.login }}</small>
      </div>
      
      <div v-if="localAccount.type === 'LOCAL'" class="col-12 md:col-8 lg:col-2 mb-3">
        <label class="block mb-2">Пароль</label>
        <Password 
          class="w-full" 
          :class="{ 'p-invalid': errors.password }" 
          v-model="localAccount.password" 
          :feedback="false"
          maxlength="100"
          placeholder="Введите пароль"
          toggleMask
          @blur="saveChanges"
        />
        <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
      </div>
      
      <div class="col-12 md:col-4 lg:col-1 flex align-items-end justify-content-center mb-3">
        <Button 
          icon="pi pi-trash" 
          severity="danger" 
          text 
          rounded 
          aria-label="Удалить" 
          @click="deleteEntry"
          class="p-button-lg"
        />
      </div>
    </div>
  </div>
</template>