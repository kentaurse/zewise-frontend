<template>
  <main class="main">
    <div class="background">
      <div class="artist">
        <p>
          * 由艺术家 <a href="https://www.pixiv.net/artworks/114649225">Ringein</a> 创作的插画作品
        </p>
      </div>
    </div>

    <div class="logo">
      <p class="iconfont icon-logo" />
      <p>HiSea</p>
    </div>

    <div class="shapes">
      <div class="shape_1" />
      <div class="shape_2" />
    </div>

    <div class="auth">
      <n-card class="card">
        <p class="title">立即加入 HiSea 海智</p>
        <n-tabs
          class="card-tabs"
          default-value="signin"
          size="large"
          animated
          pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        >
          <n-tab-pane name="signin" tab="登录">
            <n-form>
              <n-form-item-row label="用户名">
                <n-input
                  placeholder="在此输入用户名"
                  type="text"
                  v-model:value="loginForm.username"
                  :status="loginFormUsernameStatus"
                />
              </n-form-item-row>
              <n-form-item-row label="密码">
                <n-input
                  placeholder="在此输入密码"
                  type="password"
                  show-password-on="click"
                  v-model:value="loginForm.password"
                  :status="loginFormPasswordStatus"
                />
              </n-form-item-row>
            </n-form>
            <n-button type="primary" block secondary strong @click="handleLogin"> 登录 </n-button>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="注册">
            <n-form>
              <n-form-item-row label="用户名">
                <n-input
                  placeholder="在此输入用户名"
                  type="text"
                  v-model:value="registerForm.username"
                  :status="registerFormUsernameStatus"
                />
              </n-form-item-row>
              <n-form-item-row label="密码">
                <n-input
                  placeholder="在此输入密码"
                  type="password"
                  show-password-on="click"
                  v-model:value="registerForm.password"
                  :status="registerFormPasswordStatus"
                />
              </n-form-item-row>
              <n-form-item-row label="重复密码">
                <n-input
                  placeholder="在此再次输入密码"
                  type="password"
                  show-password-on="click"
                  v-model:value="registerForm.repeatPassword"
                  :status="registerFormRepeatPasswordStatus"
                />
              </n-form-item-row>
            </n-form>
            <n-button type="primary" block secondary strong @click="handleRegister">
              注册
            </n-button>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useMessage, NCard, NTabs, NTabPane, NForm, NFormItemRow, NButton, NInput } from 'naive-ui'
import type { FormValidationStatus } from 'naive-ui/es/form/src/interface'
import { ref } from 'vue'
import { Login, Register } from '../scripts/auth'
import { AuthInfo } from '../stores/auth'

// 引入消息提示
const message = useMessage()

// 定义登录和注册表单的数据
const loginForm = ref({
  username: '',
  password: ''
})
const registerForm = ref({
  username: '',
  password: '',
  repeatPassword: ''
})

// 定义登录和注册表单的状态
const loginFormUsernameStatus = ref<FormValidationStatus>()
const loginFormPasswordStatus = ref<FormValidationStatus>()
const registerFormUsernameStatus = ref<FormValidationStatus>()
const registerFormPasswordStatus = ref<FormValidationStatus>()
const registerFormRepeatPasswordStatus = ref<FormValidationStatus>()

// 定义登录提交函数
async function handleLogin() {
  // 重置表单状态
  loginFormUsernameStatus.value = undefined
  loginFormPasswordStatus.value = undefined

  // 校验登录表单
  if (!loginForm.value.username) {
    message.error('用户名不能为空')
    loginFormUsernameStatus.value = 'error'
    return
  }
  if (!loginForm.value.password) {
    message.error('密码不能为空')
    loginFormPasswordStatus.value = 'error'
    return
  }

  var token: string
  try {
    token = await Login(loginForm.value.username, loginForm.value.password)
  } catch (err) {
    message.error('登录失败：账号或密码错误')
    loginFormUsernameStatus.value = 'error'
    loginFormPasswordStatus.value = 'error'
    return
  }

  const authInfo = new AuthInfo()
  authInfo.setToken(token)

  message.success('登录成功')
  window.location.href = '/'
}

