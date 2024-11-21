<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { shortenUrl } from '../api';
import type { ShortenedUrl } from '../types';

const toast = useToast();
const url = ref('');
const expiration = ref('24h');
const isLoading = ref(false);
const result = ref<ShortenedUrl | null>(null);

const handleSubmit = async () => {
  if (!url.value) {
    toast.error('Please enter a URL');
    return;
  }

  isLoading.value = true;
  try {
    result.value = await shortenUrl(url.value, expiration.value);
    toast.success('URL shortened successfully!');
  } catch (error) {
    toast.error('Failed to shorten URL');
  } finally {
    isLoading.value = false;
  }
};

const copyToClipboard = async () => {
  if (!result.value) return;
  
  try {
    await navigator.clipboard.writeText(result.value.shortUrl);
    toast.success('Copied to clipboard!');
  } catch (error) {
    toast.error('Failed to copy to clipboard');
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8 text-center">URL Shortener</h1>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">URL to Shorten</label>
        <input
          v-model="url"
          type="url"
          required
          placeholder="https://example.com"
          class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2">Expiration Time</label>
        <select
          v-model="expiration"
          class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="1h">1 Hour</option>
          <option value="12h">12 Hours</option>
          <option value="24h">24 Hours</option>
          <option value="7d">7 Days</option>
          <option value="30d">30 Days</option>
        </select>
      </div>
      
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {{ isLoading ? 'Shortening...' : 'Shorten URL' }}
      </button>
    </form>
    
    <div v-if="result" class="mt-8 p-4 bg-gray-50 rounded">
      <h2 class="text-lg font-semibold mb-2">Shortened URL</h2>
      <div class="flex items-center gap-2">
        <input
          :value="result.shortUrl"
          readonly
          class="flex-1 p-2 border rounded bg-white"
        />
        <button
          @click="copyToClipboard"
          class="bg-gray-200 p-2 rounded hover:bg-gray-300"
        >
          Copy
        </button>
      </div>
      <p class="mt-2 text-sm text-gray-600">
        Expires in: {{ result.expiresIn }}
      </p>
    </div>
  </div>
</template>