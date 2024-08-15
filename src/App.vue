<template>
  <n-config-provider :theme-overrides="theme">
    <n-message-provider>
      <RouterView />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { NMessageProvider, NConfigProvider, type GlobalThemeOverrides } from 'naive-ui'

const theme: GlobalThemeOverrides = {
  common: {
    fontWeight: '400',
    primaryColor: '#0ea5e9',
    primaryColorHover: '#0284c7',
    primaryColorSuppl: '#0284c7',
    primaryColorPressed: '#0369a1',
    borderRadius: '12px'
  },
  Button: {
    textColor: '#0ea5e9'
  },
  Tag: {
    color: '#bae6fd',
    textColor: '#0ea5e9'
  }
}
</script>

<style scoped>
/* iconfont css */
@import url('//at.alicdn.com/t/c/font_4408030_pck7mz8cigh.css');

/* fonts */
@import url('https://fonts.loli.net/css2?family=Raleway:wght@400;500;700&display=swap');
@import url('https://fonts.loli.net/css2?family=Noto+Serif+SC:wght@400;500;700&display=swap');
@import url('https://fonts.loli.net/css2?family=Mulish:wght@400;500;700&display=swap');
@import url('https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@100;200;300;400;500;600;700;800;900&display=swap');
</style>
