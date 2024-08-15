<template>
  <div class="flex flex-row">
    <div class="relative w-6 h-6 rounded-md bg-[var(--primaryColor)]">
      <p class="absolute left-[48%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-lg">
        #
      </p>
    </div>
    <p class="ml-2 text-base align-top">{{ tag_name }}</p>
  </div>
  <p class="text ml-8">{{ props.view_count }} 浏览 · {{ props.discussion_count }} 讨论</p>
</template>

<script setup lang="ts">
const props = defineProps<{
  tag_id: number
  tag_name: string
  view_count: number
  discussion_count: number
}>()
</script>
