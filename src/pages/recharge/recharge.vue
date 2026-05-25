<template>
  <view class="page">
    <up-navbar
      title="充值"
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
        <text class="section__title">基础套餐 到账后生效</text>
        <view
          v-for="(plan, index) in plans"
          :key="plan.key"
          class="plan-card"
          :class="{ 'plan-card--active': selectedIndex === index }"
          @click="selectedIndex = index"
        >
          <text class="plan-card__name">{{ plan.name }}</text>
          <text class="plan-card__price">¥{{ plan.price }}</text>
        </view>
      </view>

      <view class="section section--pay">
        <text class="section__title">支付方式</text>
        <view class="pay-row">
          <view class="pay-row__left">
            <view class="pay-wechat">
              <up-icon name="weixin-fill" color="#fff" size="22"></up-icon>
            </view>
            <text>微信支付</text>
          </view>
          <up-icon name="checkmark-circle-fill" color="#3dba6e" size="22"></up-icon>
        </view>
      </view>

      <view class="action-btn" @click="onRecharge">
        <text>充值</text>
      </view>

      <view class="tips">
        <text class="tips__title">充值提示:</text>
        <text
          v-for="(tip, i) in rechargeTips"
          :key="i"
          class="tips__item"
        >{{ i + 1 }}. {{ tip }}</text>
        <view class="service-link">
          <text>对订单有任何疑问，请联系</text>
          <text class="service-link__btn" @click="onService">在线客服</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { THEME_GREEN } from '@/common/theme.js'

export default {
  data() {
    return {
      THEME_GREEN,
      iccid: '',
      deviceId: '',
      selectedIndex: 0,
      plans: [
        { key: 'one', name: '一年基础费', price: 58 },
        { key: 'two', name: '两年基础费', price: 88 },
        { key: 'three', name: '三年基础费', price: 118 },
        { key: 'lifetime', name: '终身基础费', price: 208 },
      ],
      rechargeTips: [
        '订购随后生效，不限订购次数，主套餐到期流量清零',
        '充值成功过后，正常30分钟生效，月初或者月底可能会更久。如没恢复联系在线客服',
        '此为虚拟产品，一经售出概不退款',
      ],
    }
  },
  computed: {
    selectedPlan() {
      return this.plans[this.selectedIndex]
    },
  },
  onLoad(options) {
    if (options.iccid) this.iccid = options.iccid
    if (options.deviceId) this.deviceId = options.deviceId
  },
  methods: {
    onRecharge() {
      const plan = this.selectedPlan
      uni.showModal({
        title: '确认充值',
        content: `支付 ¥${plan.price} 购买「${plan.name}」？`,
        success: (res) => {
          if (res.confirm) {
            uni.$u.toast('支付功能对接中')
          }
        },
      })
    },
    onService() {
      uni.$u.toast('在线客服')
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

.content {
  flex: 1;
  height: 0;
  padding: 24rpx 32rpx calc(32rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.section {
  margin-bottom: 32rpx;
}

.section--pay {
  border-top: 1rpx solid #f0f0f0;
  border-bottom: 1rpx solid #f0f0f0;
  padding: 24rpx 0;
  margin-bottom: 40rpx;
}

.section__title {
  font-size: 30rpx;
  font-weight: 600;
  color: #222;
  display: block;
  margin-bottom: 24rpx;
}

.plan-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  margin-bottom: 20rpx;
  border: 2rpx solid #b8e6c8;
  border-radius: 12rpx;
  background: #fff;
}

.plan-card--active {
  border-color: #3dba6e;
  background: #f6fcf8;
}

.plan-card__name {
  font-size: 30rpx;
  color: #333;
}

.plan-card__price {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.pay-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pay-row__left {
  display: flex;
  align-items: center;
  gap: 16rpx;
  font-size: 28rpx;
  color: #333;
}

.pay-wechat {
  width: 48rpx;
  height: 48rpx;
  border-radius: 8rpx;
  background: #07c160;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn {
  height: 88rpx;
  background: #3dba6e;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;

  text {
    font-size: 32rpx;
    color: #fff;
    font-weight: 500;
  }
}

.tips__title {
  font-size: 28rpx;
  color: #e74c3c;
  font-weight: 600;
  display: block;
  margin-bottom: 16rpx;
}

.tips__item {
  display: block;
  font-size: 24rpx;
  color: #666;
  line-height: 1.7;
  margin-bottom: 12rpx;
}

.service-link {
  margin-top: 24rpx;
  font-size: 26rpx;
  color: #999;
  text-align: center;
}

.service-link__btn {
  color: #3dba6e;
  margin-left: 8rpx;
}
</style>
