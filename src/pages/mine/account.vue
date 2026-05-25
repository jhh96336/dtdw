<template>
  <view class="page">
    <up-navbar
      title="账号与安全"
      :bg-color="THEME_GREEN"
      title-color="#fff"
      left-icon="arrow-left"
      left-icon-color="#fff"
      :auto-back="true"
      :placeholder="true"
      :safe-area-inset-top="true"
    ></up-navbar>

    <view class="menu-group">
      <view class="menu-item" @click="goChangePassword">
        <text class="menu-item__label">修改设备密码</text>
        <up-icon name="arrow-right" color="#ccc" size="16"></up-icon>
      </view>
      <view class="menu-item menu-item--last" @click="goAccountCancel">
        <text class="menu-item__label">账号注销</text>
        <up-icon name="arrow-right" color="#ccc" size="16"></up-icon>
      </view>
    </view>
  </view>
</template>

<script>
import { THEME_GREEN } from '@/common/theme.js'

export default {
  data() {
    return {
      THEME_GREEN,
    }
  },
  methods: {
    goChangePassword() {
      uni.navigateTo({ url: '/pages/mine/change-password' })
    },
    goAccountCancel() {
      uni.navigateTo({ url: '/pages/mine/account-cancel' })
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #fff;
}

.menu-group {
  background: #fff;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.menu-item--last {
  border-bottom: none;
}

.menu-item__label {
  font-size: 30rpx;
  color: #333;
}
</style>
