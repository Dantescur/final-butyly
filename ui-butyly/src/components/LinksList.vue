<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Recent Links</h2>

    <div v-if="isLoading" class="text-center py-8">Loading...</div>

    <div v-else-if="links.length === 0" class="text-center py-8 text-gray-500">
      No links found
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="link in links"
        :key="link.shortId"
        class="bg-white p-4 rounded-lg shadow"
      >
        <div
          class="flex flex-col sm:flex-row justify-between items-start gap-4"
        >
          <div class="flex-1">
            <h3
              class="font-medium truncate text-sm sm:text-base"
              :title="link.originalUrl"
            >
              {{ truncateUrl(link.originalUrl) }}
            </h3>
            <p class="text-sm text-blue-500 mt-1">
              <a :href="link.shortId" target="_blank" rel="noopener">
                {{ link.shortId }}
              </a>
            </p>
          </div>
          <div class="flex flex-col items-end gap-2">
            <div class="text-sm text-gray-500">
              Expires: {{ link.expiresIn }}
            </div>
            <button
              @click="viewAnalytics(link.shortId)"
              class="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              View Analytics
            </button>
          </div>
          <!-- <div class="text-sm text-gray-500 mt-2 sm:mt-0">
            Expires: {{ link.expiresIn }}
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAllLinks } from "../api";
import type { LinkDetails } from "../types";
import { useRouter } from 'vue-router';

const router = useRouter()
const links = ref<LinkDetails[]>([]);
const isLoading = ref(true);

const viewAnalytics = (shortId: string) => {
  router.push(`/analytics/${shortId}`);
};

const truncateUrl = (url: string): string => {
  const maxLength = 40;
  return url.length > maxLength ? `${url.slice(0, maxLength)}...` : url;
};

onMounted(async () => {
  try {
    const data = await getAllLinks();
    links.value = data.links;
  } catch (error) {
    console.error("Failed to fetch links:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
@media (max-width: 640px) {
  .truncate {
    width: 100%;
  }

  .text-sm {
    font-size: 0.875rem;
  }
}

@media (min-width: 640px) {
  .truncate {
    width: auto;
  }
}
</style>
