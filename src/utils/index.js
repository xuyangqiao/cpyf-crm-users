/**
 *
 * @param {string} current 当前时间
 * @param {number} countDay 向后或者向前的天数
 */
export const handleDay = (current = null, countDay = 0) => {
  let d
  // 如果没有传入时间，则使用当前时间
  current ? d = new Date(current) : d = new Date()
  d.setDate(d.getDate() + countDay)
  let year = d.getFullYear()
  let mon = d.getMonth() + 1
  let day = d.getDate()
  let time = `${year}-${mon}-${day}`
  return time
}

export const todayTime = () => {
  let d = new Date()
  let year = d.getFullYear()
  let mon = d.getMonth() + 1
  mon = mon < 10 ? ('0' + mon) : mon
  let day = d.getDate()
  day = day < 10 ? ('0' + day) : day
  let time = `${year}-${mon}-${day}`
  return time
}

export const handleOffice = (current = null) => {
  let d
  let temp
  // 如果没有传入时间，则使用当前时间\
  if (current) {
    temp = current.split('-')
    temp[1] = parseInt(temp[1]) < 10 ? ('0' + parseInt(temp[1])) : temp[1]
    temp = temp.join('-')
  }
  current ? d = new Date(temp) : d = new Date()
  let year = d.getFullYear()
  let mon = d.getMonth() + 1
  let time = `${year}年${mon}月`
  return time
}

export const dateObj = (current) => {
  let d
  let temp
  const weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  // 如果没有传入时间，则使用当前时间\
  if (current) {
    temp = current.split('-')
    temp[1] = parseInt(temp[1]) < 10 ? ('0' + parseInt(temp[1])) : temp[1]
    temp[2] = parseInt(temp[2]) < 10 ? ('0' + parseInt(temp[2])) : temp[2]
    temp = temp.join('-')
  }
  current ? d = new Date(temp) : d = new Date()
  let mon = d.getMonth() + 1
  let day = d.getDate()
  let time = `${mon}月${day}日`
  let week = weekArr[d.getDay()]     // 获取星期几
  return {
    date: time,
    week: week
  }
}

/**
 *
 * @param {string} start 开始时间
 * @param {string} end 结束时间
 */

export const listTime = (begin, end) => {
  let arr = []
  let ab = begin.split('-')
  let ae = end.split('-')
  let db = new Date()
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
  let de = new Date()
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
  let unixDb = db.getTime()
  let unixDe = de.getTime()
  for (let k = unixDb; k <= unixDe;) {
    arr.push((new Date(parseInt(k))).format())
    k = k + 24 * 60 * 60 * 1000
  }
  return arr
}

/*
 * 身份证15位编码规则：dddddd yymmdd xx p
 * dddddd：6位地区编码
 * yymmdd: 出生年(两位年)月日，如：910215
 * xx: 顺序编码，系统产生，无法确定
 * p: 性别，奇数为男，偶数为女
 *
 * 身份证18位编码规则：dddddd yyyymmdd xxx y
 * dddddd：6位地区编码
 * yyyymmdd: 出生年(四位年)月日，如：19910215
 * xxx：顺序编码，系统产生，无法确定，奇数为男，偶数为女
 * y: 校验码，该位数值可通过前17位计算获得
 *
 * 前17位号码加权因子为 Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ]
 * 验证位 Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]
 * 如果验证码恰好是10，为了保证身份证是十八位，那么第十八位将用X来代替
 * 校验位计算公式：Y_P = mod( ∑(Ai×Wi),11 )
 * i为身份证号码1...17 位; Y_P为校验码Y所在校验码数组位置
 */
export const testCard = (idCard) => {
  // 15位和18位身份证号码的正则表达式
  const regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/

  // 如果通过该验证，说明身份证格式正确，但准确性还需计算
  if (regIdCard.test(idCard)) {
    if (idCard.length === 18) {
      let idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 将前17位加权因子保存在数组里
      let idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
      let idCardWiSum = 0 // 用来保存前17位各自乖以加权因子后的总和
      for (var i = 0; i < 17; i++) {
        idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i]
      }

      let idCardMod = idCardWiSum % 11 // 计算出校验码所在数组的位置
      let idCardLast = idCard.substring(17) // 得到最后一位身份证号码

      // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
      if (idCardMod === 2) {
        if (idCardLast === 'X' || idCardLast === 'x') {
          return true
        } else {
          return false
        }
      } else {
        // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
        if (parseInt(idCardLast) === idCardY[idCardMod]) {
          return true
        } else {
          return false
        }
      }
    }
  } else {
    return false
  }
}
