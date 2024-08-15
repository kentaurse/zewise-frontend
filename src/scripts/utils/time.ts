import moment from "moment"

moment.defineLocale('zh-cn', {
  relativeTime: {
    future: '%s内',
    past: '%s前',
    s: '几秒',
    m: '1分钟',
    mm: '%d分钟',
    h: '1小时',
    hh: '%d小时',
    d: '1天',
    dd: '%d天',
    M: '1个月',
    MM: '%d个月',
    y: '1年',
    yy: '%d年'
  }
})

function FormatTime(timestamp: number): string {
  const time = new Date(timestamp * 1000)
  if (Date.now() - time.getTime() < 1000 * 60 * 60 * 24) {
    return moment(time).locale('zh-cn').fromNow()
  }
  return moment(time).format('YYYY-MM-DD HH:mm:ss')
}

export { FormatTime }