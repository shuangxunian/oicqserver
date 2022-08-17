"use strict"
const rp = require('request-promise');
const { pinyin } = require('pinyin-pro');
const { segment } = require("oicq")
const { bot } = require("./index")

const { group_token, qq_setTime_token, group_setTime_token } = require("./groupToken")

// 日期信息的缓存，防止请求API次数过多
global.cacheAllDateInfo = ''

// 自动执行函数
const timeoutFunc = (config, func) => {
  config.runNow && func()
  let nowTime = new Date().getTime()
  let timePoints = config.time.split(':').map(i => parseInt(i))
  let recent = new Date().setHours(...timePoints)
  recent >= nowTime || (recent += 24 * 3600000 )
  setTimeout(() => {
		func()
		setInterval(func, config.interval * 3600000)
  }, recent - nowTime)
}

// 获取天气信息
const getWeather = async (city) => {
	try {
		const res = await rp({
			method: 'POST',
			url: 'https://www.tianqiapi.com/free/day?appid=56761788&appsecret=ti3hP8y9&city=' + encodeURI(city),
			body: [],
			json: true // Automatically stringifies the body to JSON
		})
		if (res.errcode === 100) return segment.image('img/2.jpg')
		return city + '今日' + res.wea + '，温度为' + res.tem_night + '-' + res.tem_day + '，当前温度' + res.tem
	} catch (err) {
		return '该城市API不支持'
	}
}


// 获取离发工资还有多少天
const getWage = () => {
	function day(data){
		const days = 3600000 * 24;
		const t = new Date().getTime();
		const x = new Date(data).getTime()
		return Math.round((x-t)/days);
	}
	const getWageDate = ['-01-08', '-02-08', '-03-08', '-04-08', '-05-08', '-06-08', '-07-08', '-08-08', '-09-08', '-09-30', '-11-08', '-12-08', '-01-08']
	for (let i = 0; i < getWageDate.length; i++) {
		const returnDay = day(new Date().getFullYear() + Math.floor(i / 12) + getWageDate[i])
		if (returnDay === 0) {
			return '今天发工资！'
		} else if (returnDay > 0) {
			return `距离发工资还有${returnDay}天！`
		}
	}
	
}


// 获取今天信息
const getTodayInfo = async () => {
	try {
		const res = await rp({
			method: 'GET',
			url: 'http://timor.tech/api/holiday/info',
			body: [],
			json: true // Automatically stringifies the body to JSON
		})
		return res 
	} catch (err) {
		return 'code1 error'
	}
}

// 获取最近的节假日信息
const getNextHoliday = async () => {
	try {
		const res = await rp({
			method: 'GET',
			url: 'http://timor.tech/api/holiday/next',
			body: [],
			json: true // Automatically stringifies the body to JSON
		})
		return res 
	} catch (err) {
		return 'code2 error'
	}
}

// 获取日期信息
const getAllDateInfo = async () => {
	try {
		const todayInfo = await getTodayInfo()
		const nextHoliday = await getNextHoliday()
		const date = new Date()
		const today = date.toISOString().split('T')[0]
		const week = date.getDay()
		const weekText = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
		const fixDay = ['工作日', '周末', '节日', '调休']
		global.cacheAllDateInfo  = `今天是${today}，${weekText[week]}，是${fixDay[todayInfo.type.type]}，离得最近的假期是${nextHoliday.holiday.name}，还有${nextHoliday.holiday.rest}天。`
	} catch (error) {
		bot.pickFriend(2749909223).sendMsg(error)
	}
}

// 每日发送的消息
const pushUserInfo = async () => {
	const qqToken = qq_setTime_token || []
	if (!global.cacheAllDateInfo) await getAllDateInfo()
	for (let i = 0; i < qqToken.length; i++) {
		let msg = qqToken[i].hello
		if (qqToken[i].weather) {
			msg = msg + await getWeather(qqToken[i].weather) + '，'
		}
		const haveFun = qqToken[i].haveFun
		// 日历
		if (haveFun.includes(0)) {
			msg = msg + global.cacheAllDateInfo 
		}
		// 工资
		if (haveFun.includes(1)) { 
			msg = msg + getWage()
		}
		try {
			bot.pickFriend(qqToken[i].qq).sendMsg(msg)
		} catch (error) {
			bot.pickFriend(2749909223).sendMsg(error)
		}
	}
}

