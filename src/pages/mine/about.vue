<template>
  <view class="page">
    <up-navbar
      title="关于"
      :bg-color="THEME_GREEN"
      title-color="#fff"
      left-icon="arrow-left"
      left-icon-color="#fff"
      :auto-back="true"
      :placeholder="true"
      :safe-area-inset-top="true"
    ></up-navbar>

    <view class="main">
      <view class="brand">
        <view class="brand__logo">
          <up-icon name="map-fill" color="#fff" size="48"></up-icon>
        </view>
        <text class="brand__name">{{ appName }}</text>
        <text class="brand__version">Version {{ version }}</text>
      </view>

      <view class="check-btn" @click="onCheckUpdate">
        <text>检测更新</text>
      </view>
    </view>

    <view class="footer">
      <text class="footer__line">Copyright © {{ copyrightYear }}</text>
      <text class="footer__line">{{ company }}</text>
      <text class="footer__line">{{ icp }}</text>
    </view>
  </view>
</template>

<script>
import { THEME_GREEN } from '@/common/theme.js'

export default {
  data() {
    return {
      THEME_GREEN,
      appName: 'OC智联',
      version: '1.19.0',
      copyrightYear: '2026',
      company: '厦门中宇恒科技有限公司',
      icp: '闽ICP备2023003450号-2A',
      checking: false,
    }
  },
  onLoad() {
    this.loadVersion()
  },
  methods: {
    loadVersion() {
      // #ifdef APP-PLUS
      plus.runtime.getProperty(plus.runtime.appid, (info) => {
        if (info?.version) this.version = info.version
      })
      // #endif
      // TODO: 也可从后端配置接口获取最新版本号与展示信息
    },
    onCheckUpdate() {
      if (this.checking) return
      this.checking = true
      uni.showLoading({ title: '检测中...', mask: true })
      // TODO: 对接版本检测接口
      setTimeout(() => {
        uni.hideLoading()
        this.checking = false
        uni.$u.toast('当前已是最新版本')
      }, 800)
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120rpx;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
}

.brand__logo {
  width: 160rpx;
  height: 160rpx;
  border-radius: 32rpx;
  background: #3dba6e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(61, 186, 110, 0.25);
}

.brand__name {
  font-size: 44rpx;
  font-weight: 700;
  color: #222;
  margin-bottom: 16rpx;
}

.brand__version {
  font-size: 28rpx;
  color: #999;
}

.check-btn {
  width: 360rpx;
  height: 88rpx;
  background: #3dba6e;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    font-size: 32rpx;
    color: #fff;
    font-weight: 500;
  }
}

.footer {
  padding: 48rpx 32rpx calc(48rpx + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.footer__line {
  font-size: 24rpx;
  color: #bbb;
  line-height: 1.6;
  text-align: center;
}
</style>
