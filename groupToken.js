/*
 * @Author: yuelin.wang
 * @Date: 2022-08-13 13:12:32
 * @LastEditors: yuelin.wang
 * @LastEditTime: 2022-08-16 22:59:14
 * @Description: 
 */
// 0 AI回答沈航新生问题
// 1 为天气
// 2 疫情
// 3
exports.group_token = {
  729462289: [0, 1, 2, 3, 'sauFood', 'todayEat', 'todayEatGood', 'todayDrink'],
  128887010: [0, 1, 2, 3, 'sauFood', 'todayEat', 'todayEatGood', 'todayDrink'],
  557114010: [0, 1, 2, 3, 'sauFood', 'todayEat', 'todayEatGood', 'todayDrink'],
  681467770: [1, 'todayEat', 'todayEatGood', 'todayDrink'],
  435936368: [1, 'todayEat', 'todayEatGood', 'todayDrink'],
  1167425449: [1, 'todayEat', 'todayEatGood', 'todayDrink'],
}

// 0 节假日
// 1 工资

exports.qq_setTime_token = [
  {
    qq: 2749909223,
    hello: '霜霜早上好，',
    weather: '杭州',
    haveFun: [0, 1]
  }, {
    qq: 1506413394,
    hello: '娜姐早上好，',
    weather: '杭州',
    haveFun: [0, 1]
  }, {
    qq: 365717424,
    hello: '乌兹早上好，',
    weather: '杭州',
    haveFun: [0, 1]
  }, {
    qq: 361772818,
    hello: '周巍早上好，',
    weather: '杭州',
    haveFun: [0, 1]
  }
]

// 0 早上好
// 1 提肛
exports.group_setTime_token = [
  {
    group: 681467770,
    hello: '群友们早上好，',
    weather: '杭州',
    haveFun: [0, 1]
  }, {
    group: 729462289,
    hello: '同学们早上好，',
    weather: '沈阳',
    haveFun: [0]
  }, {
    group: 557114010,
    hello: '同学们早上好，',
    weather: '沈阳',
    haveFun: [0]
  }, {
    group: 128887010,
    hello: '同学们早上好，',
    weather: '沈阳',
    haveFun: [0]
  }, {
    group: 435936368,
    hello: '同学们早上好，',
    weather: '杭州',
    haveFun: [0]
  }, 
]

