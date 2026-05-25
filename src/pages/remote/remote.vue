<template>
  <view class="page">
    <up-navbar
      title="远程设置"
      :bg-color="THEME_GREEN"
      title-color="#fff"
      left-icon="arrow-left"
      left-icon-color="#fff"
      :auto-back="true"
      :placeholder="true"
      :safe-area-inset-top="true"
    ></up-navbar>

    <view class="tabs">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tabs__item"
        :class="{ 'tabs__item--active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <text>{{ tab.label }}</text>
      </view>
    </view>

    <scroll-view class="content" scroll-y>
      <!-- 远程设置 -->
      <template v-if="activeTab === 'settings'">
        <view
          v-for="item in settingsList"
          :key="item.key"
          class="setting-card"
          @click="onSettingClick(item)"
        >
          <view class="setting-card__main">
            <view class="setting-card__head">
              <text class="setting-card__title">{{ item.title }}</text>
              <text v-if="item.status" class="setting-card__status">{{ item.status }}</text>
            </view>
            <text class="setting-card__desc">{{ item.desc }}</text>
          </view>
          <up-icon name="arrow-right" color="#ccc" size="16"></up-icon>
        </view>
      </template>

      <!-- 操作记录 -->
      <template v-else>
        <view
          v-for="(record, index) in recordList"
          :key="index"
          class="record-card"
        >
          <text class="record-card__title">{{ record.title }} ({{ deviceId }})</text>
          <text class="record-card__status">{{ record.status }}</text>
          <text class="record-card__time">{{ record.time }}</text>
          <text v-if="record.response" class="record-card__response">{{ record.response }}</text>
        </view>
        <view v-if="!recordList.length" class="empty-wrap">
          <up-empty mode="list" text="暂无操作记录"></up-empty>
        </view>
      </template>
    </scroll-view>
  </view>
</template>

<script>
import { THEME_GREEN } from '@/common/theme.js'

export default {
  data() {
    return {
      THEME_GREEN,
      deviceId: '15070005007',
      activeTab: 'settings',
      tabs: [
        { key: 'settings', label: '远程设置' },
        { key: 'records', label: '操作记录' },
      ],
      settingsList: [
        {
          key: 'locate',
          title: '立即定位',
          desc: '立即刷新定位，上传当前设备定位点',
        },
        {
          key: 'arm',
          title: '远程设防',
          desc: '需开启震动报警，应提前打开远程设防',
        },
        {
          key: 'vibration',
          title: '震动告警',
          status: '已开启',
          desc: '默认打开，终端进入设防状态后，若车辆连续产生震动将会触发震动报警',
        },
        {
          key: 'tamper',
          title: '防拆告警',
          status: '已开启',
          desc: '开启后，设备被拆除后将会触发防拆报警',
        },
        {
          key: 'lowBattery',
          title: '低电告警',
          status: '已开启',
          desc: '开启后，设备内置电池电压过低时将会触发低电报警，且推送到平台',
        },
        {
          key: 'overspeed',
          title: '超速告警',
          status: '已关闭',
          desc: '开启后，当车辆在[持续时间]内的行驶速度大于设置的超速速度时，设备发出超速报警',
        },
        {
          key: 'customCmd',
          title: '自定义指令',
          desc: '自定义指令用于出厂检测，售后测试',
        },
        {
          key: 'reboot',
          title: '设备重启',
          desc: '远程重启设备',
        },
        {
          key: 'factoryReset',
          title: '恢复出厂',
          desc: '恢复出厂到默认状态，如定位设置变更为普通模式、关闭微震动感应、求救，清空sos联系人等，同时清除平台已保存的参数设备',
        },
      ],
      recordList: [
        {
          title: '立即定位',
          status: '命令延迟下发',
          time: '2026/05/22 15:55:30',
        },
        {
          title: '立即定位',
          status: '命令延迟下发',
          time: '2026/05/22 15:27:12',
        },
        {
          title: '参数设置',
          status: '设备未应答',
          time: '2026/05/21 17:51:00',
        },
        {
          title: '恢复出厂设置',
          status: '执行成功',
          time: '2026/05/19 11:58:07',
          response:
            '指令响应内容：{clientId=15070005007, responseMessageId=33536, verified=true, resultCode=0, messageId=1, protocolVersion=0, packageTotal=null, packageNo=null, properties=5, responseSerialNo=118, serialNo=119}',
        },
      ],
    }
  },
  onLoad(options) {
    if (options.deviceId) {
      this.deviceId = options.deviceId
    }
    if (options.tab === 'records') {
      this.activeTab = 'records'
    }
  },
  methods: {
    onSettingClick(item) {
      const dangerKeys = ['reboot', 'factoryReset', 'arm']
      if (dangerKeys.includes(item.key)) {
        uni.showModal({
          title: '提示',
          content: `确定要执行「${item.title}」吗？`,
          confirmColor: '#3dba6e',
          success: (res) => {
            if (res.confirm) {
              this.sendCommand(item)
            }
          },
        })
        return
      }
      if (['vibration', 'tamper', 'lowBattery', 'overspeed'].includes(item.key)) {
        uni.$u.toast(`${item.title}设置`)
        return
      }
      if (item.key === 'customCmd') {
        uni.$u.toast('自定义指令')
        return
      }
      this.sendCommand(item)
    },
    sendCommand(item) {
      // TODO: 对接远程指令接口
      uni.$u.toast(`已发送：${item.title}`)
      this.prependRecord(item.title, '命令延迟下发')
    },
    prependRecord(title, status) {
      const now = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      const time = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
      this.recordList.unshift({ title, status, time })
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.tabs {
  display: flex;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;
  flex-shrink: 0;
}

.tabs__item {
  flex: 1;
  text-align: center;
  padding: 28rpx 0;
  font-size: 30rpx;
  color: #999;
  position: relative;
}

.tabs__item--active {
  color: #222;
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

.content {
  flex: 1;
  height: 0;
  padding: 24rpx;
  box-sizing: border-box;
}

.setting-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12rpx;
  padding: 28rpx 24rpx;
  margin-bottom: 20rpx;
  gap: 16rpx;
}

.setting-card__main {
  flex: 1;
  min-width: 0;
}

.setting-card__head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.setting-card__title {
  font-size: 32rpx;
  font-weight: 600;
  color: #222;
}

.setting-card__status {
  font-size: 26rpx;
  color: #999;
}

.setting-card__desc {
  font-size: 26rpx;
  color: #999;
  line-height: 1.6;
  display: block;
}

.record-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 28rpx 24rpx;
  margin-bottom: 20rpx;
}

.record-card__title {
  font-size: 32rpx;
  font-weight: 600;
  color: #222;
  display: block;
  margin-bottom: 12rpx;
}

.record-card__status,
.record-card__time {
  font-size: 26rpx;
  color: #999;
  display: block;
  line-height: 1.6;
}

.record-card__response {
  font-size: 24rpx;
  color: #999;
  line-height: 1.5;
  display: block;
  margin-top: 12rpx;
  word-break: break-all;
}

.empty-wrap {
  padding: 80rpx 0;
}
</style>
