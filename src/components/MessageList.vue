<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from "vue";
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import DateSeparator from './DateSeparator.vue';
import MessageContainer from "./MessageContainer.vue";
import { useMessagesStore, type MessageListItem } from "../stores/messages";
import { storeToRefs } from "pinia";
import { INFINITE_SCROLL_DISTANCE } from "@/src/constants/app";

const messagesStore = useMessagesStore();
const { messagesWithDateSeparators, isLoading } = storeToRefs(messagesStore);
const scrollerRef = ref<InstanceType<typeof DynamicScroller> | null>(null);
const isLoadingOlderMessages = ref(false);
const isInitialized = ref(false);

function scrollToBottom() {
  if (scrollerRef.value) {
    requestAnimationFrame(() => {
      scrollerRef.value?.scrollToBottom();
    });
  }
}

async function handleInitializeMessages() {
  await messagesStore.fetchMessages();
  await nextTick();
  scrollToBottom();
  requestAnimationFrame(() => {
    isInitialized.value = true;
  });
}

async function handleLoadMoreMessages() {
  if (isLoading.value || isLoadingOlderMessages.value || !messagesStore.hasMoreMessages) return;

  isLoadingOlderMessages.value = true;

  const previousItemCount = messagesWithDateSeparators.value.length;

  await messagesStore.fetchMoreMessages();

  await nextTick();

  if (scrollerRef.value && previousItemCount > 0) {
    const newItemCount = messagesWithDateSeparators.value.length;
    const addedCount = newItemCount - previousItemCount;
    if (addedCount > 0) {
      scrollerRef.value.scrollToItem(addedCount);
    }
  }

  isLoadingOlderMessages.value = false;
}

function onUpdate(startIndex: number) {
  if (isInitialized.value && startIndex <= INFINITE_SCROLL_DISTANCE && !isLoading.value) {
    handleLoadMoreMessages();
  }
}

onMounted(() => {
  handleInitializeMessages();
});

watch(
  () => messagesStore.messages.length,
  (newLength, oldLength) => {
    if (newLength > oldLength && !isLoadingOlderMessages.value) {
      nextTick(() => scrollToBottom());
    }
  }
);

function getSizeDependencies(item: MessageListItem) {
  if (item.type === 'message') {
    return [item.data.content];
  }
  return [item.data];
}
</script>

<template>
  <DynamicScroller ref="scrollerRef" class="conversation" list-class="conversation__content"
    :items="messagesWithDateSeparators" :min-item-size="20" key-field="id" :emit-update="true" @update="onUpdate">
    <template #before>
      <div v-if="isLoading" class="conversation__loading">
        Loading older messages...
      </div>
    </template>
    <template #default="{ item, index, active }">
      <DynamicScrollerItem :item="item" :active="active" :size-dependencies="getSizeDependencies(item)"
        :data-index="index">
        <DateSeparator v-if="item.type === 'date'" :date="item.data" />
        <MessageContainer v-else v-bind="item.data" />
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>
