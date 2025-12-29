import { computed, type MaybeRefOrGetter, toValue } from 'vue'

export function useDateFormatting() {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const normalizeDate = (date: Date) => {
    const normalized = new Date(date)
    normalized.setHours(0, 0, 0, 0)
    return normalized
  }

  const useFormattedTime = (timestamp: MaybeRefOrGetter<Date>) => {
    return computed(() => formatTime(toValue(timestamp)))
  }

  const useFormattedDate = (timestamp: MaybeRefOrGetter<Date>) => {
    return computed(() => formatDate(toValue(timestamp)))
  }

  return { formatTime, formatDate, normalizeDate, useFormattedTime, useFormattedDate }
}
