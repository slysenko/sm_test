<script setup lang="ts">
import { ref } from "vue";
import ConversationHeader from './ConversationHeader.vue';
import MessageList from "./MessageList.vue";
import MessageComposer from "./MessageComposer.vue";

const userName = ref("Alice Green");
</script>

<template>
  <main class="chat-container">
    <div class="chat">
      <ConversationHeader :title="userName" />
      <MessageList />
      <MessageComposer />
    </div>
  </main>
</template>