// 定义注册提交函数
async function handleRegister() {
  // 重置表单状态
  registerFormUsernameStatus.value = undefined
  registerFormPasswordStatus.value = undefined
  registerFormRepeatPasswordStatus.value = undefined

  // 校验注册表单
  if (!registerForm.value.username) {
    message.error('用户名不能为空')
    registerFormUsernameStatus.value = 'error'
    return
  }
  if (!registerForm.value.password) {
    message.error('密码不能为空')
    registerFormPasswordStatus.value = 'error'
    return
  }
  if (registerForm.value.password !== registerForm.value.repeatPassword) {
    message.error('两次输入的密码不一致')
    registerFormPasswordStatus.value = 'error'
    registerFormRepeatPasswordStatus.value = 'error'
    return
  }
  if (!/^[a-z0-9_]+$/.test(registerForm.value.username)) {
    message.error('用户名只能包含小写字母、数字和下划线')
    registerFormUsernameStatus.value = 'error'
    return
  }
  if (registerForm.value.password.length < 8) {
    message.error('密码长度不能小于8位')
    registerFormPasswordStatus.value = 'error'
    return
  }
  if (registerForm.value.password.length > 32) {
    message.error('密码长度不能大于32位')
    registerFormPasswordStatus.value = 'error'
    return
  }
  if (!/^[a-zA-Z0-9!@#$%^&*()_+={}[\]:;'"<>,.?/|\\~-]+$/.test(registerForm.value.password)) {
    message.error('密码只能包含大小写字母、数字和常用特殊字符')
    registerFormPasswordStatus.value = 'error'
    return
  }

  // 处理注册逻辑
  try {
    await Register(registerForm.value.username, registerForm.value.password)
  } catch (err) {
    if ((err as Error).message === 'username already exists') {
      message.error('注册失败：用户名已存在')
      registerFormUsernameStatus.value = 'error'
      return
    }
    message.error(`注册失败：${(err as Error).message}`)
    return
  }

  // 登录获取 token
  var token: string
  try {
    token = await Login(registerForm.value.username, registerForm.value.password)
  } catch (err) {
    message.error('登录失败：账号或密码错误')
    return
  }

  const authInfo = new AuthInfo()
  authInfo.setToken(token)

  message.success('注册成功')
  window.location.href = '/'
}
</script>

<style scoped>
.background {
  @apply fixed w-full h-full top-0 right-0  bg-cover bg-center -z-20;
  @apply xl:w-4/5;
  background-image: url('../assets/background.jpg');
}

.background > .artist {
  @apply absolute right-8 bottom-6;
}

.background > .artist > p {
  @apply text-xl text-white drop-shadow-md;
  font-family: 'Mulish', 'Noto Serif SC', sans-serif;
}

.logo {
  @apply fixed flex top-4 left-4 select-none items-center;
}

.logo p {
  @apply text-white text-2xl px-1 drop-shadow-md;
  font-family: 'Raleway', sans-serif;
}

.shapes {
  @apply hidden fixed top-0 left-0 -z-10;
  @apply xl:block;
}

.shapes > .shape_1 {
  @apply fixed w-full h-full bg-[var(--primaryColor)];
  clip-path: polygon(0% 0%, 45% 0%, 20% 100%, 0% 100%);
}

.shapes > .shape_2 {
  @apply fixed w-full h-full bg-[var(--primaryColor)] opacity-50;
  clip-path: polygon(0% 0%, 25% 0%, 35% 100%, 0% 100%);
}

.auth {
  @apply fixed top-0 left-0 w-full h-full;
  @apply xl:w-1/3;
}

.auth > .card {
  @apply top-1/2 w-[75%] mx-auto drop-shadow-xl -translate-y-1/2;
  @apply md:w-[50%];
  @apply xl:w-[75%];
}

.auth > .card .title {
  @apply text-xl my-2 text-[var(--primaryColor)] drop-shadow-sm;
  font-family: 'Raleway', 'Noto Sans SC', sans-serif;
}
</style>
