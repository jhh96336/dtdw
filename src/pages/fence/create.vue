<template>
  <view class="page">
    <up-navbar
      :title="navTitle"
      :bg-color="THEME_GREEN"
      title-color="#fff"
      left-icon="arrow-left"
      left-icon-color="#fff"
      :auto-back="true"
      :placeholder="true"
      :safe-area-inset-top="true"
    ></up-navbar>

    <!-- 围栏类型 Tab -->
    <view class="type-tabs">
      <view
        v-for="tab in fenceTypes"
        :key="tab.key"
        class="type-tabs__item"
        :class="{ 'type-tabs__item--active': fenceType === tab.key }"
        @click="fenceType = tab.key"
      >
        <text>{{ tab.label }}</text>
      </view>
    </view>

    <!-- 表单 -->
    <view class="form-panel">
      <view class="form-row">
        <text class="form-row__label">名称</text>
        <input
          v-model="form.name"
          class="form-row__input"
          placeholder="请输入围栏名称(必填)"
          placeholder-class="form-placeholder"
        />
      </view>

      <view class="form-row form-row--click" @click="showAlarmPicker = true">
        <text class="form-row__label">告警</text>
        <view class="form-row__right">
          <text class="form-row__value">{{ form.alarmLabel }}</text>
          <up-icon name="arrow-right" color="#ccc" size="14"></up-icon>
        </view>
      </view>

      <!-- 圆形：范围滑块 -->
      <view v-if="fenceType === 'circle'" class="form-row form-row--slider">
        <text class="form-row__label">范围</text>
        <view class="form-row__slider-wrap">
          <up-slider
            v-model="form.radius"
            :min="50"
            :max="5000"
            :step="50"
            :active-color="THEME_GREEN"
            inactive-color="#e8e8e8"
          ></up-slider>
          <text class="form-row__radius">{{ form.radius }} 米</text>
        </view>
      </view>

      <!-- 多边形：撤销/清除 -->
      <view v-if="fenceType === 'polygon'" class="form-row">
        <text class="form-row__label">修改</text>
        <view class="form-row__btns">
          <view class="mini-btn" @click="onUndo">撤销</view>
          <view class="mini-btn" @click="onClearPolygon">清除</view>
        </view>
      </view>

      <!-- 行政区：省/市 -->
      <view v-if="fenceType === 'district'" class="form-row form-row--click" @click="showRegionPicker = true">
        <text class="form-row__label">省/市</text>
        <view class="form-row__right">
          <text class="form-row__value" :class="{ 'form-placeholder': !form.region }">
            {{ form.region || '请选择省/市' }}
          </text>
          <up-icon name="arrow-right" color="#ccc" size="14"></up-icon>
        </view>
      </view>
    </view>

    <!-- 地图 -->
    <view class="map-area">
      <view class="map-bg">
        <view v-if="fenceType === 'circle'" class="fence-circle" :style="circleStyle"></view>
        <view v-if="fenceType === 'polygon'" class="fence-polygon-hint">
          <text>在地图上点击绘制多边形顶点</text>
        </view>
        <view class="map-marker">
          <up-icon name="car-fill" color="#3dba6e" size="32"></up-icon>
        </view>
      </view>
      <view class="map-zoom">
        <view class="map-zoom__btn" @click="zoomIn">+</view>
        <view class="map-zoom__btn" @click="zoomOut">−</view>
      </view>
    </view>

    <view class="footer-bar">
      <view class="footer-bar__btn" @click="onSave">
        <text>保存</text>
      </view>
    </view>

    <!-- 告警类型选择 -->
    <up-action-sheet
      :show="showAlarmPicker"
      :actions="alarmActions"
      title="选择告警类型"
      @close="showAlarmPicker = false"
      @select="onAlarmSelect"
    ></up-action-sheet>

    <!-- 省/市选择 -->
    <up-action-sheet
      :show="showRegionPicker"
      :actions="regionActions"
      title="选择省/市"
      @close="showRegionPicker = false"
      @select="onRegionSelect"
    ></up-action-sheet>
  </view>
</template>

<script>
import { THEME_GREEN } from '@/common/theme.js'

const ALARM_OPTIONS = [
  { name: '入围栏', value: 'in' },
  { name: '出围栏', value: 'out' },
  { name: '进入报警', value: 'enter' },
  { name: '离开报警', value: 'leave' },
]

const TYPE_LABELS = {
  circle: '圆形围栏',
  polygon: '多边形围栏',
  district: '行政区围栏',
}

