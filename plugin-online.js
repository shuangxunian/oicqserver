"use strict"
const { bot } = require("./index")
const {
	pushUserInfo,
	getAllDateInfo,
	timeoutFunc,
} = require("./unit")

bot.on("system.online", function () {
	// 你的账号已上线，你可以做任何事
	console.log(`来自plugin-online: 我是${this.nickname}(${this.uin})，我有${this.fl.size}个好友，${this.gl.size}个群`)
	// 每天早上汇报信息
	timeoutFunc({
		interval: 24,
		runNow: false,
		time: '08:00:00'
	},pushUserInfo)


	// 每天0点刷新日期
	timeoutFunc({
		interval: 24,
		runNow: true,
		time: '00:00:50'
	},getAllDateInfo)
})
