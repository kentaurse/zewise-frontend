<template>
  <n-back-top :right="100" />
  <div class="min-h-screen bg-gray-100">
    <!-- 导航栏 -->
    <div class="fixed w-screen top-0 z-10">
      <NavBar
        :uid="userProfile.uid"
        :avatar-url="userProfile.avatar_url"
        :username="userProfile.username"
        :nickname="userProfile.nickname"
      />
    </div>

    <div class="w-full h-[34px]" />

    <div class="w-full flex pl-9 pr-6 pb-10 max-w-7xl mx-auto mt-4 rounded-2xl drop-shadow-lg">
      <div class="mt-4 w-full rounded-2xl flex items-start space-x-4">
        <div class="w-2/3 space-y-3">
          <div v-for="post in postList.ids" :key="post" class="bg-white rounded-2xl">
            <PostCard :user-avatar-url="userProfile.avatar_url" :post-id="post" />
          </div>
        </div>

        <div class="w-1/3 bg-white rounded-2xl p-2">
          <div class="mt-2 mb-3 ml-1">
            <n-h6 prefix="bar" class="mb-0 text-lg">热门话题</n-h6>
          </div>
          <div class="ml-0 space-y-1">
            <div
              v-for="tag in tags"
              v-bind:key="tag.tag_id"
              class="p-2 cursor-pointer rounded-xl transition-all hover:bg-gray-100"
            >
              <tag-preview
                :tag_id="tag.tag_id"
                :tag_name="tag.tag_name"
                :view_count="tag.view_count"
                :discussion_count="tag.discussion_count"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NH6, NBackTop, useMessage } from 'naive-ui'
import NavBar from '../components/NavBar.vue'
import PostCard from '../components/PostCard.vue'
import TagPreview from '../components/TagPreview.vue'
import { DefaultPostList, GetPostList, type PostList } from '../scripts/post'
import { DefaultUserProfile, GetUserProfile, type UserProfile } from '../scripts/user'

const message = useMessage()

const userProfile = ref<UserProfile>(DefaultUserProfile)
const postList = ref<PostList>(DefaultPostList)
const loading = ref(false)

async function appendList() {
  try {
    const newPostList = await GetPostList({
      from: postList.value.ids[postList.value.ids.length - 1]
    })
    postList.value.ids.push(...newPostList.ids)
  } catch (error) {
    message.error('加载失败')
  }
  loading.value = false
}

function handleScroll() {
  const bottom = document.documentElement.scrollHeight - (window.innerHeight + window.scrollY)
  if (bottom <= 1 && !loading.value) {
    loading.value = true
    appendList()
  }
}

onMounted(async () => {
  const [userProfileData, postListData] = await Promise.all([GetUserProfile(), GetPostList()])
  userProfile.value = userProfileData
  postList.value = postListData
  window.addEventListener('scroll', handleScroll)
})

const tags = [
  {
    tag_id: 1,
    tag_name: '国足今晚再战新加坡',
    view_count: 100,
    discussion_count: 20
  },
  {
    tag_id: 2,
    tag_name: '官方通报山东一对初中生结婚',
    view_count: 150,
    discussion_count: 30
  },
  {
    tag_id: 3,
    tag_name: '中国足协原主席陈戌源一审被判无期',
    view_count: 80,
    discussion_count: 15
  },
  {
    tag_id: 4,
    tag_name: '陈铭主持电影对谈引争议',
    view_count: 120,
    discussion_count: 25
  },
  {
    tag_id: 5,
    tag_name: '暴雪暴雨冰雹来了',
    view_count: 200,
    discussion_count: 40
  },
  {
    tag_id: 6,
    tag_name: '内蒙古根河现极光美景',
    view_count: 90,
    discussion_count: 18
  },
  {
    tag_id: 7,
    tag_name: '外媒称《亢奋》第三季被取消',
    view_count: 110,
    discussion_count: 22
  },
  {
    tag_id: 8,
    tag_name: 'AI要取代音乐创作者了吗',
    view_count: 130,
    discussion_count: 28
  }
]
</script>
