<script setup lang="ts">
const props = defineProps<{
  title: string
}>();
</script>

<template>
  <div class="conversation-header">
    <h1 class="conversation-header__title">{{ props.title }}</h1>
    <div class="conversation-header__actions">
      <button class="icon-btn" aria-label="Search">
        <img src="/search_button.svg" alt="search button" srcset="">
      </button>
    </div>
  </div>
</template>
