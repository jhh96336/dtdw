/**
 * 解析 static 目录下的资源 URL，兼容 Vercel / 子路径部署。
 * @param {string} path 如 static/tabbar/map.png 或 /static/satellite.png
 */
export function staticUrl(path) {
  const normalized = String(path).replace(/^\//, '')
  const base = import.meta.env.BASE_URL || '/'
  const prefix = base.endsWith('/') ? base : `${base}/`
  return `${prefix}${normalized}`.replace(/([^:]\/)\/+/g, '$1')
}
