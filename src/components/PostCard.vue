<template>
  <div class="p-8 pb-4">
    <div class="flex flex-row align-middle">
      <n-skeleton height="48px" circle v-if="loading" />
      <img
        v-lazy="posterInfo.avatar_url"
        class="w-12 h-12 cursor-pointer rounded-full min-size-12 hover:scale-110 transition-all"
        @click="handleNicknameClick"
        v-else
      />
      <div class="flex flex-col ml-4">
        <n-skeleton text style="width: 256px; height: 24px; margin-bottom: 4px" v-if="loading" />
        <n-p
          class="mb-0 text-lg hover:text-[var(--primaryColor)] cursor-pointer transition-all"
          @click="handleNicknameClick"
          v-else
          >{{ posterInfo.nickname }}</n-p
        >
        <n-skeleton text style="width: 144px; height: 16px; padding-top: 2px" v-if="loading" />
        <n-p class="mb-0 mt-0 text-sm text-gray-500" v-else>{{
          FormatTime(postInfo.timestamp)
        }}</n-p>
      </div>
    </div>
    <div class="flex flex-col ml-16 mr-8">
      <div class="flex flex-col mt-1 text-base font-normal">
        <n-skeleton text style="width: 60%; height: 28px" v-if="loading" />
        <n-ellipsis line-clamp="1" :expand-trigger="undefined" class="text-xl" v-else>{{
          postInfo.title
        }}</n-ellipsis>
        <n-skeleton text :repeat="3" style="margin-top: 2px; height: 22px" v-if="loading" />
        <n-ellipsis class="whitespace-pre-wrap" expand-trigger="click" line-clamp="4" :tooltip="false" v-else>{{
          postInfo.content
        }}</n-ellipsis>
      </div>
      <div class="mt-2" v-if="postInfo.images">
        <img
          v-if="postInfo.images.length === 1"
          v-lazy="postInfo.images[0]"
          class="min-w-32 min-h-32 max-w-full max-h-96 rounded-lg cursor-pointer object-cover hover:brightness-75 transition-all"
          @click="preview(postInfo.images[0])"
        />
        <div
          class="grid gap-2"
          :class="postInfo.images.length === 4 ? 'grid-cols-2 w-[17rem]' : 'grid-cols-3 w-[25rem]'"
          v-else
        >
          <img
            v-for="(image, index) in postInfo.images"
            :key="image"
            v-lazy="image"
            class="rounded-lg mt-1 w-32 h-32 cursor-pointer object-cover hover:brightness-75 transition-all"
            @click="preview(index, postInfo.images)"
          />
        </div>
      </div>

      <div class="flex flex-row w-full justify-between mt-4">
        <div class="toolbar-item" @click="handleLike">
          <n-icon size="18">
            <like-outlined v-if="!postUserStatus.like" />
            <like-filled color="var(--primaryColor)" v-else />
          </n-icon>
          <p class="ml-1" :class="postUserStatus.like ? 'text-[var(--primaryColor)]' : ''">
            {{ postInfo.like }}
          </p>
        </div>
        <div class="toolbar-item" @click="handleFavourite">
          <n-icon size="18">
            <star-outlined v-if="!postUserStatus.favourite" />
            <star-filled color="var(--primaryColor)" v-else />
          </n-icon>
          <p class="ml-1" :class="postUserStatus.favourite ? 'text-[var(--primaryColor)]' : ''">
            {{ postInfo.favourite }}
          </p>
        </div>
        <div class="toolbar-item" @click="handleExpandComments">
          <n-icon size="18">
            <chat-bubble-left-outline v-if="!displayComments" />
            <chat-bubble-left-solid class="fill-[var(--primaryColor)]" v-else />
          </n-icon>
          <p class="ml-1" :class="displayComments ? 'text-[var(--primaryColor)]' : ''">
            {{ commentIDs.length }}
          </p>
        </div>
        <div class="toolbar-item">
          <n-icon size="18">
            <arrow-uturn-right-icon />
          </n-icon>
          <p class="ml-1">转发</p>
        </div>
      </div>
    </div>

    <div class="mt-6" v-if="renderComments" v-show="displayComments">
      <div class="flex flex-row flex-1 space-x-1">
        <p class="text-2xl">评论</p>
        <p class="text-base text-gray-500">{{ commentIDs.length }}</p>
      </div>
      <div class="flex flex-row mt-4 ml-4 space-x-2 items-start">
        <n-avatar round :size="42" :src="props.userAvatarUrl" class="min-w-[2.625rem]" />
        <div class="flex flex-row w-full items-stretch space-x-2">
          <n-input
            v-model:value="commentBoxContent"
            placeholder="发表一条查重率为 0% 的评论"
            size="large"
            :maxlength="500"
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
              @click="handleNewComment"
            >
              发表
            </n-button>
          </div>
        </div>
      </div>

      <div class="mt-2 ml-4 divide-y-2">
        <div v-for="commentID in commentIDs" :key="commentID">
          <comment-card :comment-id="commentID" :avtar-url="props.userAvatarUrl" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { throttle } from 'lodash'
