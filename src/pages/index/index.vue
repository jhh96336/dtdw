<template>
  <view class="page">
    <!-- 地图区域 -->
    <view class="map-wrap">
      <amap-view ref="amapRef" class="map-amap" :latitude="mapCenter.latitude" :longitude="mapCenter.longitude"
        :scale="mapScale" :marker-title="device.name || device.id" :address="device.address" @located="onMapLocated" />

      <view class="map-actions-left">
        <view class="map-refresh" @click="onRefresh">
          <up-icon name="reload" color="#333" size="18"></up-icon>
          <text class="map-refresh__text">刷新({{ refreshCount }})</text>
        </view>
        <view class="map-switch" @click="goSelectDevice">
          <up-icon name="list" color="#3dba6e" size="18"></up-icon>
          <text class="map-switch__text">切换设备</text>
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
                <view class="battery-icon__level" :style="{ width: device.battery + '%' }">
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
import AmapView from '@/components/amap-view/amap-view.vue'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_SCALE } from '@/common/amap-config'
import {
  getCurrentLocation,
  getDistanceMeters,
  formatDistance,
} from '@/common/amap'

const REFRESH_INTERVAL = 20
const STORAGE_KEY = 'currentDevice'

const DEFAULT_DEVICE = {
  id: '15070055007',
  name: '直播间展示 533',
  sn: '14166347553',
  status: '离线',
  statusType: 'offline',
  statusDuration: '离线23小时',
  battery: 0,
  address: '江西省九江市濂溪区前进西路靠近安泰汽车检测',
  latitude: DEFAULT_MAP_CENTER.latitude,
  longitude: DEFAULT_MAP_CENTER.longitude,
  meta: '0km/h | 正南 | Wi-Fi定位 | JSK1 | 离线 | 定位时间:2026/05/21 17:47:18 | 未充电 | 智能定位模式 | 震动告警:开启',
  updateTime: '2026/05/21 17:47:18',
  distance: '591.528km',
}

export default {
  components: { AmapView },
  data() {
    return {
      refreshCount: REFRESH_INTERVAL,
      refreshTimer: null,
      showBanner: true,
      showShareModal: false,
      mapScale: DEFAULT_MAP_SCALE,
      mapCenter: {
        latitude: DEFAULT_MAP_CENTER.latitude,
        longitude: DEFAULT_MAP_CENTER.longitude,
      },
      myLocation: null,
      device: { ...DEFAULT_DEVICE },
      actions: [
        { key: 'precise', label: '高精准定位', icon: 'map-fill', bg: 'linear-gradient(135deg,#4a9eff,#2b7de9)' },
        { key: 'service', label: '增值服务', icon: 'gift-fill', bg: 'linear-gradient(135deg,#ff9f43,#f57c00)' },
        { key: 'track', label: '历史轨迹', icon: 'clock-fill', bg: 'linear-gradient(135deg,#ff6b6b,#e53935)' },
        { key: 'more', label: '更多', icon: 'more-dot-fill', bg: 'linear-gradient(135deg,#ffd54f,#ffb300)' },
      ],
    }
  },
  onShow() {
    this.loadCurrentDevice()
    this.syncMapCenter()
    this.updateDistanceFromMe()
    this.startRefreshCountdown()
  },
  onHide() {
    this.stopRefreshCountdown()
  },
  onUnload() {
    this.stopRefreshCountdown()
  },
  methods: {
    startRefreshCountdown() {
      this.stopRefreshCountdown()
      this.refreshCount = REFRESH_INTERVAL
      this.refreshTimer = setInterval(() => {
        if (this.refreshCount <= 1) {
          this.refreshMapInfo(false)
          this.refreshCount = REFRESH_INTERVAL
        } else {
          this.refreshCount--
        }
      }, 1000)
    },
    stopRefreshCountdown() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer)
        this.refreshTimer = null
      }
    },
    syncMapCenter() {
      this.mapCenter = {
        latitude: this.device.latitude || DEFAULT_MAP_CENTER.latitude,
        longitude: this.device.longitude || DEFAULT_MAP_CENTER.longitude,
      }
      this.$nextTick(() => {
        this.$refs.amapRef?.locateDevice?.()
      })
    },
    async updateDistanceFromMe() {
      try {
        const pos = await getCurrentLocation()
        this.myLocation = pos
        const meters = getDistanceMeters(
          pos.longitude,
          pos.latitude,
          this.device.longitude,
          this.device.latitude
        )
        this.device.distance = formatDistance(meters)
      } catch {
        /* 未授权定位时保留原距离 */
      }
    },
    refreshMapInfo(showToast = true) {
      // TODO: 对接设备定位接口，更新 device.latitude / longitude / address
      const now = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      this.device.updateTime = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
      this.syncMapCenter()
      this.updateDistanceFromMe()
      if (showToast) uni.$u.toast('已刷新')
    },
    onRefresh() {
      this.refreshMapInfo(true)
      this.refreshCount = REFRESH_INTERVAL
    },
    loadCurrentDevice() {
      const saved = uni.getStorageSync(STORAGE_KEY)
      if (!saved || !saved.sn) return
      const status = saved.status || '离线'
      this.device = {
        ...DEFAULT_DEVICE,
        id: saved.sn,
        name: saved.name || saved.sn,
        sn: saved.sn,
        status,
        statusType: saved.statusType || (status === '静止' ? 'static' : 'offline'),
        statusDuration: status === '静止' ? '静止中' : '离线23小时',
        meta: DEFAULT_DEVICE.meta.replace(/离线|静止/g, status),
        latitude: saved.latitude ?? DEFAULT_DEVICE.latitude,
        longitude: saved.longitude ?? DEFAULT_DEVICE.longitude,
        address: saved.address || DEFAULT_DEVICE.address,
      }
      this.syncMapCenter()
      // TODO: 根据选中设备重新拉取定位详情
    },
    goSelectDevice() {
      uni.navigateTo({ url: '/pages/device/select' })
    },
    onMapLocated(pos) {
      this.myLocation = pos
      const meters = getDistanceMeters(
        pos.longitude,
        pos.latitude,
        this.device.longitude,
        this.device.latitude
      )
      this.device.distance = formatDistance(meters)
    },
    onFastLocate() {
      this.$refs.amapRef?.locateDevice?.()
      uni.$u.toast('已定位到设备')
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
  height: 60vh;
  overflow: hidden;
}