export default {
  data() {
    return {
      THEME_GREEN,
      deviceId: '',
      editId: '',
      fenceType: 'circle',
      showAlarmPicker: false,
      showRegionPicker: false,
      mapScale: 1,
      fenceTypes: [
        { key: 'circle', label: '圆形围栏' },
        { key: 'polygon', label: '多边形围栏' },
        { key: 'district', label: '行政区围栏' },
      ],
      form: {
        name: '',
        alarm: 'in',
        alarmLabel: '入围栏',
        radius: 300,
        region: '',
      },
      alarmActions: ALARM_OPTIONS.map((o) => ({ name: o.name })),
      regionActions: [
        { name: '江西省/九江市' },
        { name: '江西省/南昌市' },
        { name: '广东省/深圳市' },
        { name: '浙江省/杭州市' },
      ],
    }
  },
  computed: {
    navTitle() {
      return this.deviceId || '创建围栏'
    },
    circleStyle() {
      const size = Math.min(280, 80 + this.form.radius / 8) * this.mapScale
      return {
        width: `${size}rpx`,
        height: `${size}rpx`,
      }
    },
  },
  onLoad(options) {
    if (options.deviceId) this.deviceId = options.deviceId
    if (options.id) {
      this.editId = options.id
      this.loadFence(options.id)
    }
  },
  methods: {
    loadFence(id) {
      const list = uni.getStorageSync(`fence_list_${this.deviceId}`) || []
      const item = list.find((f) => f.id === id)
      if (item) {
        this.fenceType = item.type || 'circle'
        this.form.name = item.name
        this.form.alarm = item.alarm
        this.form.alarmLabel = item.alarmLabel
        this.form.radius = item.radius || 300
        this.form.region = item.region || ''
      }
    },
    onAlarmSelect(e) {
      const opt = ALARM_OPTIONS.find((o) => o.name === e.name)
      if (opt) {
        this.form.alarm = opt.value
        this.form.alarmLabel = opt.name
      }
      this.showAlarmPicker = false
    },
    onRegionSelect(e) {
      this.form.region = e.name
      this.showRegionPicker = false
    },
    zoomIn() {
      if (this.mapScale < 1.4) this.mapScale += 0.1
    },
    zoomOut() {
      if (this.mapScale > 0.6) this.mapScale -= 0.1
    },
    onUndo() {
      uni.$u.toast('撤销')
    },
    onClearPolygon() {
      uni.$u.toast('已清除')
    },
    onSave() {
      if (!this.form.name.trim()) {
        uni.$u.toast('请输入围栏名称')
        return
      }
      if (this.fenceType === 'district' && !this.form.region) {
        uni.$u.toast('请选择省/市')
        return
      }

      const item = {
        id: this.editId || `fence_${Date.now()}`,
        name: this.form.name.trim(),
        type: this.fenceType,
        typeLabel: TYPE_LABELS[this.fenceType],
        alarm: this.form.alarm,
        alarmLabel: this.form.alarmLabel,
        radius: this.form.radius,
        region: this.form.region,
      }

      const cacheKey = `fence_list_${this.deviceId}`
      let list = uni.getStorageSync(cacheKey) || []
      if (!Array.isArray(list)) list = []

      if (this.editId) {
        const idx = list.findIndex((f) => f.id === this.editId)
        if (idx >= 0) list[idx] = item
        else list.unshift(item)
      } else {
        list.unshift(item)
      }

      uni.setStorageSync(cacheKey, list)
      uni.$u.toast('保存成功')
      setTimeout(() => uni.navigateBack(), 500)
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
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.type-tabs {
  display: flex;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;
}

.type-tabs__item {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.type-tabs__item--active {
  color: #3dba6e;
  font-weight: 600;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 80rpx;
    height: 6rpx;
    background: #3dba6e;
    border-radius: 3rpx;
  }
}

.form-panel {
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;
}

.form-row {
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid #f5f5f5;
  min-height: 48rpx;
}

.form-row--click {
  justify-content: space-between;
}

.form-row--slider {
  flex-direction: column;
  align-items: stretch;
  gap: 16rpx;
}

.form-row__label {
  font-size: 30rpx;
  color: #333;
  flex-shrink: 0;
  width: 120rpx;
}

.form-row__input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  text-align: right;
}

.form-placeholder {
  color: #ccc;
}

.form-row__right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8rpx;
}

.form-row__value {
  font-size: 28rpx;
  color: #333;
}

.form-row__slider-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
  width: 100%;
  padding-left: 120rpx;
  box-sizing: border-box;
}

.form-row__radius {
  font-size: 28rpx;
  color: #333;
  flex-shrink: 0;
  min-width: 100rpx;
  text-align: right;
}

.form-row__btns {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
}

.mini-btn {
  padding: 10rpx 28rpx;
  background: #3dba6e;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #fff;
}

.map-area {
  flex: 1;
  min-height: 420rpx;
  position: relative;
  overflow: hidden;
}

.map-bg {
  width: 100%;
  height: 100%;
  min-height: 420rpx;
  background: linear-gradient(180deg, #e8eef3 0%, #dfeef5 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fence-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(231, 76, 60, 0.25);
  border: 4rpx solid rgba(231, 76, 60, 0.6);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.fence-polygon-hint {
  position: absolute;
  bottom: 24rpx;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  padding: 12rpx 24rpx;
  border-radius: 8rpx;

  text {
    font-size: 24rpx;
    color: #fff;
  }
}

.map-marker {
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 4rpx 8rpx rgba(0, 0, 0, 0.2));
}

.map-zoom {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.map-zoom__btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: #333;
  border-bottom: 1rpx solid #eee;

  &:last-child {
    border-bottom: none;
  }
}

.footer-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16rpx 32rpx calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
  z-index: 10;
}

.footer-bar__btn {
  height: 88rpx;
  background: #3dba6e;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    font-size: 32rpx;
    color: #fff;
    font-weight: 500;
  }
}
</style>
