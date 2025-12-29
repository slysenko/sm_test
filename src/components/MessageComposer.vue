<script setup lang="ts">
import { ref, computed } from "vue";

import { useMessagesStore } from "../stores/messages";
import type { PostMessageRequest } from "@/handlers/types";
import { CHANNEL_WHATS_APP, COMPOSER_MAX_LINES } from "@/src/constants/app";
const messagesStore = useMessagesStore();

const text = ref("");
const attachedImageUrl = ref("")
const textareaRef = ref<HTMLTextAreaElement | null>(null);

defineEmits(["click"]);

const isSendButtonActive = computed(() => {
  return !!text.value || !!attachedImageUrl.value;
});

function autoResize() {
  const textarea = textareaRef.value;
  if (textarea) {
    textarea.style.height = 'auto';
    const newHeight = textarea.scrollHeight;

    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
    const maxLines = COMPOSER_MAX_LINES;
    const maxHeight = lineHeight * maxLines;

    if (newHeight > maxHeight) {
      textarea.style.height = maxHeight + 'px';
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.height = newHeight + 'px';
      textarea.style.overflowY = 'hidden';
    }
  }
};

function promptForImageUrl() {
  const url = window.prompt('Enter picture URL:');
  if (url) {
    attachedImageUrl.value = url.trim();
  }
};

function reset() {
  text.value = "";
  attachedImageUrl.value = "";
}

function createMessage() {
  const type = !!attachedImageUrl.value ? "image" : "text";
  let content: PostMessageRequest["content"] = { type };
  if (type === "image") {
    content = {
      ...content,
      imageUrl: attachedImageUrl.value,
      caption: text.value,
    }
  } else {
    content = {
      ...content,
      type,
      text: text.value,
    }
  }
  return content;
}

async function sendMessage() {
  const content = createMessage();
  await messagesStore.sendMessage({
    channel: CHANNEL_WHATS_APP,
    content,
  });
  reset();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.code === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

</script>

<template>
  <div class="composer">
    <div class="channel-selector">
      <div class="channel-selector__channel">
        <img src="/whatsapp_icon.svg" alt="" srcset="">
        <span class="channel-selector__name">WhatsApp (Forest hotel support WhatsApp)</span>
      </div>
      <div class="channel-selector__tags">
        <span class="tag tag--alert">2h</span>
      </div>
    </div>

    <div class="input-area">
      <div class="typing-area">
        <textarea ref="textareaRef" v-model.trim="text" class="typing-area__input" placeholder="Type your message here"
          @input="autoResize" @keydown="handleKeydown" rows="1"></textarea>
      </div>
      <div class="composer-footer">
        <div class="composer-actions">
          <button class="composer-icon-btn" aria-label="Add attachment" @click="promptForImageUrl">
            <img src="/add_attachment.svg" alt="add attachment button" srcset="">
          </button>
        </div>
        <button class="btn-send" :class="{ 'btn-send--active': isSendButtonActive }" @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>
