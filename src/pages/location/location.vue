<template>
  <view class="page">
    <!-- 地图区域 -->
    <view class="map-wrap">
      <view class="map-bg"></view>
      <view class="map-marker">
        <view class="marker-arrow"></view>
        <view class="marker-dot"></view>
      </view>

      <view class="map-refresh" @click="onRefresh">
        <up-icon name="reload" color="#333" size="18"></up-icon>
        <text class="map-refresh__text">刷新({{ refreshCount }})</text>
      </view>

      <view class="map-tools">
        <view v-for="(tool, idx) in mapTools" :key="idx" class="map-tools__item" @click="onToolClick(tool)">
          <up-icon :name="tool.icon" color="#333" size="22"></up-icon>
        </view>
      </view>
    </view>

    <!-- 设备信息面板 -->
    <view class="device-panel">
      <view v-if="showBanner" class="device-panel__banner" @click="onFastLocate">
        <view class="banner-pin">
          <view class="banner-pin__shadow"></view>
          <view class="banner-pin__body">
            <view class="banner-pin__center"></view>
          </view>
        </view>
        <text class="device-panel__banner-text">秒速定位 点击开启</text>
        <view class="banner-close" @click.stop="onCloseBanner">
          <up-icon name="close" color="#fff" size="18"></up-icon>
        </view>
      </view>

      <view class="device-panel__body" :class="{ 'device-panel__body--no-banner': !showBanner }">
        <view class="device-head">
          <view class="device-head__left" @click="goDeviceHome">
            <text class="device-id">{{ device.id }}</text>
            <view class="status-badge">
              {{ device.status }}
            </view>
            <text class="status-duration">{{ device.statusDuration }}</text>
          </view>
          <view class="device-battery">
            <view class="battery-icon" :class="{ 'battery-icon--low': device.battery <= 20 }">
              <view class="battery-icon__body">
                <view v-if="device.battery > 0" class="battery-icon__level" :style="{ width: device.battery + '%' }">
                </view>
              </view>
              <view class="battery-icon__head"></view>
            </view>
            <text class="device-battery__text" :class="{ 'device-battery__text--low': device.battery <= 20 }">
              {{ device.battery }}%
            </text>
          </view>
        </view>

        <text class="device-address">{{ device.address }}</text>

        <view class="device-detail">
          <view class="device-detail__main">
            <view class="device-meta">
              <text class="device-meta__text">{{ device.meta }}</text>
            </view>
            <view class="device-time">
              <view class="device-time__item">
                <up-icon name="clock" color="#bbb" size="14"></up-icon>
                <text>更新时间: {{ device.updateTime }}</text>
              </view>
              <view class="device-time__item">
                <up-icon name="map" color="#bbb" size="14"></up-icon>
                <text>距离我{{ device.distance }}</text>
              </view>
            </view>
          </view>
          <view class="device-share" @click="onShare">
            <view class="device-share__icon">
              <up-icon name="share" color="#fff" size="22"></up-icon>
            </view>
            <text class="device-share__text">分享定位</text>
          </view>
        </view>

        <view class="device-actions">
          <view v-for="action in actions" :key="action.key" class="device-actions__item" @click="onAction(action)">
            <view class="device-actions__icon" :style="{ background: action.bg }">
              <up-icon :name="action.icon" color="#fff" size="28"></up-icon>
            </view>
            <text class="device-actions__label">{{ action.label }}</text>
          </view>
        </view>
      </view>
    </view>

    <share-location-modal :show="showShareModal" :device-id="device.id" @close="showShareModal = false"
      @later="showShareModal = false" @order="onShareOrder" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      refreshCount: 20,
      showBanner: true,
      showShareModal: false,
      mapTools: [
        { icon: 'grid', label: '图层' },
        { icon: 'car', label: '路况' },
        { icon: 'wifi', label: 'GPS' },
        { icon: 'map', label: '定位' },
        { icon: 'arrow-rightward', label: '导航' },
      ],
      device: {
        id: '15070055007',
        status: '离线',
        statusDuration: '离线23小时',
        battery: 0,
        address: '江西省九江市濂溪区前进西路靠近安泰汽车检测',
        meta: '0km/h | 正南 | Wi-Fi定位 | JSK1 | 离线 | 定位时间:2026/05/21 17:47:18 | 未充电 | 智能定位模式 | 震动告警:开启',
        updateTime: '2026/05/21 17:47:18',
        distance: '591.528km',
      },
      actions: [
        { key: 'precise', label: '高精准定位', icon: 'map-fill', bg: 'linear-gradient(135deg,#4a9eff,#2b7de9)' },
        { key: 'service', label: '增值服务', icon: 'gift-fill', bg: 'linear-gradient(135deg,#ff9f43,#f57c00)' },
        { key: 'track', label: '历史轨迹', icon: 'clock-fill', bg: 'linear-gradient(135deg,#ff6b6b,#e53935)' },
        { key: 'more', label: '更多', icon: 'more-dot-fill', bg: 'linear-gradient(135deg,#ffd54f,#ffb300)' },
      ],
    }
  },
  methods: {
    onRefresh() {
      if (this.refreshCount > 0) this.refreshCount--
      uni.$u.toast('已刷新')
    },
    onToolClick(tool) {
      uni.$u.toast(tool.label)
    },
    onFastLocate() {
      uni.$u.toast('秒速定位')
    },
    onCloseBanner() {
      this.showBanner = false
    },
    onShare() {
      this.showShareModal = true
    },
    onShareOrder(deviceId) {
      const id = deviceId || this.device.id
      uni.navigateTo({
        url: `/pages/service/service?deviceId=${id}&phone=${id}&tab=share`,
      })
    },
    goDeviceHome() {
      uni.navigateTo({
        url: `/pages/device/device?deviceId=${this.device.id}&updateTime=${encodeURIComponent(this.device.updateTime)}`,
      })
    },
    onAction(action) {
      if (action.key === 'track') {
        uni.navigateTo({
          url: `/pages/track/track?deviceId=${this.device.id}`,
        })
        return
      }
      if (action.key === 'more') {
        this.goDeviceHome()
        return
      }
      if (action.key === 'service') {
        uni.navigateTo({
          url: `/pages/service/service?deviceId=${this.device.id}&phone=${this.device.id}`,
        })
        return
      }
      uni.$u.toast(action.label)
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #e8eef3;
}

.map-wrap {
  position: relative;
  height: 52vh;
  overflow: hidden;
}

.map-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #c5dce8 0%, #dfeef5 40%, #e8f0e8 100%);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
      linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px);
    background-size: 80rpx 80rpx;
    opacity: 0.5;
  }
}

