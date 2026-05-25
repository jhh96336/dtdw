<template>
  <view class="page">
    <view class="header">
      <view class="header__curve"></view>
      <view class="logo-wrap">
        <view class="logo-box">
          <view class="logo-pin">
            <view class="logo-pin__dot"></view>
          </view>
          <text class="logo-box__c">C</text>
        </view>
      </view>
    </view>

    <view class="body">
      <view class="form">
        <view class="form-line">
          <input v-model="phone" class="form-line__input" type="number" maxlength="11" placeholder="手机号"
            placeholder-class="form-line__placeholder" />
        </view>
        <view class="form-line">
          <input v-model="password" class="form-line__input" type="password" password placeholder="密码"
            placeholder-class="form-line__placeholder" />
        </view>

        <view class="agreement" @click="agreed = !agreed">
          <view class="agreement__check" :class="{ 'agreement__check--on': agreed }">
            <up-icon v-if="agreed" name="checkmark" color="#fff" size="12"></up-icon>
          </view>
          <view class="agreement__text">
            <text class="agreement__plain">我已阅读并同意</text>
            <text class="agreement__link" @click.stop="goProtocol('service')">《用户服务协议》</text>
            <text class="agreement__plain">和</text>
            <text class="agreement__link" @click.stop="goProtocol('privacy')">《隐私政策》</text>
          </view>
        </view>

        <view class="submit-btn" @click="onLogin">
          <text>登录</text>
        </view>

        <view class="links">
          <text class="links__item" @click="goRegister">注册</text>
          <text class="links__sep">|</text>
          <text class="links__item" @click="goForgot">忘记密码</text>
        </view>
      </view>

      <view class="wechat-wrap">
        <view class="wechat-btn" @click="onWechatLogin">
          <up-icon name="weixin-fill" color="#fff" size="32"></up-icon>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      phone: '',
      password: '',
      agreed: true,
    }
  },
  methods: {
    goProtocol(type) {
      uni.navigateTo({
        url: `/pages/mine/privacy?type=${type}`,
      })
    },
    goRegister() {
      uni.navigateTo({ url: '/pages/user/register' })
    },
    goForgot() {
      uni.navigateTo({ url: '/pages/user/forgot-password' })
    },
    onLogin() {
      if (!/^1\d{10}$/.test(this.phone)) {
        uni.$u.toast('请输入正确手机号')
        return
      }
      if (!this.password.trim()) {
        uni.$u.toast('请输入密码')
        return
      }
      if (!this.agreed) {
        uni.$u.toast('请先阅读并同意相关协议')
        return
      }
      // TODO: 对接登录接口
      uni.setStorageSync('token', 'mock-token')
      uni.setStorageSync('userPhone', this.phone)
      uni.switchTab({ url: '/pages/location/location' })
    },
    onWechatLogin() {
      uni.$u.toast('微信登录开发中')
    },
  },
}
</script>

<style lang="scss" scoped>
$page-green: #3dba6e;

.page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.header {
  position: relative;
  height: 420rpx;
  background: $page-green;
  padding-top: env(safe-area-inset-top);
  overflow: hidden;
}

.header__curve {
  position: absolute;
  left: -20%;
  right: -20%;
  bottom: -80rpx;
  height: 160rpx;
  background: $page-green;
  border-radius: 0 0 50% 50%;
}

.logo-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  padding-top: 100rpx;
}

.logo-box {
  width: 160rpx;
  height: 160rpx;
  border-radius: 36rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
}

.logo-pin {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-pin__dot {
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
  background: $page-green;
  transform: rotate(45deg);
}

.logo-box__c {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 48rpx 48rpx 0;
}

.form {
  flex: 1;
}

.form-line {
  border-bottom: 2rpx solid #eee;
  margin-bottom: 8rpx;
}

.form-line__input {
  width: 100%;
  height: 96rpx;
  font-size: 32rpx;
  color: #333;
}

.form-line__placeholder {
  color: #ccc;
  font-size: 32rpx;
}

.agreement {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  margin-top: 32rpx;
}

.agreement__check {
  flex-shrink: 0;
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #ddd;
  border-radius: 6rpx;
  margin-top: 4rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &--on {
    background: $page-green;
    border-color: $page-green;
  }
}

.agreement__text {
  flex: 1;
  font-size: 24rpx;
  line-height: 1.6;
}

.agreement__plain {
  color: #666;
}

.agreement__link {
  color: $page-green;
}

.submit-btn {
  margin-top: 48rpx;
  height: 88rpx;
  background: $page-green;
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

.links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-top: 32rpx;
}

.links__item {
  font-size: 28rpx;
  color: $page-green;
}

.links__sep {
  font-size: 28rpx;
  color: $page-green;
}

.wechat-wrap {
  padding: 48rpx 0 calc(48rpx + env(safe-area-inset-bottom));
  display: flex;
  justify-content: center;
}

.wechat-btn {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: $page-green;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