// 每日发送的群消息
const pushGroupInfo = async () => {
	const groupToken = group_setTime_token || []
	if (!global.cacheAllDateInfo) await getAllDateInfo()
	for (let i = 0; i < groupToken.length; i++) {
		let msg = groupToken[i].hello
		if (groupToken[i].weather) {
			msg = msg + await getWeather(groupToken[i].weather) + '，'
		}
		const haveFun = groupToken[i].haveFun
		// 日历
		if (haveFun.includes(0)) {
			msg = msg + global.cacheAllDateInfo 
		}
		// 工资
		if (haveFun.includes(1)) { 
			msg = msg + getWage()
		}
		try {
			bot.sendGroupMsg(groupToken[i].group,sendMsg(msg))
		} catch (error) {
			bot.pickFriend(2749909223).sendMsg(error)
		}
	}
}

// 获取疫情信息
const getEpidemicInfo = async (city) => {
	try {
		const res = await rp({
			method: 'POST',
			url: 'https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf',
			body: [],
			json: true // Automatically stringifies the body to JSON
		})
		return ''
	} catch (err) {
		return 'API不支持'
	}
}

// 今天在学校吃什么
// 先随机生成地点 再根据地点随机该层的吃的
const getSchoolEat = async () => {
	const location = ['南食堂3楼', '南食堂2楼', '南食堂1楼', '南区女寝对面食堂']
	const recipeMap = {
		'南食堂3楼': [
			'排骨米饭', '香麻鸡', '牛扒饭', '锡纸烧', '钢盆拌饭', '四川风味', '牛肉板面', '鸡腿拌饭', '麻辣江湖', 
			'羊杂面', '懒人闷饭', '酸辣苕粉', '鸡排饭', '铁板煎肉饭', '重庆豌杂面', '边家传人饺子', '欢乐小火锅', '麻辣烫麻辣拌麻辣香锅', 
			'憨小猪猪脚饭', '食全食美', '花甲粉', '兰州拉面', '烤肉饭', '馋嘴鱼', '干锅砂锅', '美食丰味'
		],
		'南食堂2楼': [
			'啵啵鱼', '猪脚饭', '云吞面', '西安牛肉拉面', '三胖子快餐', '烤盘饭', '牛排饭', '东北菜套餐', '面夫子', 
			'盛京大碗面', '学友快餐部', '韩国料理', '江湖鱼', '马玛李全国连锁', '自选快餐', '自选炸串', '麻辣烫', '小碗蒸菜', '重庆鸡公煲', '自助火锅',
		],
		'南食堂1楼': [
			'食全套餐', '杭州小笼包肠粉', '青竹快餐', '韩式拌饭', '咖喱饭', '和味快餐', '鸡腿烤肉饭', '掉渣饼', '鸡汁鲜肉饭', '淮南牛肉汤', 
			'汤香米粉米线', '小胖哥麻辣烫', '竹筒煎肉饭', '老祁头铁板炒肉炒饭', '日式风味', '羊杂面', '四川风味', '抻面', '一九八零锡纸饭', '风味小馄饨'
		],
		'南区女寝对面食堂': [
			'肯德基', '自选快餐', '盒饭'
		]
	}
	const where = location[Math.floor(Math.random()*location.length)]
	const what = recipeMap[where][Math.floor(Math.random()*recipeMap[where].length)]
	return where + what
}

// 机器人能做什么
const botCanDo = () => {
	return '可以询问（地点）天气，请问（学校问题），今天在学校吃什么，今天吃什么，今天吃什么好的等问题，均可以回答'
}

// 今天吃什么
const getEat = () => {
	const recipeArr = [
		'冒菜', '海南鸡饭', '悟粉', '重庆小面', '蒸饺', '水饺', '猪脚饭', '尚品佳味', '原牛道', '蒸菜', '尊宝披萨', '臻食荟', '五谷渔粉', '铁板烧', '麦当劳', '肯德基', '必胜客', '赛百味', '华莱士', '赛百味', 
	]
	return recipeArr[Math.floor(Math.random()*recipeArr.length)]
}
// 今天吃什么好的
const getGoodEat = () => {
	const recipeArr = [
		'烤肉', '海底捞', '小龙坎', '必胜客', '外婆家', '川菜', '铁锅炖', '肉串', '家常炒菜', '自助烤肉', '自助火锅', '汉巴味德', '酸菜鱼'
	]
	return recipeArr[Math.floor(Math.random()*recipeArr.length)]
}

