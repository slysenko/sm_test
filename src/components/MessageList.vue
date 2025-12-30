<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';

import DateSeparator from './DateSeparator.vue';
import MessageContainer from "./MessageContainer.vue";

import { useMessagesStore } from "../stores/messages";
import { INFINITE_SCROLL_DISTANCE } from "@/src/constants/app";

const messagesStore = useMessagesStore();
const { messagesWithDateSeparators, isLoading } = storeToRefs(messagesStore);

const scrollerRef = ref<InstanceType<typeof DynamicScroller> | null>(null);

function scrollToBottom() {
  scrollerRef.value?.scrollToBottom();
}

async function handleInitializeMessages() {
  await messagesStore.fetchMessages();
  await nextTick();
  scrollToBottom();
}

async function handleLoadMoreMessages() {
  const scrollElement = scrollerRef.value?.$el;

  if (!scrollElement) return;

  const previousScrollHeight = scrollElement.scrollHeight;

  await messagesStore.fetchMoreMessages();

  await nextTick();

  const newScrollHeight = scrollElement.scrollHeight;
  scrollElement.scrollTop = newScrollHeight - previousScrollHeight;
}

useInfiniteScroll(
  () => scrollerRef.value?.$el as HTMLElement | null,
  async () => {
    if (isLoading.value) return;
    await handleLoadMoreMessages();
  },
  {
    distance: INFINITE_SCROLL_DISTANCE,
    direction: 'top',
  }
);

onMounted(() => {
  handleInitializeMessages();
});

watch(
  () => messagesStore.messages,
  (newMessages, oldMessages) => {
    if (oldMessages && newMessages.length > oldMessages.length && !isLoading.value) {
      const oldLastItem = oldMessages[oldMessages.length - 1];
      if (newMessages[newMessages.length - 2] === oldLastItem) {
        nextTick(() => scrollToBottom());
      }
    }
  }
);
</script>

<template>
  <div class="conversation-wrapper">

    <DynamicScroller ref="scrollerRef" :items="messagesWithDateSeparators" :min-item-size="60" class="conversation"
      key-field="id">
      <template #before>
        <div v-if="isLoading" class="conversation__loading">
          Loading older messages...
        </div>
      </template>

      <template #default="{ item, index, active }">
        <DynamicScrollerItem :item="item" :active="active" :size-dependencies="[
          item.data.text,
          item.data.image
        ]" :data-index="index">
          <div class="scroller-item-wrapper">
            <DateSeparator v-if="item.type === 'date'" :date="item.data" />
            <MessageContainer v-else v-bind="item.data" />
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>

  </div>
</template>

<style scoped>
.conversation-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: var(--color-white);
  border: 1px solid var(--color-grey-200);
  border-bottom: none;
  padding: var(--spacing-xl)
}

.scroller-item-wrapper {
  padding-bottom: var(--spacing-xl);
}
</style>
