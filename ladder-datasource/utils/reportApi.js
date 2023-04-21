/**
 *  @author hhx
 *  @date 2020-07-01 15:13
 */
import moment from 'moment'

let data = {
  reject: [],
  refuse: [],
  line: [],
  credit: [],
  letter: [],
  ratio: [],
  usage: [],
  balance: [],
  collect1: [],
  collect2: [],
  overdue1: [],
  overdue2: [],
  overdue3: [],
  overdue4: [],
  migration: [],
}

const channel = ['度小满', '360金融']

const getDateArray = (days) => {
  days = 3
  return Array.from({length: days}).map((v, index) => {
    let day = index + 22
    // console.log(day)
    return moment().subtract(day, 'days').format('YYYY-MM-DD')
  })
}

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const getRandomChannel = () => {
  let index = Math.round(Math.random())
  return channel[index]
}

const filterData = (data, params) => {
  let channel = ''
  if (!!params.channel) {
    if (params.channel == 1) {
      channel = '度小满'
    }
    if (params.channel == 2) {
      channel = '360金融'
    }
  }

  return data.filter((v) => {
    let compareTime = moment(v.key1).isBetween(
      params.minTime,
      params.maxTime,
      null,
      '[]',
    )

    let compareChannel = v.key2 === channel
    if (!params.channel && !!params.minTime) {
      return compareTime
    }
    if (!!params.channel && !params.minTime) {
      return compareChannel
    }
    if (!!params.channel && !!params.minTime) {
      return compareTime && compareChannel
    }
    if (!params.channel && !params.minTime) {
      return true
    }
  })
}

const initRejectList = (type) => {
  console.log('init reject')

  let getObj = (v, index, cIndex) => {
    return {
      key1: v, // 时间
      key2: channel[cIndex], // channel
      key3: getRandom(50, 3000) / 100 + '%',
      key4: getRandom(50, 3000) / 100 + '%',
      key5: getRandom(50, 3000) / 100 + '%',
      key6: getRandom(50, 3000) / 100 + '%',
      key7: getRandom(50, 3000) / 100 + '%',
      key8: getRandom(50, 3000) / 100 + '%',
      key9: getRandom(50, 3000) / 100 + '%',
      key10: getRandom(50, 3000) / 100 + '%',
      key: cIndex + '' + index,
    }
  }

  data[type] = getDateArray(365)
    .map((v, index) => {
      let obj1 = getObj(v, index, 0)
      let obj2 = getObj(v, index, 1)
      return [obj1, obj2]
    })
    .flat()
}
const getBeforeRejectList = (params, type) => {
  if (data[type].length === 0) {
    initRejectList(type)
  }
  return filterData(data[type], params)

  // let totalItem = {
  //   key1: '总计',
  //   key2: '全部',
  //   key3: getRandom(100, 1500) / 100,
  //   key: -1,
  // }
  // totalItem.key4 = (100 - totalItem.key3).toFixed(2) + '%'
  // totalItem.key3 = totalItem.key3.toFixed(2) + '%'

  return resArray.length === 0 ? resArray : [totalItem, ...resArray]
}

const getRatio = (obj) => {
  obj.key12 = ((obj.key4 / obj.key3).toFixed(3) * 100).toFixed(1) + '%'
  obj.key13 = ((obj.key5 / obj.key3).toFixed(3) * 100).toFixed(1) + '%'
  obj.key14 = ((obj.key6 / obj.key3).toFixed(3) * 100).toFixed(1) + '%'
  obj.key15 = ((obj.key7 / obj.key3).toFixed(3) * 100).toFixed(1) + '%'
  obj.key16 = ((obj.key8 / obj.key3).toFixed(3) * 100).toFixed(1) + '%'
  obj.key17 = ((obj.key9 / obj.key3).toFixed(3) * 100).toFixed(1) + '%'
  obj.key18 = ((obj.key10 / obj.key3).toFixed(3) * 100).toFixed(1) + '%'
  obj.key19 = ((obj.key11 / obj.key3).toFixed(3) * 100).toFixed(1) + '%'
  return obj
}

