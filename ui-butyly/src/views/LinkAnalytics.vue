<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAnalytics } from "../api";
import type { LinkAnalytics } from "../types";

const route = useRoute();
const router = useRouter();

const analytics = ref<LinkAnalytics | null>(null);
const isLoading = ref(true);
const currentPage = ref(1);
const itemsPerPage = 10;

const loadAnalytics = async () => {
  isLoading.value = true;
  try {
    analytics.value = await getAnalytics(
      route.params.id as string,
      currentPage.value,
      itemsPerPage,
    );
  } catch (error) {
    console.error("Failed to get analytics: ", error);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const goBack = () => {
  router.push("/");
};

const nextPage = () => {
  if (
    analytics.value &&
    currentPage.value * itemsPerPage < analytics.value.totalVisits
  ) {
    currentPage.value++;
    loadAnalytics();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadAnalytics();
  }
};

onMounted(loadAnalytics);
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w 4xl mx-auto px-4">
      <div class="flex items-center mb-6">
        <button @click="goBack" class="text-blue-500 hover:text-blue-700 flex items-center">
          <- Back to Home
        </button>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h1 class="text-2xl font-bold mb-6">Link Analytics</h1>

        <div v-if="isLoading" class="text-center py-8">
          Loading analytics...
        </div>

        <template v-else-if="analytics">
          <div class="mb-6">
            <p class="text-lg">
              Total Visits: <span class="font-semibold">{{ analytics.totalVisits }}</span>
            </p>
          </div>

          <div class="space-y-4">
            <div v-for="(click, index) in analytics.details" :key="index"
              class="border rounded p-4 hover:bg-gray-50"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p class="text-sm text-gray-600">Time:</p>
                  <p class="font-medium">{{ formatDate(click.timestamp) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">IP Address:</p>
                  <p class="font-medium">{{ click.ip }}</p>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm text-gray-600">User Agent:</p>
                  <p class="font-medium">{{ click.userAgent }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-between items-center">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {{ currentPage }}</span>
            <button
              @click="nextPage"
              :disabled="!analytics.details.length || analytics.details.length < itemsPerPage"
              class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </template>

        <div v-else class="text-center py-8 text-gray-500">
          No analytics data available
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
