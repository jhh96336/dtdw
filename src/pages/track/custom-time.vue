<template>
  <view class="page">
    <up-navbar
      title="自定义时间"
      :bg-color="THEME_GREEN"
      title-color="#fff"
      left-icon="arrow-left"
      left-icon-color="#fff"
      :auto-back="true"
      :placeholder="true"
      :safe-area-inset-top="true"
    ></up-navbar>

    <scroll-view class="content" scroll-y>
      <view class="section">
        <text class="section__title">基础选择</text>
        <view class="section__card section__card--range">
          <view class="range-col" @click="openPicker('start')">
            <text class="range-col__label">开始时间：</text>
            <text class="range-col__value">{{ startTime }}</text>
          </view>
          <view class="range-col" @click="openPicker('end')">
            <text class="range-col__label">结束时间：</text>
            <text class="range-col__value">{{ endTime }}</text>
          </view>
        </view>
      </view>

      <view class="section">
        <text class="section__title">快速选择</text>
        <view class="section__card section__card--row" @click="onQuickPick">
          <text class="row-link__text">选择指定时间</text>
          <up-icon name="arrow-right" color="#ccc" size="16"></up-icon>
        </view>
      </view>
    </scroll-view>  

    <view class="footer-bar">
      <view class="footer-bar__btn" @click="onSave">
        <text>保存</text>
      </view>
    </view>

    <!-- 选择指定时间：日期范围 -->
    <up-calendar
      :show="showRangeCalendar"
      title="选择日期"
      mode="range"
      :default-date="calendarDefaultDate"
      :min-date="calendarMinDate"
      :max-date="calendarMaxDate"
      start-text="开始"
      end-text="结束"
      :allow-same-day="true"
      :month-switch="true"
      :month-num="12"
      color="#3dba6e"
      confirm-text="确认"
      :week-text="weekText"
      month-format="YYYY年 M月"
      round="16"
      :close-on-click-overlay="true"
      @confirm="onRangeConfirm"
      @close="showRangeCalendar = false"
    ></up-calendar>

    <up-datetime-picker
      :show="showDateTimePicker"
      v-model="pickerValue"
      mode="datetime"
      :min-date="minDate"
      :max-date="maxDate"
      color="#3dba6e"
      confirm-text="确定"
      @confirm="onPickerConfirm"
      @cancel="showDateTimePicker = false"
      @close="showDateTimePicker = false"
    ></up-datetime-picker>
  </view>
</template>

<script>
import dayjs from 'dayjs'
import { THEME_GREEN } from '@/common/theme.js'

const DEMO_TODAY = dayjs('2026-05-22')

export default {
  data() {
    return {
      THEME_GREEN,
      deviceId: '',
      startTime: '2026-05-22 00:00:00',
      endTime: '2026-05-22 23:59:59',
      pickTarget: 'start',
      showRangeCalendar: false,
      showDateTimePicker: false,
      pickerValue: Date.now(),
      minDate: dayjs('2020-01-01').valueOf(),
      maxDate: DEMO_TODAY.endOf('day').valueOf(),
      weekText: ['一', '二', '三', '四', '五', '六', '日'],
      calendarMinDate: '2020-01-01',
      calendarMaxDate: DEMO_TODAY.format('YYYY-MM-DD'),
    }
  },
  computed: {
    calendarDefaultDate() {
      const start = dayjs((this.startTime || '').split(' ')[0])
      const end = dayjs((this.endTime || '').split(' ')[0])
      if (!start.isValid() || !end.isValid()) return []
      const arr = []
      let cur = start
      while (!cur.isAfter(end, 'day')) {
        arr.push(cur.format('YYYY-MM-DD'))
        cur = cur.add(1, 'day')
      }
      return arr
    },
  },
  onLoad(options) {
    if (options.deviceId) this.deviceId = options.deviceId
    if (options.startTime) {
      this.startTime = decodeURIComponent(options.startTime)
    }
    if (options.endTime) {
      this.endTime = decodeURIComponent(options.endTime)
    }

    const channel = this.getOpenerEventChannel?.()
    if (channel) {
      channel.on('init', (data) => {
        if (data.startTime) this.startTime = data.startTime
        if (data.endTime) this.endTime = data.endTime
      })
    }
  },
  methods: {
    onQuickPick() {
      this.showRangeCalendar = true
    },
    onRangeConfirm(selected) {
      if (!Array.isArray(selected) || selected.length < 1) {
        this.showRangeCalendar = false
        return
      }
      const parseDate = (item) => {
        const raw = item?.date ?? item
        return dayjs(raw)
      }
      const start = parseDate(selected[0])
      const end = parseDate(selected[selected.length - 1])
      if (!start.isValid() || !end.isValid()) {
        this.showRangeCalendar = false
        return
      }
      this.startTime = start.format('YYYY-MM-DD 00:00:00')
      this.endTime = end.format('YYYY-MM-DD 23:59:59')
      this.showRangeCalendar = false
    },
    openPicker(target) {
      this.pickTarget = target
      const str = target === 'start' ? this.startTime : this.endTime
      const ts = dayjs(str.replace(/\//g, '-')).valueOf()
      this.pickerValue = ts || Date.now()
      this.showDateTimePicker = true
    },
    onPickerConfirm(e) {
      const formatted = dayjs(e.value).format('YYYY-MM-DD HH:mm:ss')
      if (this.pickTarget === 'start') {
        this.startTime = formatted
      } else {
        this.endTime = formatted
      }
      this.showDateTimePicker = false
    },
    onSave() {
      const start = dayjs(this.startTime.replace(/\//g, '-'))
      const end = dayjs(this.endTime.replace(/\//g, '-'))
      if (!start.isValid() || !end.isValid()) {
        uni.$u.toast('时间格式有误')
        return
      }
      if (end.isBefore(start)) {
        uni.$u.toast('结束时间不能早于开始时间')
        return
      }

      const channel = this.getOpenerEventChannel?.()
      if (channel) {
        channel.emit('save', {
          startTime: this.startTime,
          endTime: this.endTime,
        })
      } else {
        uni.setStorageSync('track_custom_time', {
          startTime: this.startTime,
          endTime: this.endTime,
        })
      }
      uni.$u.toast('已保存')
      setTimeout(() => uni.navigateBack(), 300)
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
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.content {
  flex: 1;
  height: 0;
  padding: 24rpx;
  box-sizing: border-box;
}

.section {
  margin-bottom: 32rpx;
}

.section__title {
  font-size: 26rpx;
  color: #999;
  display: block;
  margin-bottom: 16rpx;
  padding-left: 8rpx;
}

.section__card {
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.section__card--range {
  display: flex;
  padding: 28rpx 24rpx;
  gap: 16rpx;
}

.range-col {
  flex: 1;
  min-width: 0;
}

.range-col__label {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 12rpx;
}

.range-col__value {
  font-size: 24rpx;
  color: #222;
  line-height: 1.5;
  word-break: break-all;
}

.section__card--row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 28rpx;
}

.row-link__text {
  font-size: 30rpx;
  color: #333;
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
