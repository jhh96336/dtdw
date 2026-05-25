<template>
  <view class="page">
    <up-navbar title="报表" :bg-color="THEME_GREEN" title-color="#fff" left-icon="arrow-left" left-icon-color="#fff"
      :auto-back="true" :placeholder="true" :safe-area-inset-top="true"></up-navbar>

    <!-- Tab -->
    <view class="report-tabs">
      <view v-for="tab in tabs" :key="tab.key" class="report-tabs__item"
        :class="{ 'report-tabs__item--active': activeTab === tab.key }" @click="activeTab = tab.key">
        <text>{{ tab.label }}</text>
      </view>
    </view>

    <!-- 日期切换 -->
    <view class="date-bar">
      <text class="date-bar__nav" @click="changeDay(-1)">前一天</text>
      <view class="date-bar__center" @click="onPickDate">
        <text class="date-bar__date">{{ currentDate }}</text>
        <up-icon name="arrow-down-fill" color="#3dba6e" size="12"></up-icon>
      </view>
      <text class="date-bar__nav" @click="changeDay(1)">后一天</text>
    </view>

    <scroll-view class="content" scroll-y>
      <!-- 行程报表 -->
      <template v-if="activeTab === 'trip' && hasReportData">
        <view v-for="(item, index) in tripList" :key="index" class="report-card" @click="onTripDetail(item)">
          <view class="report-card__body">
            <view class="report-row">
              <text class="report-row__label">开始时间</text>
              <text class="report-row__value">{{ item.startTime }}</text>
            </view>
            <view class="report-row">
              <text class="report-row__label">结束时间</text>
              <text class="report-row__value">{{ item.endTime }}</text>
            </view>
            <view class="report-row">
              <text class="report-row__label">时长</text>
              <text class="report-row__value">{{ item.duration }}</text>
            </view>
            <view class="report-row">
              <text class="report-row__label">起点</text>
              <text class="report-row__coord">{{ item.startPoint }}</text>
            </view>
            <view class="report-row">
              <text class="report-row__label">终点</text>
              <text class="report-row__coord">{{ item.endPoint }}</text>
            </view>
          </view>
          <up-icon name="arrow-right" color="#ddd" size="16"></up-icon>
        </view>
      </template>

      <!-- 停留报表 -->
      <template v-else-if="hasReportData">
        <view
          v-for="(item, index) in stayList"
          :key="index"
          class="report-card"
          @click="onStayDetail(item)"
        >
          <view class="report-card__body">
            <view class="report-row">
              <text class="report-row__label">停留时间</text>
              <text class="report-row__value">{{ item.stayTime }}</text>
            </view>
            <view class="report-row">
              <text class="report-row__label">开始时间</text>
              <text class="report-row__value">{{ item.startTime }}</text>
            </view>
            <view class="report-row">
              <text class="report-row__label">结束时间</text>
              <text class="report-row__value">{{ item.endTime }}</text>
            </view>
            <view class="report-row">
              <text class="report-row__label">地址</text>
              <text class="report-row__coord">{{ item.address }}</text>
            </view>
          </view>
          <up-icon name="arrow-right" color="#ddd" size="16"></up-icon>
        </view>
      </template>

      <view v-if="!hasReportData" class="empty-wrap">
        <up-empty mode="data" text="暂无报表数据"></up-empty>
      </view>

      <view v-else class="list-footer">
        <text>没有更多了</text>
      </view>
    </scroll-view>

    <!-- 日期选择弹窗 -->
    <up-calendar
      :show="showDatePicker"
      title="选择日期"
      mode="single"
      :default-date="currentDate"
      :min-date="calendarMinDate"
      :max-date="calendarMaxDate"
      :show-lunar="true"
      :show-mark="true"
      :month-switch="true"
      :month-num="12"
      color="#3dba6e"
      confirm-text="确认"
      :week-text="weekText"
      month-format="YYYY年 M月"
      round="16"
      :close-on-click-overlay="true"
      :formatter="dateFormatter"
      @confirm="onDateConfirm"
      @close="showDatePicker = false"
    ></up-calendar>
  </view>
