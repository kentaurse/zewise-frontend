<template>
  <div class="w-screen h-screen bg-gray-200">
    <AvatarUpload :showModal="showModal" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import AvatarUpload from '../components/AvatarUpload.vue'

const showModal = ref(false)
</script>
