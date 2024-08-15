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
      class="w-full flex flex-col flex-1 mx-auto pb-10 max-w-7xl px-8 mt-4 rounded-2xl drop-shadow-lg"
    >
      <div class="mt-4 w-full rounded-2xl flex justify-center space-x-4">
        <div class="w-2/3 space-y-3">
          <p class="text-base truncate">
            搜索 {{ searchContent }} 的结果 ( 共 {{ postList.ids.length }} 条结果 )
          </p>
          <div v-for="post in postList.ids" :key="post" class="bg-white rounded-2xl">
            <PostCard :user-avatar-url="userProfile.avatar_url" :post-id="post" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NBackTop } from 'naive-ui'
import NavBar from '../components/NavBar.vue'
import PostCard from '../components/PostCard.vue'
import { DefaultSearchPostList, GetSearchPostList, type SearchPostList } from '../scripts/search'
import { DefaultUserProfile, GetUserProfile, type UserProfile } from '../scripts/user'
import { useRoute } from 'vue-router'

const route = useRoute()
const query = route.query
const searchContent = decodeURIComponent(query.q as string)

const userProfile = ref<UserProfile>(DefaultUserProfile)
const postList = ref<SearchPostList>(DefaultSearchPostList)

onMounted(async () => {
  const [userProfileData, postListData] = await Promise.all([
    GetUserProfile(),
    GetSearchPostList(searchContent)
  ])
  userProfile.value = userProfileData
  postList.value = postListData
})
</script>
