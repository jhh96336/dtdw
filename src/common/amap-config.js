/**
 * 高德地图配置（Web 端 Key / 安全密钥请在 .env 中配置）
 * 申请地址：https://console.amap.com/dev/key/app
 * Key 类型须为「Web端(JS API)」，Referer 白名单示例：http://127.0.0.1:5174
 */
export const AMAP_KEY = (import.meta.env.VITE_AMAP_KEY || '').trim()
export const AMAP_SECURITY_CODE = (import.meta.env.VITE_AMAP_SECURITY_CODE || '').trim()

/** 默认中心：九江市濂溪区（与演示设备地址一致） */
export const DEFAULT_MAP_CENTER = {
  longitude: 118.6,
  latitude: 24.9,
}

export const DEFAULT_MAP_SCALE = 16
