/** TabBar 页面路径，跳转时请使用 uni.switchTab */
export const TAB_PAGES = {
  location: '/pages/location/location',
  message: '/pages/message/message',
  mine: '/pages/mine/mine',
}

export function switchTab(key) {
  const url = TAB_PAGES[key]
  if (url) {
    uni.switchTab({ url })
  }
}