const getLineObj = (time, index, cIndex) => {
  let obj = {
    key: index,
    key1: time, // 时间
    key2: channel[cIndex], // channel
    key4: getRandom(0, 23),
    key5: getRandom(2, 50),
    key6: getRandom(0, 48),
    key7: getRandom(1, 23),
    key8: getRandom(2, 35),
    key9: getRandom(0, 23),
    key10: getRandom(0, 56),
    key11: getRandom(0, 87),
  }
  obj.key3 =
    obj.key4 +
    obj.key5 +
    obj.key6 +
    obj.key7 +
    obj.key8 +
    obj.key9 +
    obj.key10 +
    obj.key11
  obj = {...obj, ...getRatio(obj)}
  return obj
}
const initLineList = (type) => {
  console.log('initLineList')
  data[type] = getDateArray(365)
    .map((v, index) => {
      return [getLineObj(v, index, 0), getLineObj(v, index, 1)]
    })
    .flat()
}
const getBeforeLineList = (params, type) => {
  if (data[type].length === 0) {
    initLineList(type)
  }
  // console.log(data[type])
  //
  let resArray = filterData(data[type], params)

  let totalItem = resArray.reduce(
    (preV, currentV) => {
      preV.key3 += currentV.key3
      preV.key4 += currentV.key4
      preV.key5 += currentV.key5
      preV.key6 += currentV.key6
      preV.key7 += currentV.key7
      preV.key8 += currentV.key8
      preV.key9 += currentV.key9
      preV.key10 += currentV.key10
      preV.key11 += currentV.key11
      return preV
    },
    {
      key: -1,
      key1: '总计',
      key2: '全部',
      key3: 0,
      key4: 0,
      key5: 0,
      key6: 0,
      key7: 0,
      key8: 0,
      key9: 0,
      key10: 0,
      key11: 0,
    },
  )
  let obj = {...totalItem, ...getRatio(totalItem)}
  return resArray.length === 0 ? resArray : [obj, ...resArray]
}

const initCreditList = (type) => {
  console.log('init reject')
  data[type] = getDateArray(365)
    .map((v, index) => {
      let obj1 = {
        key1: v, // 时间
        key2: channel[0], // channel
        key4: getRandom(180, 200),
        key5: getRandom(0, 100),
        key: index,
      }
      obj1.key3 = obj1.key4 + obj1.key5
      obj1.key6 = ((obj1.key5 / obj1.key3).toFixed(3) * 100).toFixed(1) + '%'

      let obj2 = {
        key1: v, // 时间
        key2: channel[1], // channel
        key4: getRandom(180, 200),
        key5: getRandom(0, 100),
        key: index,
      }
      obj2.key3 = obj2.key4 + obj2.key5
      obj2.key6 = ((obj2.key5 / obj2.key3).toFixed(3) * 100).toFixed(1) + '%'

      return [obj1, obj2]
    })
    .flat()
}
const getBeforeCreditList = (params, type) => {
  if (data[type].length === 0) {
    initCreditList(type)
  }

  let resArray = filterData(data[type], params)

  let totalItem = resArray.reduce(
    (preV, currentV) => {
      preV.key3 += currentV.key3
      preV.key4 += currentV.key4
      preV.key5 += currentV.key5
      return preV
    },
    {key: -1, key1: '总计', key2: '全部', key3: 0, key4: 0, key5: 0},
  )
  totalItem.key6 =
    ((totalItem.key5 / totalItem.key3).toFixed(3) * 100).toFixed(1) + '%'

  return resArray.length === 0 ? resArray : [totalItem, ...resArray]
}

const iniRatioList = (type) => {
  console.log('iniRatioList')
  let dates = ['2020-06', '2020-05']
  data[type] = dates
    .map((v, index) => {
      let obj1 = {
        key1: v, // 时间
        key2: channel[0], // channel
        key3: getRandom(800, 1000),
        key: index,
      }
      let obj2 = {
        key1: v, // 时间
        key2: channel[1], // channel
        key3: getRandom(800, 1000),
        key: index,
      }

      Array.from({length: 12}).forEach((v, index) => {
        let key = `key${index + 4}`

        if (index === 0) {
          obj1[key] = (getRandom(8000, 9000) / 100).toFixed(1) + '%'
          obj2[key] = (getRandom(8000, 9000) / 100).toFixed(1) + '%'
        } else {
          obj1[key] = (getRandom(0, 100) / 100).toFixed(2) + '%'
          obj2[key] = (getRandom(0, 100) / 100).toFixed(2) + '%'
        }
      })

      return [obj1, obj2]
    })
    .flat()
}
const getMiddleRatioList = (params, type) => {
  if (data[type].length === 0) {
    iniRatioList(type)
  }

  let resArray = filterData(data[type], params)

  let totalItem = resArray.reduce(
    (preV, currentV) => {
      preV.key3 += currentV.key3
      return preV
    },
    {key: -1, key1: '总计', key2: '全部', key3: 0},
  )

  Array.from({length: 12}).forEach((v, index) => {
    let key = `key${index + 4}`

    if (index === 0) {
      totalItem[key] = (getRandom(8000, 9000) / 100).toFixed(1) + '%'
    } else {
      totalItem[key] = (getRandom(0, 100) / 100).toFixed(2) + '%'
    }
  })

  return resArray.length === 0 ? resArray : [totalItem, ...resArray]
}

