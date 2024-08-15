<template>
  <n-modal
    v-model:show="show"
    style="width: 600px; position: fixed; top: 200px; left: 50%; transform: translateX(-50%)"
  >
    <div class="rounded-2xl p-3 bg-white">
      <n-input-group>
        <n-input size="large" placeholder="输入关键词以搜索" v-model:value="searchContent" />
        <n-button size="large" type="primary" class="px-4 bg-[var(--n-color)]" @click="search">
          搜索
        </n-button>
      </n-input-group>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
import { NButton, NModal, NInputGroup, NInput } from 'naive-ui'
import { ref } from 'vue'

const show = defineModel<boolean>('showSearch')
const searchContent = ref<string>('')

function search() {
  const url = '/search?q=' + searchContent.value
  searchContent.value = ''
  window.location.href = encodeURI(url)
}
</script>
