"use strict"
const { segment } = require("oicq")
const { bot } = require("./index")
const rp = require('request-promise');

const options = {
  method: 'POST',
  url: 'http://192.168.31.23:5000/getss',
  body: [],
  json: true // Automatically stringifies the body to JSON
};

const conMap = [
	['学校在哪','地理位置'],
	['学校地址是什么','地理位置'],
	['你是不是出问题了','你在狗叫什么'],
	['你有几个对象','你在狗叫什么'],
	['你相过几次亲','你在狗叫什么'],
	['校花是谁','你在狗叫什么'],
	['校草是谁','你在狗叫什么'],
	['男生可以找男朋友吗','你在狗叫什么'],
	['宿舍怎么样','宿舍环境'],
	['食堂怎么样','食堂'],
	['吃的怎么样','食堂'],
	['学校女生多吗','男女比'],
	['男女比多少','男女比'],
	['学校男女比多吗','男女比'],
	['快递呢','快递'],
	['快递去哪取','快递'],
	['行李可以快递吗','快递行李'],
	['周围有什么好吃的吗','美食推荐'],
	['可以点外卖吗','外卖'],
	['健身房','健身房'],
	['学校内有羽毛球馆吗','健身房'],
	['作者是谁','作者'],
	['你是谁','作者'],
	['你是什么','作者'],
	['澡堂是啥样的','澡堂'],
	['澡堂是通的吗','澡堂'],
	['怎么洗澡','澡堂'],
	['图书馆','图书馆'],
	['图书馆怎么样','图书馆'],
	['日常开销是多少','生活消费'],
	['生活费要多少','生活消费'],
	['赞助','赞助'],
	// ['',''],
	// ['',''],
	// ['',''],
	// ['',''],
]

const reqMap = {
	'地理位置': '地址是辽宁省沈阳市沈北新区道义南大街37号，周边是沈师、辽大、辽传、工程，学校所在的沈北新区不算郊区，交通方便，按照地理位置分为南北区，只有一个校区，南区北区说的是南生活区、北生活区，简称南区北区，步行大概十分钟的距离，宿舍楼有高有矮，高层有电梯，快递驿站南北区都有',
	'你在狗叫什么': '你在狗叫什么',
	'宿舍环境': '宿舍是早六点供电，晚十一点准时断电；没有独立卫浴，没有空调风扇，可以自己准备小风扇。上下铺，六人寝，可以和室友商量调换上下铺；每人两个柜子，充电插口大概两个或三个，需要自己接插排',
	'食堂': '食堂不贵 吃的挺好',
	'男女比': '沈航男女总体比例7比3，工科学校都这样，经管设艺女生较多，大多专业男生多。',
	'快递': '大多数快递都在南区，中通能放进来的时候就在北区',
	'美食推荐': '校内南北区食堂都不错，能出校的话外面的积家也有好吃的，但是不建议吃学校周围的自助',
	'外卖': '校内的外卖都能点，校外的要看学校会不会抓，还有能点外卖送到床的公众号',
	'健身房': '校内有健身房，室内羽毛球、篮球馆，均收费，需要带学生证和白卡入内',
	'作者': '我是由霜序廿所设计的AI机器人，技术栈为 Node + python，模型选用 oicq + paddlenlp',
	'澡堂': '不是独立卫浴，是通透的大澡堂，没有遮挡，南区北区都有',
	'图书馆': '非常漂亮，圆柱形设计，也非常大，有七层，每层都可以看书学习，在沈阳市都可以排名数一数二的地位。进图书馆需要学生证，而且半小时内不能重复进入，一楼有咖啡厅，二三楼可以一边借书，一边学习，往上楼层是自习的地方。进入图书馆自习是需要预约的，可以提前三天预约，这个图书馆预约制度严格，管理很好。学习环境还是不错的。',
	'行李快递': '行李快递是完全可以的，地址就是沈阳市沈北新区道义大街沈阳航空航天大学，建议提前两三天快递',
	'生活消费': '1000能吃饱，1500能吃好',
	'赞助': '我很可爱，请给我钱，谢谢老板',
	// '': '',
}

const getArr = async (text) => {
	const arr = []
	for (let i = 0; i < conMap.length; i++) {
		arr.push([text,conMap[i][0]])
	}
	options.body = arr
	const conIndex = await rp(options)
	// console.log('conIndex')
	// console.log(conIndex)
	if (conIndex === -1) return '我不知道你在说什么'
	else return reqMap[conMap[conIndex][1]]
}

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

// 撤回和发送群消息
bot.on("message.group",async function (msg) {
	const msgObj = msg.message[0]
	if (msgObj.type === 'text' && /^请问.{2}/.test(msgObj.text)) {
		console.log(msgObj.text.split('请问')[1])
		const returnMsg = await getArr(msgObj.text.split('请问')[1])
		// console.log('returnMsg')
		// console.log(returnMsg)
		msg.reply(returnMsg, true)
		// msg.reply(msgObj.text.split('请问'), true)
		// /^[活动]{2}/
		// const question = msgObj.text.split(' ')
		// msg.reply(question[1], true)
		// console.log(question)
	} 

	// msg.group.sendMsg(segment.dice())
	// msg.group.sendMsg('2113')
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

const tigang = () => {
	// bot.sendGroupMsg(681467770,segment.image('img/1.jpg'))
	// bot.sendGroupMsg(729462289,segment.image('img/1.jpg'))
}

setTimeout(() => {
	tigang()
}, 1000);

setInterval(() => {
	tigang()
},1000*3600*3);


// 接收戳一戳
bot.on("notice.group.poke", function (e) {
	// if (e.target_id === this.uin)
	// 	e.group.sendMsg("dont poke me")
})
