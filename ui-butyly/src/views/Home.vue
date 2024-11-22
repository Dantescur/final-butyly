<script setup lang="ts">
import UrlShortener from "../components/UrlShortener.vue";
import LinksList from "../components/LinksList.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4">
        <h1 class="text-3xl font-bold text-gray-900">URL Shortener</h1>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <UrlShortener />
      <LinksList />
    </main>
  </div>
</template>