.map-amap {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.map-actions-left {
  position: absolute;
  left: 24rpx;
  top: calc(var(--status-bar-height) + 40rpx);
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  z-index: 2;
}

.map-refresh,
.map-switch {
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

.map-switch__text {
  font-size: 26rpx;
  color: #3dba6e;
  font-weight: 500;
}

.device-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  // #ifdef H5
  padding: 0 20rpx 120rpx;
  // #endif
  // #ifndef H5
  padding: 0 20rpx 20rpx;
  // #endif
  border-radius: 24rpx 24rpx 0 0;
  box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.08);
  z-index: 2;
  background: linear-gradient(180deg, #2db8a8, #fff);
}

.device-panel__banner {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 24rpx;
  position: relative;
}

.device-panel__banner-text {
  flex: 1;
  font-size: 30rpx;
  color: #fff;
  font-weight: 500;
  margin-left: 60rpx;
}

.banner-pin {
  position: absolute;
  flex-shrink: 0;
  width: 66rpx;
  height: 78rpx;
  top: -20rpx;
  left: 10rpx;
  z-index: 9;
}

.banner-pin__shadow {
  position: absolute;
  left: 50%;
  bottom: -10rpx;
  width: 28rpx;
  height: 8rpx;
  margin-left: -14rpx;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 50%;
}

.banner-pin__body {
  position: relative;
  width: 66rpx;
  height: 66rpx;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: linear-gradient(135deg, #5eb3ff, #2b7de9);
  box-shadow: 0 4rpx 10rpx rgba(67, 77, 90, 0.35);
}

.banner-pin__center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20rpx;
  height: 20rpx;
  margin: -10rpx 0 0 -10rpx;
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
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
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
  border: 2rpx solid #999;
  border-radius: 4rpx;
  padding: 2rpx;
  box-sizing: border-box;
}

.battery-icon__level {
  height: 100%;
  background: #3dba6e;
  border-radius: 2rpx;
  min-width: 0;
  min-width: 5rpx;
}

.battery-icon__head {
  width: 4rpx;
  height: 10rpx;
  background: #999;
  border-radius: 0 2rpx 2rpx 0;
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
