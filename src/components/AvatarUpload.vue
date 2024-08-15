<template>
  <n-modal v-model:show="showModal" :on-mask-click="closeModal">
    <n-card style="width: 30rem">
      <p class="text-xl mb-4">上传头像</p>
      <div class="w-full h-[27rem]">
        <div v-if="!avatarFile">
          <n-upload
            multiple
            directory-dnd
            action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            :max="1"
            class="w-full h-full"
            :custom-request="loadAvatarFile"
            :accept="'.webp,.png,.jpg,.jpeg'"
            :show-file-list="false"
            v-model:file-list="uploadList"
            :on-before-upload="
              () => {
                uploadList = []
              }
            "
          >
            <n-upload-dragger class="w-full h-[27rem] flex flex-col justify-center">
              <ArrowUpOnSquareIcon class="w-16 mb-8 mx-auto stroke-slate-700" />
              <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
            </n-upload-dragger>
          </n-upload>
        </div>
        <VueCropper
          v-if="avatarFile"
          ref="cropper"
          class="w-full h-full"
          :img="avatarFile"
          :outputSize="1"
          :outputType="'webp'"
          :info="true"
          :autoCrop="true"
          :fixedBox="false"
          :canMoveBox="true"
          :centerBox="true"
          :fixed="true"
          :fixedNumber="[1, 1]"
        ></VueCropper>
      </div>
      <div class="mt-5 flex flex-row justify-between">
        <div>
          <n-upload
            :custom-request="loadAvatarFile"
            v-if="avatarFile"
            :show-file-list="false"
            v-model:file-list="uploadList"
            :on-before-upload="
              () => {
                uploadList = []
              }
            "
          >
            <n-button secondary class="px-4">重新上传</n-button>
          </n-upload>
        </div>
        <div class="flex flex-row justify-end">
          <n-button secondary class="px-4 mr-1" @click="closeModal"> 取消 </n-button>
          <n-button
            type="primary"
            class="px-4 ml-1 bg-[var(--n-color)]"
            strong
            @click="uploadAvatar"
          >
            确定
          </n-button>
        </div>
      </div>
    </n-card>
  </n-modal>
</template>
<script setup lang="ts">
import {
  NCard,
  NUpload,
  NUploadDragger,
  NText,
  NButton,
  NModal,
  type UploadCustomRequestOptions,
  useMessage,
  type UploadFileInfo
} from 'naive-ui'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { ref } from 'vue'
import { ArrowUpOnSquareIcon } from '@heroicons/vue/24/outline'
import { AuthInfo } from '../stores/auth'

const showModal = defineModel<boolean>('showModal')
const avatarFile = ref<string>('')
const uploadList = ref<Array<UploadFileInfo>>([])
const cropper = ref<VueCropper>(null)

// 引入消息提示
const message = useMessage()

function closeModal() {
  showModal.value = false
  uploadList.value = []
  avatarFile.value = ''
}

function loadAvatarFile({ file }: UploadCustomRequestOptions) {
  const fileReader = new FileReader()
  fileReader.onload = (e) => {
    avatarFile.value = e.target?.result as string
  }
  fileReader.readAsDataURL(file.file as File)
}

function uploadAvatar() {
  cropper.value.getCropBlob(async (data: Blob) => {
    const formData = new FormData()
    formData.append('avatar', data)

    const authInfo = new AuthInfo()

    // upload formData to server
    const resp = await fetch('/api/user/upload-avatar', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authInfo.auth.token}`
      },
      body: formData
    })
    const respData = await resp.json()

    if (respData.code === 0) {
      message.info('头像上传成功')

      closeModal()
      setTimeout(() => {
        location.reload()
      }, 800)
      return
    }

    message.error(`头像上传失败：${respData.message}`)
  })
}
</script>
