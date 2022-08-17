"use strict"
const { segment } = require("oicq")
const { bot } = require("./index")
const { group_token, qq_setTime_token } = require("./groupToken")
const {
	getWeather,
	getArr,
	getSchoolEat,
	botCanDo,
	getEat,
	getGoodEat,
	getDrink,
	// cacheAllDateInfo,
	getAllDateInfo,
	getReturnGroup,

} = require("./unit")




// hello world
bot.on("message", async function (msg) {
	// const res = msg.message[0] || undefined
	// if (res && res.type === 'at' && res.qq === 836473734 && msg.sender.user_id !== 2854196310) {
	// 	const returnMsg = await getArr(msg.message[1].text)
	// 	if (returnMsg === '我很可爱，请给我钱，谢谢老板') {
	// 		msg.reply(segment.image("https://api2.mubu.com/v3/document_image/b82c48b0-c46a-49d0-a677-523355524518-3807603.jpg"), true)
	// 	}
	// 	msg.reply(returnMsg, true)
	// }
})









// bot.sendGroupMsg(681467770,segment.image('img/1.jpg'))
// bot.sendMsg(836473734,segment.image('img/1.jpg'))

// 撤回和发送群消息
// 监听群消息 鉴权 判断该群有什么权限
bot.on("message.group",async function (msg) {
	const resMsg = await getReturnGroup(msg.message[0].text, msg.group_id)
	if (resMsg) msg.reply(resMsg, true)
	// const msgObj = msg.message[0].text
	// const groupId = msg.group_id
	// const thisToken = group_token[groupId] || []
	// if ( /天气$/.test(msgObj.text) && thisToken.includes(1)) {
	// 	msg.reply(await getWeather(msgObj.text.split('天气')[0]), true)
	// } else if ( /^请问/.test(msgObj.text) && thisToken.includes(0)) {
	// 	msg.reply(await getArr(msgObj.text), true)
	// } else if ( /疫情$/.test(msgObj.text) &&  thisToken.includes(2)) {
	// 	// msg.reply(await getEpidemicInfo(msgObj.text.split('疫情')[0]), true)
	// } else if (msgObj.text === '今天在学校吃什么' &&  thisToken.includes('sauFood')) {
	// 	msg.reply(await getSchoolEat(), true)
	// } else if (msgObj.text === '机器人功能') {
	// 	msg.reply(botCanDo(), true)
	// } else if (msgObj.text === '今天吃什么' && thisToken.includes('todayEat')) {
	// 	msg.reply(getEat(), true)
	// } else if (msgObj.text === '今天吃什么好的' && thisToken.includes('todayEatGood')) {
	// 	msg.reply(getGoodEat(), true)
	// } else if (msgObj.text === '今天喝什么' && thisToken.includes('todayDrink')) {
	// 	msg.reply(getDrink(), true)
	// } else if (msgObj.text === 'wlsnb!' || msgObj.text === 'wlsnb') {
	// 	msg.reply(segment.image('img/2.jpg'), true)
	// } else if (msgObj.text === '今日情况') {
	// 	msg.reply(global.cacheAllDateInfo, true)
	// }


	// const msgObj = msg.message[0]
	// if (msgObj.type === 'text' && /^请问.{2}/.test(msgObj.text)) {
	// 	console.log(msgObj.text.split('请问')[1])
	// 	const returnMsg = await getArr(msgObj.text.split('请问')[1])
	// 	msg.reply(returnMsg, true)
	// } 

	// console.log(msg)
	// if (msg.raw_message === "dice") {
	// 	// 撤回这条消息
	// 	msg.recall()
	// 	// 发送一个骰子
	// 	msg.group.sendMsg(segment.dice())
	// 	// 发送一个戳一戳
	// 	msg.member.poke()
	// }
})


// bot.on("message.group", function (msg) {
// 	msg.group.sendMsg('2113')
// })

// const tigang = () => {
// 	bot.sendGroupMsg(681467770,segment.image('img/1.jpg'))
// 	bot.sendGroupMsg(729462289,segment.image('img/1.jpg'))
// }

// setTimeout(() => {
// 	bot.pickFriend(2749909223).sendMsg(segment.image('img/1.jpg'))
// }, 1000);

// setInterval(() => {
// 	tigang()
// },1000*3600*3);


// 接收戳一戳
bot.on("notice.group.poke", function (e) {
	// if (e.target_id === this.uin)
	// 	e.group.sendMsg("dont poke me")
})
