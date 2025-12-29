<script setup lang="ts">
import { useDateFormatting } from "@/composables/useDateFormatting";

const { useFormattedDate } = useDateFormatting();

const props = defineProps<{
  date: Date
}>();

const formattedDate = useFormattedDate(() => props.date);
</script>

<template>
  <div class="date-separator">
    <div class="date-separator__line"></div>
    <span class="date-separator__text">{{ formattedDate }}</span>
    <div class="date-separator__line"></div>
  </div>
</template>
