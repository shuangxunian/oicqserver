"use strict"
const { createClient } = require("oicq")

const account = 836473734

const bot = createClient(account)

bot
.on("system.login.slider", function (e) {
        console.log("输入ticket：")
        process.stdin.once("data", ticket => this.submitSlider(String(ticket).trim()))
})
.login(process.env.QQPWD)

exports.bot = bot

// template plugins
require("./plugin-hello") //hello world
require("./plugin-image") //发送图文和表情
require("./plugin-request") //加群和好友
require("./plugin-online") //监听上线事件

process.on("unhandledRejection", (reason, promise) => {
	console.log('Unhandled Rejection at:', promise, 'reason:', reason)
})