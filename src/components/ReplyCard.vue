<template>
  <div class="flex flex-row space-x-2 pt-1">
    <n-skeleton height="42px" circle v-if="loading" />
    <img
      class="rounded-full size-[2.625rem] min-size-[2.625rem]"
      v-lazy="posterProfile.avatar_url"
      v-else
    />
    <div class="flex flex-col mt-[0.125rem]">
      <n-skeleton text style="width: 144px; height: 22px; margin-bottom: 2px" v-if="loading" />
      <p
        class="text-base text-gray-800 select-none cursor-pointer hover:text-[var(--primaryColor)] transition-all"
        @click="handleNicknameClick"
      >
        {{ posterProfile.nickname }}
      </p>
      <n-skeleton text style="width: 128px; height: 15px; padding-top: 1px" v-if="loading" />
      <p class="text-xs text-gray-500">{{ FormatTime(replyDetail.create_time) }}</p>
    </div>
  </div>

  <div class="flex flex-row ml-[3.125rem] mt-1">
    <n-skeleton text style="height: 22px" v-if="loading" />
    <n-ellipsis class="text-base whitespace-pre-wrap" :line-clamp="3" expand-trigger="click" :tooltip="false" v-else>
      <a
        class="text-sky-700 hover:text-sky-800 visited:text-sky-800 transition-all"
        :href="`/user/${replyDetail.parent_reply_uid}`"
        v-if="replyDetail.parent_reply_uid"
      >
        回复 @{{ parentReplyUserProfile.nickname }}:
      </a>
      {{ replyDetail.content }}
    </n-ellipsis>
  </div>

  <div class="flex flex-row ml-[3.125rem] w-full mt-1 items-center h-6">
    <p
      class="cursor-pointer hover:text-[var(--primaryColor)] transition-all"
      @click="handleSwicthReplyBox"
    >
      回复
    </p>
  </div>

  <div class="mt-3 mb-3" v-show="displayReplyBox">
    <div class="flex flex-row space-x-2 items-start">
      <img class="rounded-full size-[2.625rem] min-size-[2.625rem]" v-lazy="props.avtarUrl" />
      <div class="flex flex-row w-full items-stretch space-x-2">
        <n-tag class="h-[2.625rem] rounded-lg" :bordered="false"
          >回复 @ {{ posterProfile.nickname }}
        </n-tag>
        <n-input
          v-model:value="replyContent"
          placeholder="发表一条友善的回复"
          size="large"
          :maxlength="200"
          show-count
          type="textarea"
          :autosize="{
            minRows: 1,
            maxRows: 3
          }"
          class="grow"
        />
        <div class="min-h-[2.625rem] w-16">
          <n-button
            class="h-full w-full bg-[var(--primaryColor)]"
            type="primary"
            @click="handleNewReply"
          >
            发表
          </n-button>
        </div>
      </div>
    </div>
  </div>
  <div class="pb-1" />
</template>
<script setup lang="ts">
import { NEllipsis, NButton, NInput, NTag, NSkeleton, useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { throttle } from 'lodash'
import { DefaultUserProfile, GetUserProfile, type UserProfile } from '../scripts/user'
import { FormatTime } from '../scripts/utils/time'
import { DefaultReplyDetail, GetReplyDetail, NewReply, type ReplyDetail } from '../scripts/reply'

const message = useMessage()
const props = defineProps<{
  commentId: number
  replyId: number
  avtarUrl: string
}>()
const emits = defineEmits(['updateReplyList'])
const replyContent = ref('')
const posterProfile = ref<UserProfile>(DefaultUserProfile)
const displayReplyBox = ref(false)
const replyDetail = ref<ReplyDetail>(DefaultReplyDetail)
const parentReplyUserProfile = ref<UserProfile>(DefaultUserProfile)
const loading = ref(false)

const updateReplyList = () => {
  emits('updateReplyList')
}

function handleNicknameClick() {
  window.location.href = `/user/${posterProfile.value.uid}`
}

function handleSwicthReplyBox() {
  displayReplyBox.value = !displayReplyBox.value
}

const handleNewReply = throttle(async () => {
  if (replyContent.value.length === 0) {
    message.warning('回复内容不能为空')
    return
  }

  try {
    await NewReply(props.commentId, replyContent.value, props.replyId)
    message.success('回复成功')
    replyContent.value = ''
    displayReplyBox.value = false
  } catch (error) {
    message.error(`回复失败: ${(error as Error).message}`)
  }

  updateReplyList()
}, 500)

onMounted(async () => {
  replyDetail.value = await GetReplyDetail(props.replyId)
  posterProfile.value = await GetUserProfile(replyDetail.value.uid)
  parentReplyUserProfile.value = await GetUserProfile(replyDetail.value.parent_reply_uid)
  if (replyDetail.value.parent_reply_uid) {
    parentReplyUserProfile.value = await GetUserProfile(replyDetail.value.parent_reply_uid)
  }
  loading.value = false
})
</script>
<style scoped>
.toolbar-item {
  @apply flex flex-row items-center select-none cursor-pointer hover:text-[var(--primaryColor)] transition-all;
}
</style>
