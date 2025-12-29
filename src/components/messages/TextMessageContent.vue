<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <p class="chat-bubble__text">{{ text }}</p>
</template>

<style scoped></style>
