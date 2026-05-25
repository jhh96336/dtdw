<template>
  <view class="page">
    <up-navbar title="设备信息" :bg-color="THEME_GREEN" title-color="#fff" left-icon="arrow-left" left-icon-color="#fff"
      :auto-back="true" :placeholder="true" :safe-area-inset-top="true"></up-navbar>

    <scroll-view class="content" scroll-y>
      <view class="form-list">
        <view class="form-row">
          <text class="form-row__label">设备名称</text>
          <input v-model="form.deviceName" class="form-row__input" type="text" placeholder="请输入设备名称" />
        </view>

        <view class="form-row">
          <text class="form-row__label">设备号</text>
          <view class="form-row__value-container">
            <text class="form-row__value">{{ form.deviceNo }}</text>
            <view class="form-row__copy" @click="onCopy(form.deviceNo, '设备号')">复制</view>
          </view>
        </view>

        <view class="form-row">
          <text class="form-row__label">设备型号</text>
          <text class="form-row__value">{{ form.model }}</text>
        </view>

        <view class="form-row">
          <text class="form-row__label">设备状态</text>
          <text class="form-row__value">{{ form.status }}</text>
        </view>

        <view class="form-row">
          <text class="form-row__label">定位时间</text>
          <text class="form-row__value">{{ form.locateTime }}</text>
        </view>

        <view class="form-row">
          <text class="form-row__label">SIM卡号</text>
          <text class="form-row__value">{{ form.simNo }}</text>
        </view>

        <view class="form-row">
          <text class="form-row__label">ICCID号</text>
          <view class="form-row__value-container">
            <text class="form-row__value">{{ form.iccid }}</text>
            <view class="form-row__copy" @click="onCopy(form.iccid, 'ICCID号')">复制</view>
          </view>
        </view>

        <view class="form-row">
          <text class="form-row__label">联系人</text>
          <input v-model="form.contact" class="form-row__input" type="text" placeholder="请输入联系人" />
        </view>

        <view class="form-row">
          <text class="form-row__label">联系人电话</text>
          <input v-model="form.contactPhone" class="form-row__input" type="number" placeholder="请输入联系人电话" />
        </view>

        <view class="form-row form-row--top">
          <text class="form-row__label">定位</text>
          <text class="form-row__value form-row__value--multi">{{ form.address }}</text>
        </view>

        <view class="form-row">
          <text class="form-row__label">经纬度</text>
          <view class="form-row__value-container">
            <text class="form-row__value">{{ form.coordinate }}</text>
            <view class="form-row__copy" @click="onCopy(form.coordinate, '经纬度')">复制</view>
          </view>
        </view>

        <view class="form-row" @click="onPickIcon">
          <text class="form-row__label">设备图标</text>
          <view class="form-row__icon">
            <image :src="carImg" mode="widthFix" class="device-icon"></image>
            <text class="form-row__value">{{ form.iconLabel }}</text>
            <!-- <up-icon name="arrow-right" color="#ccc" size="14"></up-icon> -->
          </view>
        </view>

        <view class="form-row form-row--last">
          <text class="form-row__label">LBS</text>
          <view class="form-row__value-container">
            <view></view>
            <up-switch v-model="form.lbsOn" :active-color="THEME_GREEN" size="22"></up-switch>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="footer-bar">
      <view class="footer-bar__btn" @click="onSave">
        <text>保存</text>
      </view>
    </view>
  </view>
</template>

<script>
import { THEME_GREEN } from '@/common/theme.js'
import { staticUrl } from '@/common/assets.js'
const DEFAULT_ICCID = '89860840102490118041'

export default {
  data() {
    return {
      THEME_GREEN,
      carImg: staticUrl('/static/car.png'),
      form: {
        deviceName: '15070055007',
        deviceNo: '15070005007',
        model: 'JSK1',
        status: '离线',
        locateTime: '2026/05/21 17:47:18',
        simNo: '-',
        iccid: DEFAULT_ICCID,
        contact: '',
        contactPhone: '',
        address: '江西省九江市濂溪区前进西路靠近安泰汽车检测',
        coordinate: '115.976879,29.680463',
        iconLabel: '默认',
        lbsOn: true,
      },
    }
  },
  onLoad(options) {
    if (options.deviceId) {
      this.form.deviceNo = options.deviceId
      this.form.deviceName = options.deviceId
    }
    if (options.updateTime) {
      this.form.locateTime = decodeURIComponent(options.updateTime)
    }
    this.loadSaved()
  },
  methods: {
    storageKey() {
      return `device_info_${this.form.deviceNo}`
    },
    loadSaved() {
      const saved = uni.getStorageSync(this.storageKey())
      if (!saved || typeof saved !== 'object') return
      if (saved.deviceName) this.form.deviceName = saved.deviceName
      if (saved.contact !== undefined) this.form.contact = saved.contact
      if (saved.contactPhone !== undefined) this.form.contactPhone = saved.contactPhone
      if (saved.lbsOn !== undefined) this.form.lbsOn = saved.lbsOn
      if (saved.iconLabel) this.form.iconLabel = saved.iconLabel
    },
    onCopy(text, label) {
      if (!text || text === '-') {
        uni.$u.toast('暂无内容')
        return
      }
      uni.setClipboardData({
        data: String(text),
        success: () => {
          uni.$u.toast(`${label}已复制`)
        },
      })
    },
    onPickIcon() {
      uni.$u.toast('设备图标')
    },
    onSave() {
      if (!this.form.deviceName.trim()) {
        uni.$u.toast('请输入设备名称')
        return
      }
      const payload = {
        deviceName: this.form.deviceName.trim(),
        contact: this.form.contact.trim(),
        contactPhone: this.form.contactPhone.trim(),
        lbsOn: this.form.lbsOn,
        iconLabel: this.form.iconLabel,
      }
      uni.setStorageSync(this.storageKey(), payload)
      // TODO: 对接设备信息保存接口
      uni.$u.toast('保存成功')
      setTimeout(() => uni.navigateBack(), 400)
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

.content {
  flex: 1;
  height: 0;
}

.form-list {
  background: #fff;
}

.form-row {
  display: flex;
  align-items: center;
  padding: 20rpx 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  gap: 16rpx;
}

.form-row--top {
  align-items: flex-start;
}

.form-row--last {
  border-bottom: none;
}

.form-row__label {
  width: 180rpx;
  flex-shrink: 0;
  font-size: 28rpx;
  color: #333;
}

.form-row__value-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-row__value {
  font-size: 28rpx;
  color: #666;
}

.form-row__value--multi {
  line-height: 1.6;
  text-align: left;
}

.form-row__value--ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.form-row__input {
  flex: 1;
  min-width: 0;
  font-size: 28rpx;
  color: #333;
}

.form-row__copy {
  flex-shrink: 0;
  padding: 4rpx 20rpx;
  border: 2rpx solid #3dba6e;
  border-radius: 8rpx;
  color: #3dba6e;
  font-size: 24rpx;
}

.form-row__icon {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12rpx;
  image{
    width: 60rpx;
  }
}

.device-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24rpx 32rpx calc(24rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
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
