<template>
  <n-back-top :right="100" />
  <div class="min-h-screen bg-gray-100">
    <!-- 导航栏 -->
    <NavBar
      :uid="userProfile.uid"
      :avatar-url="userProfile.avatar_url"
      :username="userProfile.username"
      :nickname="userProfile.nickname"
    />

    <div
      class="w-full flex flex-col flex-1 mx-auto pb-10 max-w-7xl px-8 mt-10 rounded-2xl drop-shadow-lg"
    >
      <div class="profile-bg" />

      <div class="w-full bg-white relative rounded-b-2xl">
        <div
          class="relative -top-12 left-12"
          @mouseover="avatarUploadTooltip?.classList.remove('hidden')"
          @mouseleave="avatarUploadTooltip?.classList.add('hidden')"
          @click="
            () => {
              showModal = true
            }
          "
        >
          <n-avatar
            class="absolute top-0 left-0 ring-4 ring-white"
            :size="160"
            :src="pageUserProfile.avatar_url"
          />
        </div>

        <div class="absolute left-56 top-4">
          <div class="flex flex-row items-end">
            <n-p class="text-4xl mb-0 mr-2">{{ pageUserProfile.nickname }}</n-p>
            <n-p class="text-lg mb-0">{{ `@${pageUserProfile.username}` }}</n-p>
          </div>
          <div>
            <n-tag :bordered="false" type="warning" class="mt-1 mr-2">{{
              `Lv. ${pageUserProfile.level}`
            }}</n-tag>
            <n-tag :bordered="false">{{ `UID: ${pageUserProfile.uid}` }}</n-tag>
          </div>
        </div>

        <div class="absolute right-6 top-4">
          <n-button
            ghost
            class="flex drop-shadow-lg"
            v-if="userProfile.uid == pageUserProfile.uid"
            @click="handleClickUpdateUserProfile"
          >
            编辑个人资料
          </n-button>
          <div class="flex flex-row justify-end space-x-4" v-else>
            <n-button ghost class="flex drop-shadow-lg w-20"> 私信 </n-button>
            <n-button class="flex drop-shadow-lg w-20 bg-[var(--primaryColor)]" type="primary">
              关注
            </n-button>
          </div>
        </div>

        <div class="absolute right-6 bottom-4 grid grid-cols-3 divide-x-2 select-none">
          <n-statistic :tabular-nums="true" label="关注数" class="pl-4"> 54 </n-statistic>
          <n-statistic :tabular-nums="true" label="粉丝数" class="pl-4"> 312 </n-statistic>
          <n-statistic :tabular-nums="true" label="获赞数" class="pl-4"> 11,481 </n-statistic>
        </div>

        <div class="mt-28 mx-12">
          <n-tabs
            size="large"
            type="line"
            justify-content="space-between"
            class="w-96"
            v-model:value="tabValue"
            :on-update:value="
              (value: string) => {
                tabValue = value
                updatePostList()
              }
            "
          >
            <n-tab name="博文" key="blog">博文</n-tab>
            <n-tab name="评论" key="comment">评论</n-tab>
            <n-tab name="点赞" key="like">点赞</n-tab>
            <n-tab name="收藏" key="favourite">收藏</n-tab>
          </n-tabs>
        </div>
      </div>

      <div class="mt-4 w-full rounded-2xl flex items-start space-x-4">
        <div class="w-2/3 space-y-3">
          <div v-for="post in postList.ids" :key="post" class="bg-white rounded-2xl">
            <PostCard :user-avatar-url="userProfile.avatar_url" :post-id="post" />
          </div>
        </div>

        <div class="w-1/3 bg-white rounded-2xl p-2">
          <div class="mt-2 mb-3 ml-1">
            <n-h6 prefix="bar" class="mb-0">个人资料</n-h6>
          </div>
          <n-descriptions label-placement="left" :column="1" size="small" bordered>
            <n-descriptions-item label="UID"> {{ pageUserProfile.uid }} </n-descriptions-item>
            <n-descriptions-item label="用户名">
              {{ pageUserProfile.username }}
            </n-descriptions-item>
            <n-descriptions-item label="等级"> Lv {{ pageUserProfile.level }} </n-descriptions-item>
            <n-descriptions-item label="生日">
              {{
                pageUserProfile.birth ? moment(pageUserProfile.birth).format('M 月 D 日') : '未公开'
              }}
            </n-descriptions-item>
            <n-descriptions-item label="性别">
              {{
                pageUserProfile.gender
                  ? pageUserProfile.gender === 'male'
                    ? '男'
                    : '女'
                  : '未公开'
              }}
            </n-descriptions-item>
          </n-descriptions>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'
import { DefaultUserProfile, GetUserProfile, type UserProfile } from '../scripts/user'
import PostCard from '../components/PostCard.vue'
import { onMounted } from 'vue'
import {
  NAvatar,
  NP,
  NH6,
  NTag,
  NBackTop,
  NTabs,
  NTab,
  NStatistic,
  NButton,
  NDescriptions,
  NDescriptionsItem
} from 'naive-ui'
import { useRoute } from 'vue-router'
import router from '../router'
import moment from 'moment'
import { DefaultPostList, GetPostList, type PostList } from '../scripts/post'

const route = useRoute()
const avatarUploadTooltip = ref<HTMLDivElement>()
const showModal = ref(false)
const tabValue = ref('博文')

const pageUserProfile = ref<UserProfile>(DefaultUserProfile)
const userProfile = ref<UserProfile>(DefaultUserProfile)
const postList = ref<PostList>(DefaultPostList)

function handleClickUpdateUserProfile() {
  router.push('/settings/profile')
}

async function updatePostList() {
  switch (tabValue.value) {
    case '博文':
      postList.value = await GetPostList({ type: 'user', uid: pageUserProfile.value.uid })
      break
    case '点赞':
      postList.value = await GetPostList({ type: 'liked', uid: pageUserProfile.value.uid })
      break
    case '收藏':
      postList.value = await GetPostList({ type: 'favourited', uid: pageUserProfile.value.uid })
      break
    default:
      postList.value = DefaultPostList
      break
  }
}

onMounted(async () => {
  pageUserProfile.value = await GetUserProfile(route.params.userID)
  userProfile.value = await GetUserProfile()
  await updatePostList()
})
</script>

<style scoped>
.profile-bg {
  @apply w-full h-80 rounded-t-2xl bg-top bg-cover bg-no-repeat brightness-75;
  background-image: url('/src/assets/background.jpg');
}
</style>

