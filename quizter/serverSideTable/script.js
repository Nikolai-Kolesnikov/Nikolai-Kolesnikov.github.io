import {webappRequest} from '/webappRequest.js'; // функция для отправки ajax-запросов

const settingsObj = {
	'userReplies': {
		'_filters': [
			{'_label': 'Вопрос', '_options': {'_query': 'sst_getQuestionsForFilter'}},
		] 
	}
}


function myLog(msg) {
	let curDate = new Date(Date.now());
	logBox.innerText = curDate.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) + ': ' + msg + '\n' + `${logBox.innerText || ''}`;
}

/*function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}*/


//
// LAYOUT
//
let logBox = document.getElementById("logbox");

let filtersContainer = document.createElement('div');
filtersContainer.style.visibility = 'hidden';

let tableContainer = document.createElement('div');

let table = document.createElement('table');

document.getElementById('dynamicDiv').appendChild(filtersContainer);
document.getElementById('dynamicDiv').appendChild(tableContainer);
tableContainer.appendChild(table);
//
// Конец LAYOUT
//
    

myLog('Версия 1');

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
myLog('startappJson = ' + JSON.stringify(startappJson));

// 
try {
	let wareqres = await webappRequest(
		'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
		JSON.stringify({
			'initData': window.Telegram.WebApp.initData, 
			'startappData': startappJson,
			'type': 'getUserRepliesByQuizSendid',
			
		}),
		[1, 2, 2, 5, 5]
	);
	if (((wareqres || {}).data || {}).status == 'OK') {
		let repArr = wareqres.data.data;
		repArr.sort((a, b) => Number(b['replyTimestamp']) - Number(a['replyTimestamp']));
		for (const rep of repArr) {
			addToSubmittedReplies(rep['replyText']);
		}
	} else {
		addToSubmittedReplies('Ошибка загрузки предыдущих ответов!');
	}	
} catch (err) {
	addToSubmittedReplies('Ошибка загрузки предыдущих ответов!');
}
