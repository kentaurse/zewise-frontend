<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 导航栏 -->
    <NavBar
      :uid="userProfile.uid"
      :avatar-url="userProfile.avatar_url"
      :username="userProfile.username"
      :nickname="userProfile.nickname"
    />

    <AvatarUpload v-model:show-modal="showModal" />

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
            class="absolute top-0 left-0 ring-4 ring-white cursor-pointer"
            :size="160"
            :src="userProfile.avatar_url"
          />
          <div
            ref="avatarUploadTooltip"
            class="hidden absolute top-0 left-0 w-40 h-40 bg-black/50 rounded-xl cursor-pointer"
          >
            <ArrowUpTrayIcon class="absolute w-8 text-white left-1/2 -translate-x-1/2 top-10" />
            <p class="absolute w-8 text-white left-1/2 -translate-x-1/2 bottom-9">上传头像</p>
          </div>
        </div>
        <div class="absolute left-56 top-4">
          <div class="flex flex-row items-end">
            <n-p class="text-4xl mb-0 mr-2">{{ userProfile.nickname }}</n-p>
            <n-p class="text-lg mb-0">{{ `@${userProfile.username}` }}</n-p>
          </div>
          <div>
            <n-tag :bordered="false" type="warning" class="mt-1 mr-2">{{
              `Lv. ${userProfile.level}`
            }}</n-tag>
            <n-tag :bordered="false">{{ `UID: ${userProfile.uid}` }}</n-tag>
          </div>
        </div>

        <div class="absolute right-6 top-4">
          <n-button ghost class="flex drop-shadow-lg" @click="handleClickBackToProfile">
            返回个人主页
          </n-button>
        </div>

        <div class="mt-36 mx-12">
          <!--  -->
          <div class="grid gap-4 grid-cols-2">
            <n-p class="self-center text-lg mb-0">昵称</n-p>
            <n-input
              type="text"
              size="large"
              placeholder="在此输入用户名"
              v-model:value="modifiedProfile!.nickname"
            />
          </div>
          <n-divider />
          <!--  -->
          <div class="grid gap-4 grid-cols-2">
            <n-p class="self-center text-lg mb-0">生日</n-p>
            <div class="w-full flex flex-row items-center">
              <n-radio
                :checked="birthSelect === 'private'"
                value="private"
                @change="handleBirthSelectChange"
                >隐藏</n-radio
              >
              <n-radio
                :checked="birthSelect === 'public'"
                value="public"
                @change="handleBirthSelectChange"
                >公开</n-radio
              >
              <n-date-picker class="grow ml-4" v-model:value="birthday" type="date" />
            </div>
          </div>
          <n-divider />
          <!--  -->
          <div class="grid gap-4 grid-cols-2">
            <n-p class="self-center text-lg mb-0">性别</n-p>
            <div class="w-full flex flex-row justify-between">
              <n-radio
                :checked="genderSelect === 'private'"
                value="private"
                @change="handleGenderSelectChange"
                >隐藏</n-radio
              >
              <n-radio
                :checked="genderSelect === 'male'"
                value="male"
                @change="handleGenderSelectChange"
                >男</n-radio
              >
              <n-radio
                :checked="genderSelect === 'female'"
                value="female"
                @change="handleGenderSelectChange"
                >女</n-radio
              >
            </div>
          </div>
          <div class="mt-8 mb-8 flex flex-row justify-end">
            <n-button secondary class="px-4 mr-1" @click="initForm">重置</n-button>
            <n-button
              type="primary"
              class="px-4 ml-1 bg-[var(--n-color)]"
              strong
              @click="updateUserProfile"
              >提交</n-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'
import AvatarUpload from '../components/AvatarUpload.vue'
import { DefaultUserProfile, GetUserProfile, type UserProfile } from '../scripts/user'
import { onMounted } from 'vue'
import {
  NAvatar,
  NP,
  NTag,
  NInput,
  NDivider,
  NDatePicker,
  NRadio,
  NButton,
  useMessage
} from 'naive-ui'
import { ArrowUpTrayIcon } from '@heroicons/vue/24/outline'
import { AuthInfo } from '../stores/auth'
import router from '../router'

const message = useMessage()
const avatarUploadTooltip = ref<HTMLDivElement>()
const showModal = ref(false)

const userProfile = ref<UserProfile>(DefaultUserProfile)
const modifiedProfile = ref<UserProfile>(DefaultUserProfile)
const birthday = ref<number>(new Date().valueOf())
const birthSelect = ref<'private' | 'public'>('private')
const genderSelect = ref<'private' | 'male' | 'female'>('private')

function handleClickBackToProfile() {
  if (userProfile.value.uid == -1) return
  router.push(`/user/${userProfile.value.uid}`)
}

// 生日选择
function handleBirthSelectChange(e: Event) {
  birthSelect.value = (e.target as HTMLInputElement).value as 'private' | 'public'
}

// 性别选择
function handleGenderSelectChange(e: Event) {
  genderSelect.value = (e.target as HTMLInputElement).value as 'private' | 'male' | 'female'
}

// 更新用户信息
async function updateUserProfile() {
  modifiedProfile.value.birth = birthSelect.value === 'private' ? null : birthday.value
  modifiedProfile.value.gender = genderSelect.value === 'private' ? null : genderSelect.value

  const authInfo = new AuthInfo()
  const resp = await fetch('/api/user/edit', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authInfo.auth.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(modifiedProfile.value)
  })
  const data = await resp.json()

  if (data.code === 0) {
    message.success('修改成功')
    userProfile.value = await GetUserProfile()
    initForm()
    return
  }

  message.error('修改失败')
}

// 初始化表单
function initForm() {
  modifiedProfile.value = Object.assign({}, userProfile.value)

  if (userProfile.value.birth) {
    birthday.value = userProfile.value.birth
  } else {
    birthday.value = new Date().valueOf()
  }

  if (userProfile.value.birth === null) {
    birthSelect.value = 'private'
  } else {
    birthSelect.value = 'public'
  }

  if (userProfile.value.gender === null) {
    genderSelect.value = 'private'
  } else {
    genderSelect.value = userProfile.value.gender as unknown as 'male' | 'female'
  }
}

onMounted(async () => {
  userProfile.value = await GetUserProfile()
  initForm()
})
</script>

<style scoped>
.profile-bg {
  @apply w-full h-80 rounded-t-2xl bg-top bg-cover bg-no-repeat brightness-75;
  background-image: url('/src/assets/background.jpg');
}
</style>

