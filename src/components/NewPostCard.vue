<template>
  <n-modal v-model:show="showModal" :on-mask-click="closeModal">
    <n-card style="width: 580px">
      <div class="space-y-4">
        <n-p class="text-2xl mb-0">发表博文</n-p>
        <n-input
          v-model:value="formData.title"
          type="text"
          size="large"
          placeholder="在此输入标题"
          maxlength="50"
          show-count
        />
        <n-input
          v-model:value="formData.content"
          type="textarea"
          placeholder="分享生活中的趣事"
          size="large"
          maxlength="2000"
          show-count
          :autosize="{
            minRows: 4,
            maxRows: 12
          }"
        />
        <div>
          <n-upload
            v-model:file-list="fileList"
            list-type="image"
            :max="9"
            :multiple="true"
            :accept="'.webp,.png,.jpg,.jpeg'"
          >
            <n-button> 上传图片 </n-button>
          </n-upload>
        </div>
        <n-progress
          v-if="displayProgress"
          type="line"
          :percentage="progressPercentage"
          :indicator-placement="'inside'"
          status="success"
          processing
        />
        <div class="flex flex-row justify-between space-x-2">
          <n-button class="px-4" @click="showAIPrompt = true"> 🔥让AI帮我写微博🔥 </n-button>
          <div class="flex flex-row space-x-2 justify-end">
            <n-button secondary class="px-4" @click="closeModal">取消</n-button>
            <n-button type="primary" class="px-4 bg-[var(--n-color)]" @click="submitForm"
              >提交</n-button
            >
          </div>
        </div>
      </div>
    </n-card>
  </n-modal>
  <n-modal
    :mask-closable="!aiGenerating"
    :closable="!aiGenerating"
    :close-on-esc="!aiGenerating"
    v-model:show="showAIPrompt"
    class="custom-card"
    preset="card"
    :style="{ width: '580px' }"
    title="AI 微博生成器"
    size="large"
    :bordered="false"
  >
    <n-input
      v-model:value="aiPrompt"
      type="textarea"
      placeholder="给 AI 一些提示吧~"
      size="large"
      maxlength="200"
      show-count
      :autosize="{
        minRows: 4,
        maxRows: 6
      }"
      :loading="aiGenerating"
    />
    <template #footer>
      <div class="w-full flex flex-row justify-end">
        <n-button
          :disabled="aiGenerating"
          type="primary"
          class="px-4 bg-[var(--n-color)]"
          @click="generatePost"
        >
          生成
        </n-button>
      </div>
    </template>
  </n-modal>
</template>
<script setup lang="ts">
import { AuthInfo } from '../stores/auth'
import {
  NCard,
  NP,
  NInput,
  NUpload,
  NButton,
  NProgress,
  NModal,
  useMessage,
  type UploadFileInfo
} from 'naive-ui'
import type { FileInfo } from 'naive-ui/es/upload/src/interface'
import { ref } from 'vue'

const message = useMessage()
const authInfo = new AuthInfo()
const showModal = defineModel<boolean>('showModal')
const showAIPrompt = ref(false)
const fileList = ref<UploadFileInfo[]>([])
const formData = ref({
  title: '',
  content: '',
  images: [] as string[]
})
const displayProgress = ref(false)
const progressPercentage = ref(0)
const aiGenerating = ref(false)
const aiPrompt = ref('')

function closeModal() {
  showModal.value = false

  displayProgress.value = false
  progressPercentage.value = 0

  fileList.value = []
  formData.value.title = ''
  formData.value.content = ''
  formData.value.images = []
}

async function uploadImage(file: FileInfo) {
  const data = new FormData()
  const blob = file.file?.slice(0, file.file.size, file.type as string)
  const imageBlob = new File([blob!], file.name, { type: file.type as string })
  data.append('file', imageBlob)
  const resp = await fetch('/api/post/upload-img', {
    method: 'POST',
    body: data,
    headers: {
      Authorization: `Bearer ${authInfo.auth.token}`
    }
  })
  const result = await resp.json()
  if (result.code === 0) {
    formData.value.images.push(result.data.uuid)
    progressPercentage.value += 100 / fileList.value.length
  } else {
    throw new Error(result.message)
  }
}

async function submitForm() {
  displayProgress.value = true
  const uploadPromiseList = fileList.value.map((file) => uploadImage(file))
  try {
    await Promise.all(uploadPromiseList)
  } catch (e) {
    message.error(`图片上传失败: ${(e as Error).message}`)
    displayProgress.value = false
    progressPercentage.value = 0
    return
  }
  displayProgress.value = false
  progressPercentage.value = 0

  const resp = await fetch('/api/post/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authInfo.auth.token}`
    },
    body: JSON.stringify(formData.value)
  })
  const result = await resp.json()

  if (result.code === 0) {
    message.success('发布成功')
    location.reload()
  } else {
    message.error(`发布失败: ${result.message}`)
    formData.value.images = []
  }
}

async function generatePost() {
  aiGenerating.value = true
  try {
    const resp = await fetch('/api/aigc/draft/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: aiPrompt.value
      })
    })
    const result = await resp.json()
    if (result.code === 0) {
      formData.value.title = result.data.title
      formData.value.content = result.data.content
    } else {
      throw new Error(result.message)
    }
  } catch (e) {
    message.error(`AI 生成失败: ${(e as Error).message}`)
  }
  aiGenerating.value = false
  aiPrompt.value = ''
  showAIPrompt.value = false
}
</script>
