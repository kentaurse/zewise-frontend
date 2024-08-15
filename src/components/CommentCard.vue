<template>
  <div class="flex flex-row space-x-2 pt-4">
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
        v-else
      >
        {{ posterProfile.nickname }}
      </p>
      <n-skeleton text style="width: 128px; height: 15px; padding-top: 1px" v-if="loading" />
      <p class="text-xs text-gray-500" v-else>{{ FormatTime(commentDetail.post_timestamp) }}</p>
    </div>
  </div>

  <div class="flex flex-row ml-[3.125rem] mt-2">
    <n-skeleton text style="height: 22px" v-if="loading" />
    <n-ellipsis
      class="text-base whitespace-pre-wrap"
      :line-clamp="2"
      expand-trigger="click"
      :tooltip="false"
      v-else
      >{{ commentDetail.content }}</n-ellipsis
    >
  </div>

  <div class="flex flex-row ml-[3.125rem] w-full mt-2 items-center h-6">
    <div class="toolbar-item" @click="handleClickLike">
      <n-icon size="18">
        <like-outlined v-if="!commentUserStatus.is_liked" />
        <like-filled color="var(--primaryColor)" v-else />
      </n-icon>
      <n-p class="ml-1">{{ commentDetail.likes }}</n-p>
      <p
        class="ml-1"
        :class="commentUserStatus.is_disliked ? 'text-[var(--primaryColor)]' : ''"
      ></p>
    </div>
    <div class="toolbar-item ml-6" @click="handleClickDislike">
      <n-icon size="18">
        <dislike-outlined v-if="!commentUserStatus.is_disliked" />
        <dislike-filled color="var(--primaryColor)" v-else />
      </n-icon>
    </div>
    <p
      class="ml-8 cursor-pointer hover:text-[var(--primaryColor)] transition-all"
      @click="handleSwicthReplyBox"
    >
      回复
    </p>
  </div>

  <div class="ml-8" v-show="displayReplyBox">
    <div class="flex flex-row mt-4 ml-4 space-x-2 items-start">
      <img class="rounded-full size-[2.625rem] min-size-[2.625rem]" v-lazy="props.avtarUrl" />
      <div class="flex flex-row w-full items-stretch space-x-2">
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
  <div class="mt-2 pl-12 border-l-2">
    <div v-for="replyID in replyList.ids" :key="replyID">
      <reply-card
        :comment-id="props.commentId"
        :reply-id="replyID"
        :avtar-url="props.avtarUrl"
        @update-reply-list="updateReplyList"
      />
    </div>
  </div>

  <div class="mt-4" />
</template>
<script setup lang="ts">
import { NEllipsis, NIcon, NInput, NButton, NP, NSkeleton, useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { throttle } from 'lodash'
import { LikeOutlined, LikeFilled, DislikeOutlined, DislikeFilled } from '@vicons/antd'
import { DefaultUserProfile, GetUserProfile, type UserProfile } from '../scripts/user'
import {
  DefaultCommentData,
  type CommentData,
  GetCommentDetail,
  type CommentUserStatus,
  DefaultCommentUserStatus,
  GetCommentUserStatus,
  CancelLikeComment,
  LikeComment,
  CancelDislikeComment,
  DislikeComment
} from '../scripts/comment'
import { FormatTime } from '../scripts/utils/time'
import ReplyCard from './ReplyCard.vue'
import { DefaultReplyList, GetReplyList, NewReply, type ReplyList } from '../scripts/reply'

const message = useMessage()
const props = defineProps<{
  commentId: number
  avtarUrl: string
}>()
const replyContent = ref('')
const posterProfile = ref<UserProfile>(DefaultUserProfile)
const displayReplyBox = ref(false)
const commentUserStatus = ref<CommentUserStatus>(DefaultCommentUserStatus)
const commentDetail = ref<CommentData>(DefaultCommentData)
const replyList = ref<ReplyList>(DefaultReplyList)
const loading = ref(true)

async function updateReplyList() {
  replyList.value = await GetReplyList(props.commentId)
}

function handleNicknameClick() {
  window.location.href = `/user/${posterProfile.value.uid}`
}

const handleClickLike = throttle(async () => {
  if (commentUserStatus.value.is_liked) {
    commentUserStatus.value.is_liked = false
    commentDetail.value.likes--
    try {
      await CancelLikeComment(props.commentId)
      message.info('取消点赞成功')
    } catch (error) {
      message.error(`取消点赞失败: ${(error as Error).message}`)
    }
    commentUserStatus.value = await GetCommentUserStatus(props.commentId)
    commentDetail.value = await GetCommentDetail(props.commentId)
    return
  }

  commentDetail.value.likes++
  commentUserStatus.value.is_liked = true
  commentUserStatus.value.is_disliked = false
  try {
    await LikeComment(props.commentId)
    message.success('点赞成功')
  } catch (error) {
    message.error(`点赞失败: ${(error as Error).message}`)
  }
  commentUserStatus.value = await GetCommentUserStatus(props.commentId)
  commentDetail.value = await GetCommentDetail(props.commentId)
}, 500)

const handleClickDislike = throttle(async () => {
  if (commentUserStatus.value.is_disliked) {
    commentUserStatus.value.is_disliked = false
    try {
      await CancelDislikeComment(props.commentId)
      message.info('取消踩成功')
    } catch (error) {
      message.error(`取消踩失败: ${(error as Error).message}`)
    }
    commentUserStatus.value = await GetCommentUserStatus(props.commentId)
    return
  }

  commentUserStatus.value.is_disliked = true
  commentUserStatus.value.is_liked = false
  try {
    await DislikeComment(props.commentId)
    message.success('踩成功')
  } catch (error) {
    message.error(`踩失败: ${(error as Error).message}`)
  }
  commentUserStatus.value = await GetCommentUserStatus(props.commentId)
}, 500)

function handleSwicthReplyBox() {
  displayReplyBox.value = !displayReplyBox.value
}

const handleNewReply = throttle(async () => {
  if (replyContent.value === '') {
    message.warning('回复内容不能为空')
    return
  }

  try {
    await NewReply(props.commentId, replyContent.value)
    message.success('回复成功')
    replyContent.value = ''
    displayReplyBox.value = false
  } catch (error) {
    message.error(`回复失败: ${(error as Error).message}`)
  }

  await updateReplyList()
}, 500)

onMounted(async () => {
  commentDetail.value = await GetCommentDetail(props.commentId)
  posterProfile.value = await GetUserProfile(commentDetail.value.poster_uid)
  commentUserStatus.value = await GetCommentUserStatus(props.commentId)
  replyList.value = await GetReplyList(props.commentId)
  loading.value = false
})
</script>
<style scoped>
.toolbar-item {
  @apply flex flex-row items-center select-none cursor-pointer hover:text-[var(--primaryColor)] transition-all;
}
</style>
