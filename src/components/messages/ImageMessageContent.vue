<script setup lang="ts">
import { ref } from 'vue';
import VLazyImage from "v-lazy-image";

const props = defineProps<{
  imageUrl: string;
  caption?: string;
}>();

const hasError = ref(false);

const isLoaded = ref(false);

function handleError() {
  hasError.value = true;
};

function handleLoad() {
  isLoaded.value = true;
}
</script>

<template>
  <div class="image-message">
    <div class="chat-bubble__media">
      <div v-if="hasError" class="image-error">
        Failed to load image
      </div>
      <template v-else>
        <div v-if="!isLoaded" class="spinner"></div>
      </template>
      <v-lazy-image :src="imageUrl" :alt="caption || 'Image'" :class="{ 'hidden-image': !isLoaded }" sizes="264px"
        @error="handleError" @load="handleLoad" />
    </div>
    <p v-if="props.caption" class="chat-bubble__text">{{ props.caption }}</p>
  </div>
</template>

<style scoped>
.image-message {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 185px;
  background: var(--color-grey-100);
  border-radius: var(--radius-lg);
  color: var(--color-grey-600);
  font-size: var(--font-size-sm);
}

.hidden-image {
  opacity: 0;
  position: absolute;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  z-index: 10;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
