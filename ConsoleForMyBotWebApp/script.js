import {webappRequest} from '/webappRequest.js'; // функция для отправки ajax-запросов


function myLog(msg) {
	let curDate = new Date(Date.now());
	logBox.innerText = curDate.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) + ': ' + msg + '\n' + `${logBox.innerText || ''}`;
}

//
// LAYOUT
//
let logBox = document.getElementById("logbox");
let mainDiv = document.getElementById("dynamicDiv");


// Выявляем стартовые параметры, с которыми была вызвана webApp, и заносим их в объект startappJson
let startappJson = {};
try {
	let startappStr = window.Telegram.WebApp.initDataUnsafe.start_param || window.location.search;
	startappStr = startappStr.replace("?startapp=", "");
	let startappKVs = startappStr.split('___');
	for (const kv of startappKVs) {
		let kvArr = kv.split('_-_');
		startappJson[kvArr[0]] = kvArr[1];
	}
} catch (err) {	
	myLog('Неверный или отсутствует параметр startapp\n' + err);
}
myLog('4startappJson = ' + JSON.stringify(startappJson));

// Получаем лог сообщений
try {
	let wareqres = await webappRequest(
		'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
		JSON.stringify({
            'bot': 'ConsoleForMyBot',
			'initData': window.Telegram.WebApp.initData, 
			'startappData': startappJson,
			'type': 'requestMsgLog',
			
		}),
		[1, 2, 2, 5, 5]
	);
	if (((wareqres || {}).data || {}).status == 'ok') {
		let entries = wareqres.data.data;
		//repArr.sort((a, b) => Number(b['replyTimestamp']) - Number(a['replyTimestamp']));
		for (const entry of entries) {
			mainDiv.innerText = (mainDiv.innerText || '') + entry.timestamp + (entry.event == 'out msg' ? '📤' : (entry.event == 'in msg' ? '📥' : '❓'))  + entry.body;
		}
	} else {
		myLog(`ОШИБКА! ${((wareqres || {}).data || {}).error}`);
	}	
} catch (err) {
	myLog(`ОШИБКА! ${err}`);
}