import { NAvatar, NP, NEllipsis, NIcon, NInput, NButton, NSkeleton, useMessage } from 'naive-ui'
import { preview, setPreviewDefaultOptions } from 'v-preview-image'
import { LikeOutlined, LikeFilled, StarOutlined, StarFilled } from '@vicons/antd'
import {
  ArrowUturnRightIcon,
  ChatBubbleLeftIcon as ChatBubbleLeftOutline
} from '@heroicons/vue/24/outline'
import { ChatBubbleLeftIcon as ChatBubbleLeftSolid } from '@heroicons/vue/24/solid'
import CommentCard from './CommentCard.vue'
import { GetCommentList, NewComment } from '../scripts/comment'
import { FormatTime } from '../scripts/utils/time'
import {
  CancelFavouritePost,
  CancelLikePost,
  DefaultPostDetail,
  DefaultPostUserStatus,
  FavouritePost,
  GetPostDetail,
  GetPostUserStatus,
  LikePost,
  type PostDetail,
  type PostUserStatus
} from '../scripts/post'
import { DefaultUserProfile, GetUserProfile, type UserProfile } from '../scripts/user'

setPreviewDefaultOptions({
  activeColor: 'rgba(0, 0, 0, 0.5)'
})
const message = useMessage()

const props = defineProps<{
  postId: number
  userAvatarUrl: string
}>()

const displayComments = ref(false)
const postInfo = ref<PostDetail>(DefaultPostDetail)
const posterInfo = ref<UserProfile>(DefaultUserProfile)
const postUserStatus = ref<PostUserStatus>(DefaultPostUserStatus)
const commentIDs = ref<number[]>([])
const commentBoxContent = ref('')
const renderComments = ref(false)
const loading = ref(true)

async function handleExpandComments() {
  if (renderComments.value == false) {
    renderComments.value = true
  }
  displayComments.value = !displayComments.value
}

// 点赞
const handleLike = throttle(async () => {
  if (!postUserStatus.value.like) {
    postInfo.value.like++
    postUserStatus.value.like = true
    try {
      await LikePost(props.postId)
      message.success('点赞成功')
    } catch (error) {
      message.error(`点赞失败: ${(error as Error).message}`)
      postInfo.value.like--
      postUserStatus.value.like = false
    }
    return
  }

  postInfo.value.like--
  postUserStatus.value.like = false
  try {
    await CancelLikePost(props.postId)
    message.info('取消点赞成功')
  } catch (error) {
    message.error(`取消点赞失败: ${(error as Error).message}`)
    postInfo.value.like++
    postUserStatus.value.like = true
  }
}, 500)

// 收藏
const handleFavourite = throttle(async () => {
  if (!postUserStatus.value.favourite) {
    postUserStatus.value.favourite = true
    postInfo.value.favourite++
    try {
      await FavouritePost(props.postId)
      message.success('收藏成功')
    } catch (error) {
      message.error(`收藏失败: ${(error as Error).message}`)
      postUserStatus.value.favourite = false
      postInfo.value.favourite--
    }
    return
  }

  postUserStatus.value.favourite = false
  postInfo.value.favourite--
  try {
    await CancelFavouritePost(props.postId)
    message.info('取消收藏成功')
  } catch (error) {
    message.error(`取消收藏失败: ${(error as Error).message}`)
    postUserStatus.value.favourite = true
    postInfo.value.favourite++
  }
}, 500)

function handleNicknameClick() {
  window.location.href = `/user/${posterInfo.value.uid}`
}

async function handleNewComment() {
  if (commentBoxContent.value.length === 0) {
    message.error('评论内容不能为空')
    return
  }

  try {
    const id = await NewComment(props.postId, commentBoxContent.value)
    message.success('评论成功')

    // 在列表最前面添加
    commentIDs.value.splice(0, 0, id)
  } catch (error) {
    message.error(`评论失败: ${error}`)
  }

  commentBoxContent.value = ''
}

onMounted(async () => {
  postInfo.value = await GetPostDetail(props.postId)
  posterInfo.value = await GetUserProfile(postInfo.value.uid)
  postUserStatus.value = await GetPostUserStatus(props.postId)
  commentIDs.value = await GetCommentList(props.postId)
  loading.value = false
})
</script>
<style scoped>
.toolbar-item {
  @apply flex flex-row items-center select-none cursor-pointer hover:text-[var(--primaryColor)] transition-all;
}
</style>
