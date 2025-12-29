<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import DateSeparator from './DateSeparator.vue';
import MessageContainer from "./MessageContainer.vue";
import { useMessagesStore } from "../stores/messages";
import { storeToRefs } from "pinia";
import { INFINITE_SCROLL_DISTANCE } from "@/src/constants/app";

const messagesStore = useMessagesStore();
const { messagesWithDateSeparators, isLoading } = storeToRefs(messagesStore);
const conversationRef = ref<HTMLElement | null>(null);

function scrollToBottom() {
  const scrollElement = conversationRef.value;
  if (scrollElement) {
    scrollElement.scrollTop = scrollElement.scrollHeight;
  }
}

async function handleInitializeMessages() {
  await messagesStore.fetchMessages();
  await nextTick();
  scrollToBottom();
}

async function handleLoadMoreMessages() {
  const scrollElement = conversationRef.value;
  const previousScrollHeight = scrollElement?.scrollHeight || 0;

  await messagesStore.fetchMoreMessages();

  await nextTick();
  if (scrollElement) {
    const newScrollHeight = scrollElement.scrollHeight;
    scrollElement.scrollTop = newScrollHeight - previousScrollHeight;
  }
}

useInfiniteScroll(
  conversationRef,
  handleLoadMoreMessages,
  {
    distance: INFINITE_SCROLL_DISTANCE,
    direction: 'top',
  }
);

onMounted(() => {
  handleInitializeMessages();
});

watch(
  () => messagesStore.messages.length,
  (newLength, oldLength) => {
    if (newLength > oldLength) {
      nextTick(() => scrollToBottom());
    }
  }
);
</script>

<template>
  <div class="conversation" ref="conversationRef">
    <div class="conversation__content">
      <div v-if="isLoading" class="conversation__loading">
        Loading older messages...
      </div>
      <template v-for="item in messagesWithDateSeparators" :key="item.id">
        <DateSeparator v-if="item.type === 'date'" :date="item.data" />
        <MessageContainer v-else v-bind="item.data" />
      </template>
    </div>
  </div>
</template>