</template>

<script>
import dayjs from 'dayjs'
import { THEME_GREEN } from '@/common/theme.js'

/** 演示用「今天」，与项目 mock 日期一致 */
const DEMO_TODAY = dayjs('2026-05-22')

export default {
  data() {
    return {
      THEME_GREEN,
      deviceId: '',
      activeTab: 'stay',
      showDatePicker: false,
      currentDay: dayjs('2026-05-22'),
      weekText: ['一', '二', '三', '四', '五', '六', '日'],
      calendarMinDate: '2026-01-01',
      calendarMaxDate: DEMO_TODAY.format('YYYY-MM-DD'),
      /** 有报表数据的日期（显示红点） */
      datesWithData: [],
      tabs: [
        { key: 'stay', label: '停留报表' },
        { key: 'trip', label: '行程报表' },
      ],
      tripList: [
        {
          startTime: '2026/05/19 22:39:49',
          endTime: '2026/05/19 23:11:48',
          duration: '31分59秒',
          startPoint: '116.108008,29.640436',
          endPoint: '115.976921,29.680545',
        },
        {
          startTime: '2026/05/19 18:12:03',
          endTime: '2026/05/19 18:45:20',
          duration: '33分17秒',
          startPoint: '116.052341,29.612008',
          endPoint: '116.108008,29.640436',
        },
        {
          startTime: '2026/05/19 09:05:11',
          endTime: '2026/05/19 09:52:36',
          duration: '47分25秒',
          startPoint: '115.976921,29.680545',
          endPoint: '116.052341,29.612008',
        },
      ],
      stayList: [
        {
          stayTime: '481.00分钟',
          startTime: '2026/05/19 23:11:48',
          endTime: '2026/05/20 07:13:46',
          address: '115.976921,29.680545',
        },
        {
          stayTime: '195.50分钟',
          startTime: '2026/05/19 14:20:00',
          endTime: '2026/05/19 17:35:22',
          address: '116.108008,29.640436',
        },
        {
          stayTime: '52.42分钟',
          startTime: '2026/05/19 08:00:15',
          endTime: '2026/05/19 08:52:40',
          address: '115.976921,29.680545',
        },
      ],
    }
  },
  computed: {
    currentDate() {
      return this.currentDay.format('YYYY-MM-DD')
    },
    hasReportData() {
      if (this.activeTab === 'trip') return this.tripList.length > 0
      return this.stayList.length > 0
    },
  },
  created() {
    this.initDatesWithData()
  },
  onLoad(options) {
    if (options.deviceId) this.deviceId = options.deviceId
    if (options.tab === 'stay') this.activeTab = 'stay'
    else if (options.tab === 'trip') this.activeTab = 'trip'
    this.loadReport()
  },
  methods: {
    initDatesWithData() {
      const list = []
      const month = dayjs('2026-05-01')
      const daysInMonth = month.daysInMonth()
      const noDotDays = [5, 16, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
      for (let d = 1; d <= daysInMonth; d++) {
        if (!noDotDays.includes(d) && d <= DEMO_TODAY.date()) {
          list.push(month.date(d).format('YYYY-MM-DD'))
        }
      }
      this.datesWithData = list
    },
    changeDay(delta) {
      const next = this.currentDay.add(delta, 'day')
      if (next.isAfter(DEMO_TODAY, 'day')) {
        uni.$u.toast('不能选择未来日期')
        return
      }
      this.currentDay = next
      this.loadReport()
    },
    onPickDate() {
      this.showDatePicker = true
    },
    dateFormatter(day) {
      const dateStr = dayjs(day.date).format('YYYY-MM-DD')
      if (this.datesWithData.includes(dateStr)) {
        day.dot = true
      }
      if (dayjs(dateStr).isSame(DEMO_TODAY, 'day')) {
        day.bottomInfo = '今天'
      }
      return day
    },
    onDateConfirm(selected) {
      let raw = selected
      if (Array.isArray(selected) && selected.length) {
        raw = selected[0]
      }
      const d = dayjs(raw?.date ?? raw)
      if (d.isValid()) {
        this.currentDay = d
        this.loadReport()
      }
      this.showDatePicker = false
    },
    loadReport() {
      // TODO: 对接报表接口，按 currentDate / activeTab / deviceId 查询
      // 演示：仅 2026-05-19、05-22 有列表数据，其余日期显示空状态
      const d = this.currentDate
      const hasData = d === '2026-05-19' || d === '2026-05-22'
      if (!hasData) {
        this.tripList = []
        this.stayList = []
      } else if (d === '2026-05-22' && this.activeTab === 'stay') {
        this.stayList = [
          {
            stayTime: '481.00分钟',
            startTime: '2026/05/19 23:11:48',
            endTime: '2026/05/20 07:13:46',
            address: '115.976921,29.680545',
          },
        ]
      } else if (d === '2026-05-19') {
        // 恢复默认 mock
        this.resetMockData()
      }
    },
    resetMockData() {
      this.tripList = [
        {
          startTime: '2026/05/19 22:39:49',
          endTime: '2026/05/19 23:11:48',
          duration: '31分59秒',
          startPoint: '116.108008,29.640436',
          endPoint: '115.976921,29.680545',
        },
        {
          startTime: '2026/05/19 18:12:03',
          endTime: '2026/05/19 18:45:20',
          duration: '33分17秒',
          startPoint: '116.052341,29.612008',
          endPoint: '116.108008,29.640436',
        },
        {
          startTime: '2026/05/19 09:05:11',
          endTime: '2026/05/19 09:52:36',
          duration: '47分25秒',
          startPoint: '115.976921,29.680545',
          endPoint: '116.052341,29.612008',
        },
      ]
      this.stayList = [
        {
          stayTime: '481.00分钟',
          startTime: '2026/05/19 23:11:48',
          endTime: '2026/05/20 07:13:46',
          address: '115.976921,29.680545',
        },
        {
          stayTime: '195.50分钟',
          startTime: '2026/05/19 14:20:00',
          endTime: '2026/05/19 17:35:22',
          address: '116.108008,29.640436',
        },
        {
          stayTime: '52.42分钟',
          startTime: '2026/05/19 08:00:15',
          endTime: '2026/05/19 08:52:40',
          address: '115.976921,29.680545',
        },
      ]
    },
    onTripDetail(item) {
      uni.$u.toast('行程详情')
    },
    onStayDetail(item) {
      uni.$u.toast('停留详情')
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

.report-tabs {
  display: flex;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;
}

.report-tabs__item {
  flex: 1;
  text-align: center;
  padding: 28rpx 0;
  font-size: 30rpx;
  color: #999;
  position: relative;
}

.report-tabs__item--active {
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

.date-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  background: #f8f8f8;
  flex-shrink: 0;
}

.date-bar__nav {
  font-size: 28rpx;
  color: #3dba6e;
}

.date-bar__center {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.date-bar__date {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.content {
  flex: 1;
  height: 0;
  padding: 24rpx;
  box-sizing: border-box;
}

.report-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12rpx;
  padding: 28rpx 24rpx;
  margin-bottom: 20rpx;
}

.report-card__body {
  flex: 1;
  min-width: 0;
}

.report-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12rpx;
  font-size: 28rpx;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
}

.report-row__label {
  color: #666;
  flex-shrink: 0;
  width: 150rpx;
}

.report-row__value {
  color: #222;
  flex: 1;
}

.report-row__coord {
  color: #3dba6e;
  flex: 1;
  word-break: break-all;
}

.empty-wrap {
  padding: 120rpx 0 80rpx;
}

.list-footer {
  text-align: center;
  padding: 32rpx 0 48rpx;
  font-size: 26rpx;
  color: #ccc;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 120rpx;
    height: 2rpx;
    background: #e8e8e8;
    margin: 16rpx auto 0;
  }
}
</style>
