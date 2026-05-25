<template>
  <view class="page">
    <up-navbar title="设备主页" :bg-color="THEME_GREEN" title-color="#fff" left-icon="arrow-left" left-icon-color="#fff"
      :auto-back="true" :placeholder="true" :safe-area-inset-top="true"></up-navbar>

    <scroll-view class="page-scroll" scroll-y>
      <!-- 设备状态卡 -->
      <view class="status-card">
        <view class="status-card__head">
          <text class="status-card__id">{{ deviceId }}</text>
          <view class="status-card__power">
            <up-switch v-model="remotePowerOn" :active-color="THEME_GREEN" size="22"
              @change="onPowerChange"></up-switch>
            <text class="status-card__power-label">远程开关机</text>
          </view>
        </view>
        <text class="status-card__time">更新时间: {{ updateTime }}</text>
        <view class="status-card__signals">
          <view v-for="sig in signals" :key="sig.key" class="signal-item">
            <view class="signal-item__icon">
              <view v-if="sig.key === 'gsm'" class="signal-bars">
                <view v-for="n in 4" :key="n" class="signal-bars__bar"></view>
              </view>
              <image
                v-else-if="sig.key === 'satellite'"
                class="signal-satellite__image"
                :src="satelliteImg"
                mode="widthFix"
              ></image>
              <view v-else class="signal-battery">
                <view class="signal-battery__body">
                  <view class="signal-battery__level"></view>
                </view>
                <view class="signal-battery__head"></view>
              </view>
            </view>
            <text class="signal-item__name">{{ sig.name }}</text>
            <view class="signal-badge" :class="'signal-badge--' + sig.badgeType">
              <text>{{ sig.value }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 功能宫格 -->
      <view class="menu-grid">
        <view v-for="item in menuList" :key="item.key" class="menu-item" @click="onMenuClick(item)">
          <view class="menu-item__icon" :style="{ background: item.bg }">
            <up-icon :name="item.icon" color="#fff" size="36"></up-icon>
          </view>
          <text class="menu-item__label">{{ item.label }}</text>
        </view>
      </view>
    </scroll-view>

    <share-location-modal :show="showShareModal" :device-id="deviceId" @close="showShareModal = false"
      @later="showShareModal = false" @order="onShareOrder" />
  </view>
</template>

<script>
import { THEME_GREEN } from '@/common/theme.js'
import { staticUrl } from '@/common/assets.js'

export default {
  data() {
    return {
      THEME_GREEN,
      satelliteImg: staticUrl('/static/satellite.png'),
      deviceId: '15070055007',
      updateTime: '2026/05/21 17:47:18',
      remotePowerOn: true,
      showShareModal: false,
      signals: [
        { key: 'gsm', name: 'GSM', value: '优秀', badgeType: 'success' },
        { key: 'satellite', name: '卫星信号', value: '优秀', badgeType: 'success' },
        { key: 'battery', name: '电量', value: '0%', badgeType: 'danger' },
      ],
      menuList: [
        { key: 'service', label: '增值服务', icon: 'gift-fill', bg: 'linear-gradient(135deg,#ff6b6b,#e53935)' },
        { key: 'sim', label: '卡', icon: 'coupon-fill', bg: 'linear-gradient(135deg,#ffd54f,#ffb300)' },
        { key: 'alarm', label: '告警设置', icon: 'bell-fill', bg: 'linear-gradient(135deg,#ff6b6b,#e53935)' },
        { key: 'location', label: '定位', icon: 'map-fill', bg: 'linear-gradient(135deg,#4a9eff,#2b7de9)' },
        { key: 'track', label: '历史轨迹', icon: 'clock-fill', bg: 'linear-gradient(135deg,#ff6b6b,#e53935)' },
        { key: 'fence', label: '围栏', icon: 'scan', bg: 'linear-gradient(135deg,#3dba6e,#2db8a8)' },
        { key: 'share', label: '分享定位', icon: 'share-fill', bg: 'linear-gradient(135deg,#4a9eff,#2b7de9)' },
        { key: 'report', label: '报表', icon: 'grid-fill', bg: 'linear-gradient(135deg,#3dba6e,#2db8a8)' },
        { key: 'remote', label: '远程设置', icon: 'setting-fill', bg: 'linear-gradient(135deg,#4a9eff,#2b7de9)' },
        { key: 'workmode', label: '工作模式', icon: 'map', bg: 'linear-gradient(135deg,#ffd54f,#ffb300)' },
        { key: 'info', label: '设备信息', icon: 'file-text-fill', bg: 'linear-gradient(135deg,#ff6b6b,#e53935)' },
      ],
    }
  },
  onLoad(options) {
    if (options.deviceId) {
      this.deviceId = options.deviceId
    }
    if (options.updateTime) {
      this.updateTime = options.updateTime
    }
  },
  methods: {
    onPowerChange(val) {
      uni.$u.toast(val ? '远程开机' : '远程关机')
    },
    onShareOrder(deviceId) {
      const id = deviceId || this.deviceId
      uni.navigateTo({
        url: `/pages/service/service?deviceId=${id}&phone=${id}&tab=share`,
      })
    },
    onMenuClick(item) {
      const id = this.deviceId
      switch (item.key) {
        case 'location':
          uni.switchTab({ url: '/pages/location/location' })
          break
        case 'service':
          uni.navigateTo({
            url: `/pages/service/service?deviceId=${id}&phone=${id}`,
          })
          break
        case 'sim':
          uni.navigateTo({
            url: `/pages/sim/sim?deviceId=${id}`,
          })
          break
        case 'alarm':
          uni.navigateTo({
            url: `/pages/alarm/alarm?deviceId=${id}`,
          })
          break
        case 'fence':
          uni.navigateTo({
            url: `/pages/fence/fence?deviceId=${id}`,
          })
          break
        case 'track':
          uni.navigateTo({ url: `/pages/track/track?deviceId=${id}` })
          break
        case 'share':
          this.showShareModal = true
          break
        case 'report':
          uni.navigateTo({
            url: `/pages/report/report?deviceId=${id}`,
          })
          break
        case 'remote':
          uni.navigateTo({
            url: `/pages/remote/remote?deviceId=${id}`,
          })
          break
        case 'workmode':
          uni.navigateTo({
            url: `/pages/workmode/workmode?deviceId=${id}`,
          })
          break
        case 'info':
          uni.navigateTo({
            url: `/pages/device/info?deviceId=${id}&updateTime=${encodeURIComponent(this.updateTime)}`,
          })
          break
        default:
          uni.$u.toast(item.label)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
}

.page-scroll {
  flex: 1;
  height: 0;
  padding: 24rpx;
  box-sizing: border-box;
}

.status-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.status-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.status-card__id {
  font-size: 40rpx;
  font-weight: 700;
  color: #222;
}

.status-card__power {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.status-card__power-label {
  font-size: 22rpx;
  color: #999;
}

.status-card__time {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 24rpx;
}

.status-card__signals {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8rpx;
}

.signal-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  min-width: 0;
}

.signal-item__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signal-item__name {
  font-size: 24rpx;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0;
}

.signal-bars {
  display: flex;
  align-items: flex-end;
  gap: 3rpx;
  height: 28rpx;
}

.signal-bars__bar {
  width: 6rpx;
  border-radius: 2rpx;
  background: #3dba6e;

  &:nth-child(1) {
    height: 10rpx;
  }

  &:nth-child(2) {
    height: 16rpx;
  }

  &:nth-child(3) {
    height: 22rpx;
  }

  &:nth-child(4) {
    height: 28rpx;
  }
}

.signal-satellite {
  position: relative;
  width: 32rpx;
  height: 28rpx;
}

.signal-satellite__image {
  width: 30rpx;
  height: 30rpx;
}

.signal-battery {
  display: flex;
  align-items: center;
}

.signal-battery__body {
  width: 36rpx;
  height: 18rpx;
  border: 2rpx solid #999;
  border-radius: 4rpx;
  padding: 2rpx;
  box-sizing: border-box;
}

.signal-battery__level {
  width: 18%;
  height: 100%;
  background: #ff6b6b;
  border-radius: 2rpx;
}

.signal-battery__head {
  width: 4rpx;
  height: 10rpx;
  background: #999;
  border-radius: 0 2rpx 2rpx 0;
}

.signal-badge {
  flex-shrink: 0;
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    font-size: 22rpx;
    color: #fff;
    font-weight: 500;
    line-height: 1;
  }
}

.signal-badge--success {
  background: #3dba6e;
}

.signal-badge--danger {
  background: #ff7b6b;
}

.menu-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10rpx;
}

.menu-item {
  width: calc(33.33% - 20rpx);
  margin: 0 10rpx 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx 12rpx 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.menu-item__icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.menu-item__label {
  font-size: 26rpx;
  color: #333;
  text-align: center;
}
</style>
