<template>
  <div class="bg-[var(--primaryColor)]">
    <nav class="mx-auto w-full flex flex-row max-w-7xl items-center px-8 justify-between">
      <div class="flex flex-col items-center">
        <a href="/" class="flex text-white text-2xl drop-shadow-lg select-none space-x-1">
          <p class="scale-125 iconfont icon-logo" />
          <p class="px-2">HiSea 海智</p>
        </a>
      </div>
      <PopoverGroup class="flex">
        <a href="/" class="nav_item">首页</a>
        <a href="/sub" class="nav_item">关注</a>
        <a href="/topic" class="nav_item">话题</a>
        <a href="/community" class="nav_item">圈子</a>
      </PopoverGroup>
      <div class="flex justify-end">
        <div class="flex h-[34px] items-center" @click="showSearch = true">
          <n-icon size="24">
            <MagnifyingGlassIcon
              class="stroke-2 stroke-gray-200 drop-shadow-md hover:scale-110 transition-all cursor-pointer"
            />
          </n-icon>
        </div>
        <div class="flex mx-4">
          <n-dropdown :options="options" :on-select="handleDropdownSelect">
            <n-avatar
              round
              size="medium"
              :src="props.avatarUrl"
              class="drop-shadow-lg hover:cursor-pointer hover:scale-110 transition-all"
            />
          </n-dropdown>
        </div>
        <n-button
          ghost
          color="rgb(240, 240, 240)"
          class="flex drop-shadow-lg"
          @click="showNewPostModal = true"
        >
          <template #icon>
            <n-icon>
              <PaperAirplaneIcon />
            </n-icon>
          </template>
          发表博文
        </n-button>
      </div>
    </nav>
  </div>

  <new-post-card v-model:show-modal="showNewPostModal" />
  <search-card v-model:show-search="showSearch" />
</template>

<script setup lang="ts">
import { PopoverGroup } from '@headlessui/vue'
import { NAvatar, NButton, NIcon, NDropdown, NText } from 'naive-ui'
import { h, ref } from 'vue'
import {
  PaperAirplaneIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
  LockClosedIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import { RenderIcon } from '../scripts/utils/ui'
import router from '../router'
import NewPostCard from './NewPostCard.vue'
import SearchCard from './SearchCard.vue'
import { AuthInfo } from '../stores/auth'

const props = defineProps<{
  uid: number
  avatarUrl: string
  username: string
  nickname: string
  displaySearch?: boolean
}>()
const showNewPostModal = ref(false)
const showSearch = ref(false)

function handleDropdownSelect(key: string) {
  switch (key) {
    case 'profile':
      router.push(`/user/${props.uid}`)
      break
    case 'editProfile':
      router.push('/settings/profile')
      break
    case 'accountSettings':
      router.push('/settings/account')
      break
    case 'logout':
      new AuthInfo().clearToken()
      router.push('/auth')
      break
  }
}

function renderUserInfo() {
  return h(
    'div',
    {
      style: 'display: flex; align-items: center; padding: 8px 12px;'
    },
    [
      h(NAvatar, {
        round: true,
        style: 'margin-right: 12px;',
        src: props.avatarUrl
      }),
      h('div', null, [
        h('div', null, [h(NText, { depth: 2 }, { default: () => props.nickname })]),
        h('div', { style: 'font-size: 12px;' }, [
          h(NText, { depth: 3 }, { default: () => `@${props.username}` })
        ])
      ])
    ]
  )
}

const options = ref([
  {
    key: 'header',
    type: 'render',
    render: renderUserInfo
  },
  {
    key: 'header-divider',
    type: 'divider'
  },
  {
    label: '个人主页',
    key: 'profile',
    icon: RenderIcon(UserCircleIcon)
  },
  {
    label: '资料设置',
    key: 'editProfile',
    icon: RenderIcon(Cog6ToothIcon)
  },
  {
    label: '账户设置',
    key: 'accountSettings',
    icon: RenderIcon(LockClosedIcon)
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: RenderIcon(ArrowLeftStartOnRectangleIcon)
  }
])
</script>

<style scoped>
.nav_item {
  @apply text-white text-base drop-shadow-lg p-4 px-8;
  @apply hover:bg-[var(--primaryColorDarken)] transition-all;
}
</style>