// 今天喝什么
const getDrink = () => {
	const recipeArr = [
		'一点点', '茶百道', '蜜雪冰城', '星巴克', '喜茶', '奈雪の茶', '瑞幸'
	]
	return recipeArr[Math.floor(Math.random()*recipeArr.length)]
}



const options = {
  method: 'POST',
  url: 'http://localhost:5000/getss',
  body: [],
  json: true // Automatically stringifies the body to JSON
};

const conMap = [
	['学校在哪','地理位置'],
	['学校地址是什么','地理位置'],
	['你是不是出问题了','你在狗叫什么'],
	['你有几个对象','你在狗叫什么'],
	['你相过几次亲','你在狗叫什么'],
	['怎么狗叫','你在狗叫什么'],
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
	['代码','代码'],
	['学校的床多大','床'],
	['学校多大','学校大小'],
	// ['',''],
]

const reqMap = {
	'地理位置': '地址是辽宁省沈阳市沈北新区道义南大街37号，周边是沈师、辽大、辽传、工程，学校所在的沈北新区不算郊区，交通方便，按照地理位置分为南北区，只有一个校区，南区北区说的是南生活区、北生活区，简称南区北区，步行大概十分钟的距离，宿舍楼有高有矮，高层有电梯，快递驿站南北区都有',
	'你在狗叫什么': segment.image('img/2.jpg'),
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
	'赞助': segment.image("https://api2.mubu.com/v3/document_image/b82c48b0-c46a-49d0-a677-523355524518-3807603.jpg"),
	'代码': '代码在github上，仓库是：shuangxunian/oicqserver，欢迎点个star哦~',
	'床': '学校的床是190*90的~',
	'学校大小': '学校占地面积1731.63亩，建筑面积82.96万平方米，固定资产总值23.49亿元，教学科研仪器设备总值6.42亿元。图书馆入藏纸质、电子图书共计210万余册。各类在校学生2万余人。',
	// '': '',
}

const getArr = async (text) => {
	const arr = []
	for (let i = 0; i < conMap.length; i++) {
		arr.push([text,conMap[i][0]])
	}
	options.body = arr
	const conIndex = await rp(options)
	if (conIndex === -1) return '我不知道你在说什么'
	else return reqMap[conMap[conIndex][1]]
}

const getReturnGroup = async (text, groupId) => {
	const thisToken = group_token[groupId] || []
	let res = ''
	if ( /天气$/.test(text) && thisToken.includes(1)) {
		res = await getWeather(text.split('天气')[0])
	} else if ( /^请问/.test(text) && thisToken.includes(0)) {
		res = await getArr(text)
	} else if ( /疫情$/.test(text) &&  thisToken.includes(2)) {
		// res = await getEpidemicInfo(text.split('疫情')[0]), true
	} else if (text === '今天在学校吃什么' &&  thisToken.includes('sauFood')) {
		res = await getSchoolEat()
	} else if (text === '机器人功能') {
		res = botCanDo()
	} else if (text === '今天吃什么' && thisToken.includes('todayEat')) {
		res = getEat()
	} else if (text === '今天吃什么好的' && thisToken.includes('todayEatGood')) {
		res = getGoodEat()
	} else if (text === '今天喝什么' && thisToken.includes('todayDrink')) {
		res = getDrink()
	} else if (text === 'wlsnb!' || text === 'wlsnb') {
		res = segment.image('img/2.jpg')
	} else if (text === '今日情况') {
		res = global.cacheAllDateInfo
	}
	return res
}


exports.getWeather = getWeather
exports.getAllDateInfo = getAllDateInfo
exports.getArr = getArr
exports.getWage = getWage
exports.timeoutFunc = timeoutFunc
exports.pushUserInfo = pushUserInfo
exports.getEpidemicInfo = getEpidemicInfo
exports.getSchoolEat = getSchoolEat
exports.botCanDo = botCanDo
exports.getEat = getEat
exports.getGoodEat = getGoodEat
exports.getDrink = getDrink
exports.pushGroupInfo = pushGroupInfo
exports.getReturnGroup = getReturnGroup







// exports.cacheAllDateInfo = cacheAllDateInfo




