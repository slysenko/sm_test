<script setup lang="ts">
import { type Component } from "vue";
import TextMessageContentComponent from "./messages/TextMessageContent.vue";
import ImageMessageContentComponent from "./messages/ImageMessageContent.vue";
import type { MessageContent } from "@/types/messages";
import { useDateFormatting } from "@/composables/useDateFormatting";


const props = withDefaults(
  defineProps<{
    content: MessageContent;
    isOutgoing: boolean;
    isDelivered: boolean;
    timestamp: Date;
    channel?: string;
  }>(),
  {
    isOutgoing: false,
    isDelivered: false,
  }
)

const { useFormattedTime } = useDateFormatting();

const formattedTime = useFormattedTime(() => props.timestamp);

const contentComponentMap: Record<MessageContent['type'], Component> = {
  text: TextMessageContentComponent,
  image: ImageMessageContentComponent,
};

</script>

<template>
  <div class="message-container" :class="[isOutgoing ? 'message-container--outgoing' : 'message-container--incoming']"
    v-memo="[content, isOutgoing, isDelivered, channel]">
    <div class="chat-bubble">
      <div class="chat-bubble__content"
        :class="[isOutgoing ? 'chat-bubble__content--outgoing' : 'chat-bubble__content--incoming']">
        <component :is="contentComponentMap[content.type]" v-bind="content" />
      </div>
      <div class="chat-bubble__footer"
        :class="[isOutgoing ? 'chat-bubble__footer--outgoing' : 'chat-bubble__footer--incoming']">
        <span v-if="props.isOutgoing && props.isDelivered" class="message-status">
          <img src="/message_status.svg" alt="message status" srcset="">
        </span>
        <span class="message-meta__channel">{{ props.channel }}</span>
        <span class="message-meta__dot"></span>
        <span class="message-meta__time">{{ formattedTime }}</span>
      </div>
    </div>
  </div>
</template>
