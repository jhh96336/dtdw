/**
 * 高德地图配置（H5 开发/打包均读取 .env.production）
 * 申请：https://console.amap.com/dev/key/app（类型：Web端 JS API）
 * Referer 示例：http://127.0.0.1:5174/*、https://dtdw-eight.vercel.app/*
 */
export const AMAP_KEY = (import.meta.env.VITE_AMAP_KEY || '').trim()
export const AMAP_SECURITY_CODE = (import.meta.env.VITE_AMAP_SECURITY_CODE || '').trim()

/** 默认中心：九江市濂溪区（与演示设备地址一致） */
export const DEFAULT_MAP_CENTER = {
  longitude: 118.6,
  latitude: 24.9,
}

export const DEFAULT_MAP_SCALE = 16