const iniUsageList = (type) => {
  console.log('iniRatioList')
  let dates = ['2020-06', '2020-05']
  data[type] = dates
    .map((v, index) => {
      let obj1 = {
        key1: v, // 时间
        key2: channel[0], // channel
        key3: getRandom(20, 40) * 10000,
        key: index,
      }
      let obj2 = {
        key1: v, // 时间
        key2: channel[1], // channel
        key3: getRandom(20, 40) * 10000,
        key: index,
      }

      Array.from({length: 12}).forEach((v, index) => {
        let key = `key${index + 4}`
        obj1[key] = getRandom(8, 38) + '%'
        obj2[key] = getRandom(5, 45) + '%'
      })

      return [obj1, obj2]
    })
    .flat()
}
const getMiddleUsageList = (params, type) => {
  if (data[type].length === 0) {
    iniUsageList(type)
  }

  let resArray = filterData(data[type], params)

  let totalItem = resArray.reduce(
    (preV, currentV) => {
      preV.key3 += currentV.key3
      return preV
    },
    {key: -1, key1: '总计', key2: '全部', key3: 0},
  )

  Array.from({length: 12}).forEach((v, index) => {
    let key = `key${index + 4}`
    totalItem[key] = getRandom(6, 38) + '%'
  })

  return resArray.length === 0 ? resArray : [totalItem, ...resArray]
}

const initBalanceList = (type) => {
  console.log('iniRatioList')
  data[type] = getDateArray(365)
    .map((v, index) => {
      let obj1 = {
        key1: v, // 时间
        key2: channel[0], // channel
        key3: getRandom(1800, 5000),
        key4: getRandom(3200, 8000),
        key5: getRandom(3200, 8000) * 30000,
        key6: getRandom(800, 4500) * 30000,
        key8: getRandom(100, 350) / 100 + '%',
        key9: getRandom(100, 200) / 100 + '%',
        key10: getRandom(0, 100) / 100 + '%',
        key11: getRandom(0, 100) / 100 + '%',
        key: index,
      }
      obj1.key7 = (obj1.key5 / obj1.key4).toFixed(0)
      let obj2 = {
        key1: v, // 时间
        key2: channel[1], // channel
        key3: getRandom(1800, 5000),
        key4: getRandom(3200, 8000),
        key5: getRandom(3200, 8000) * 30000,
        key6: getRandom(800, 4500) * 30000,
        key8: getRandom(100, 350) / 100 + '%',
        key9: getRandom(100, 200) / 100 + '%',
        key10: getRandom(0, 100) / 100 + '%',
        key11: getRandom(0, 100) / 100 + '%',
        key: index,
      }
      obj2.key7 = (obj2.key5 / obj2.key4).toFixed(0)

      return [obj1, obj2]
    })
    .flat()
}
const getMiddleBalanceList = (params, type) => {
  if (data[type].length === 0) {
    initBalanceList(type)
  }

  let resArray = filterData(data[type], params)

  let totalItem = resArray.reduce(
    (preV, currentV) => {
      preV.key3 += currentV.key3
      preV.key4 += currentV.key4
      preV.key5 += currentV.key5
      preV.key6 += currentV.key6
      return preV
    },
    {key: -1, key1: '总计', key2: '全部', key3: 0, key4: 0, key5: 0, key6: 0},
  )
  totalItem.key7 = (totalItem.key5 / totalItem.key4).toFixed(0)
  totalItem.key8 = getRandom(100, 350) / 100 + '%'
  totalItem.key9 = getRandom(100, 200) / 100 + '%'
  totalItem.key10 = getRandom(0, 100) / 100 + '%'
  totalItem.key11 = getRandom(0, 100) / 100 + '%'

  return resArray.length === 0 ? resArray : [totalItem, ...resArray]
}

