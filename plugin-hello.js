"use strict"
const { segment } = require("oicq")
const { bot } = require("./index")
const { group_token, qq_setTime_token } = require("./groupToken")
const {
	getReturnGroup,

} = require("./unit")




// hello world
bot.on("message", async function (msg) {

})

// 撤回和发送群消息
// 监听群消息 鉴权 判断该群有什么权限
bot.on("message.group",async function (msg) {
	const resMsg = await getReturnGroup(msg.message[0].text, msg.group_id)
	if (resMsg) msg.reply(resMsg, true)
	// if (msg.raw_message === "dice") {
	// 	// 撤回这条消息
	// 	msg.recall()
	// 	// 发送一个骰子
	// 	msg.group.sendMsg(segment.dice())
	// 	// 发送一个戳一戳
	// 	msg.member.poke()
	// }
})


// 接收戳一戳
bot.on("notice.group.poke", function (e) {
	if (e.target_id === this.uin)
		e.group.sendMsg("别戳我！")
})