.map-marker {
  position: absolute;
  left: 50%;
  top: 42%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.marker-arrow {
  width: 0;
  height: 0;
  border-left: 16rpx solid transparent;
  border-right: 16rpx solid transparent;
  border-bottom: 36rpx solid #2b7de9;
  filter: drop-shadow(0 4rpx 8rpx rgba(0, 0, 0, 0.2));
}

.marker-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #2b7de9;
  margin-top: -4rpx;
}

.map-refresh {
  position: absolute;
  left: 24rpx;
  top: calc(env(safe-area-inset-top) + 16rpx);
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.map-refresh__text {
  font-size: 26rpx;
  color: #333;
}

.map-tools {
  position: absolute;
  right: 24rpx;
  top: calc(env(safe-area-inset-top) + 16rpx);
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.map-tools__item {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.device-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding-bottom: calc(50px + env(safe-area-inset-bottom));
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.08);
  z-index: 2;
}

.device-panel__banner {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 24rpx;
  background: linear-gradient(90deg, #3dba6e, #2db8a8);
}

.device-panel__banner-text {
  flex: 1;
  font-size: 30rpx;
  color: #fff;
  font-weight: 500;
}

.banner-pin {
  position: relative;
  flex-shrink: 0;
  width: 44rpx;
  height: 52rpx;
}

.banner-pin__shadow {
  position: absolute;
  left: 50%;
  bottom: 2rpx;
  width: 28rpx;
  height: 8rpx;
  margin-left: -14rpx;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 50%;
}

.banner-pin__body {
  position: relative;
  width: 44rpx;
  height: 44rpx;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: linear-gradient(135deg, #5eb3ff, #2b7de9);
  box-shadow: 0 4rpx 10rpx rgba(43, 125, 233, 0.35);
}

.banner-pin__center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14rpx;
  height: 14rpx;
  margin: -7rpx 0 0 -7rpx;
  border-radius: 50%;
  background: #fff;
}

.banner-close {
  flex-shrink: 0;
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-panel__body {
  padding: 28rpx 28rpx 16rpx;
}

.device-panel__body--no-banner {
  border-radius: 24rpx 24rpx 0 0;
}

.device-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.device-head__left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx 16rpx;
  flex: 1;
  min-width: 0;
}

.device-id {
  font-size: 40rpx;
  font-weight: 700;
  color: #222;
  text-decoration: underline;
  text-decoration-color: rgba(61, 186, 110, 0.35);
  text-underline-offset: 4rpx;
}

.status-badge {
  padding: 4rpx 16rpx;
  background: #999;
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #fff;
}

.status-duration {
  font-size: 24rpx;
  color: #999;
}

.device-battery {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.battery-icon {
  display: flex;
  align-items: center;
}

.battery-icon__body {
  width: 36rpx;
  height: 18rpx;
  border: 2rpx solid #ccc;
  border-radius: 4rpx;
  padding: 2rpx;
  box-sizing: border-box;
}

.battery-icon__level {
  height: 100%;
  background: #3dba6e;
  border-radius: 2rpx;
  min-width: 0;
}

.battery-icon__head {
  width: 4rpx;
  height: 10rpx;
  background: #ccc;
  border-radius: 0 2rpx 2rpx 0;
  margin-left: 2rpx;
}

.battery-icon--low .battery-icon__body {
  border-color: #e74c3c;
}

.battery-icon--low .battery-icon__head {
  background: #e74c3c;
}

.battery-icon--low .battery-icon__level {
  background: #e74c3c;
}

.device-battery__text {
  font-size: 28rpx;
  color: #666;
  font-weight: 600;
}

.device-battery__text--low {
  color: #e74c3c;
}

.device-address {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  display: block;
  margin-bottom: 16rpx;
}

.device-detail {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 8rpx;
}

.device-detail__main {
  flex: 1;
  min-width: 0;
}

.device-meta {
  margin-bottom: 12rpx;
}

.device-meta__text {
  font-size: 22rpx;
  color: #999;
  line-height: 1.65;
  word-break: break-all;
}

.device-share {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.device-share__icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a9eff, #2b7de9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-share__text {
  font-size: 22rpx;
  color: #2b7de9;
}

.device-time {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8rpx 16rpx;
}

.device-time__item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 22rpx;
  color: #bbb;
  line-height: 1.4;
  white-space: nowrap;
}

.device-actions {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0 8rpx;
  margin-top: 8rpx;
  border-top: 1rpx solid #f0f0f0;
}

.device-actions__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.device-actions__icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-actions__label {
  font-size: 24rpx;
  color: #333;
}
</style>