const initCollectList = (type) => {
  console.log('iniRatioList')

  let getObj = (v, index, cIndex) => {
    return {
      key1: v, // 时间
      key2: channel[cIndex], // channel
      key3: getRandom(3200, 5000) * 30000,
      key4: getRandom(1000, 3200) * 30000,
      key5: getRandom(18, 30) + '%',
      key6: getRandom(50, 75) + '%',
      key7: getRandom(100, 280) * 10000,
      key8: getRandom(100, 210) * 10000,
      key9: getRandom(60, 320) * 10000,
      key10: getRandom(50, 432) * 10000,
      key11: getRandom(800, 900) * 10000,
      key12: getRandom(100, 233) * 10000,
      key13: getRandom(18, 80) + '%',
      key14: getRandom(50, 75) + '%',
      key15: getRandom(18, 30) + '%',
      key16: getRandom(50, 75) + '%',
      key17: getRandom(18, 30) + '%',
      key18: getRandom(0, 30) + '%',
      key: index,
    }
  }

  data[type] = getDateArray(365)
    .map((v, index) => {
      let obj1 = getObj(v, index, 0)
      let obj2 = getObj(v, index, 1)

      if (type === 'collect2') {
        obj1.key3 = obj1.key3 / 30000
        obj1.key4 = obj1.key4 / 30000
        obj2.key3 = obj2.key3 / 30000
        obj2.key4 = obj2.key4 / 30000
      }

      return [obj1, obj2]
    })
    .flat()
}
const getAfterCollectList = (params, type) => {
  if (data[type].length === 0) {
    initCollectList(type)
  }

  let resArray = filterData(data[type], params)

  let totalItem = resArray.reduce(
    (preV, currentV) => {
      preV.key3 += currentV.key3
      preV.key4 += currentV.key4
      preV.key7 += currentV.key7
      preV.key8 += currentV.key8
      preV.key9 += currentV.key9
      preV.key10 += currentV.key10
      preV.key11 += currentV.key11
      preV.key12 += currentV.key12
      return preV
    },
    {
      key: -1,
      key1: '总计',
      key2: '全部',
      key3: 0,
      key4: 0,
      key7: 0,
      key8: 0,
      key9: 0,
      key10: 0,
      key11: 0,
      key12: 0,
    },
  )
  totalItem.key5 = getRandom(18, 30) + '%'
  totalItem.key6 = getRandom(50, 75) + '%'
  totalItem.key13 = getRandom(18, 80) + '%'
  totalItem.key14 = getRandom(50, 75) + '%'
  totalItem.key15 = getRandom(18, 30) + '%'
  totalItem.key16 = getRandom(50, 75) + '%'
  totalItem.key17 = getRandom(18, 30) + '%'
  totalItem.key18 = getRandom(0, 30) + '%'

  return resArray.length === 0 ? resArray : [totalItem, ...resArray]
}

const initOverdueList = (type) => {
  console.log('iniRatioList')
  let dates = ['2020-05', '2020-06']
  let getObj = (v, index, cIndex) => {
    let obj = {
      key1: v, // 时间
      key2: channel[cIndex], // channel
      key3: getRandom(3200, 5000) * 30000,
      key: index,
    }

    Array.from({length: 24}).forEach((v, index) => {
      let key = `key${index + 4}`
      obj[key] = getRandom(100, 1300) / 100 + '%'
    })

    return obj
  }

  data[type] = dates
    .map((v, index) => {
      let obj1 = getObj(v, index, 0)
      let obj2 = getObj(v, index, 1)

      return [obj1, obj2]
    })
    .flat()
}
const getAfterOverdueList = (params, type) => {
  if (data[type].length === 0) {
    initOverdueList(type)
  }

  let resArray = filterData(data[type], params)

  let totalItem = resArray.reduce(
    (preV, currentV) => {
      preV.key3 += currentV.key3
      return preV
    },
    {
      key: -1,
      key1: '总计',
      key2: '全部',
      key3: 0,
    },
  )
  Array.from({length: 24}).forEach((v, index) => {
    let key = `key${index + 4}`
    totalItem[key] = getRandom(100, 1300) / 100 + '%'
  })
  return resArray.length === 0 ? resArray : [totalItem, ...resArray]
}

const initMigrationList = (type) => {
  console.log('iniRatioList')
  let dates = [
    '2019-07',
    '2019-08',
    '2019-09',
    '2019-10',
    '2019-11',
    '2019-12',
    '2020-01',
    '2020-02',
    '2020-03',
    '2020-04',
    '2020-05',
    '2020-06',
  ].reverse()
  let getObj = (v, index, cIndex) => {
    let obj = {
      key1: v, // 时间
      key2: channel[cIndex], // channel
      key3: getRandom(3200, 5000) * 30000,
      key: cIndex + '' + index,
    }
    const dateIndex = index

    Array.from({length: 7}).forEach((v, index) => {
      let key = `key${index + 4}`
      let num = getRandom((index + 2) * 100, (index + 4) * 100)
      // obj[key] = num < 300 ? '' : num / 100 + '%'
      obj[key] = index > dateIndex ? '' : num / 10 + '%'
    })

    return obj
  }

  data[type] = dates
    .map((v, index) => {
      let obj1 = getObj(v, index, 0)
      let obj2 = getObj(v, index, 1)

      return [obj1, obj2]
    })
    .flat()
}
const getAfterMigrationList = (params, type) => {
  if (data[type].length === 0) {
    initMigrationList(type)
  }
  let res = []
  res = filterData(data[type], params)
  if (params.date2) {
    res = res.filter((v) => {
      return moment(v.key1).isBefore(params.date2)
    })
  }

  return res
}

export {
  getBeforeRejectList,
  getBeforeLineList,
  getBeforeCreditList,
  getMiddleRatioList,
  getMiddleUsageList,
  getMiddleBalanceList,
  getAfterCollectList,
  getAfterOverdueList,
  getAfterMigrationList,
}
