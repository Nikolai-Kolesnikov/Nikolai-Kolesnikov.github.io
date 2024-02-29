import {webappRequest} from '/webappRequest.js'; // функция для отправки ajax-запросов


function myLog(msg) {
	let curDate = new Date(Date.now());
	logBox.innerText = curDate.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) + ': ' + msg + '\n' + `${logBox.innerText || ''}`;
}

/*function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}*/

async function onReplySubmitBtnClick(btn, evt) {
	let replyText = replyInput.value;
	replyInput.value = '';
	try {				
		if (replyText || replyText === 0) {
			let wareqres = await webappRequest(
				'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
				JSON.stringify({
					'initData': window.Telegram.WebApp.initData, 
					'startappData': startappJson,
					'type': 'submitUserReply',
					'data': {'userReplyText': replyText}
				}),
				[1, 2, 2, 5, 5]
			);
			if (((wareqres || {}).data || {}).status == 'OK') {
				addToSubmittedReplies(replyText);
			} else {
				replyInput.value = replyText;
				let errorMsg = 'Ошибка отправки ответа!';
				switch (((wareqres || {}).data || {}).error) {
					case 'QUIZ_REPLIES_DEADLINE_EXPIRED':
						errorMsg += ' Закончилось время для подачи ответа.'
						break;
				}
				addToSubmittedReplies(errorMsg);
			}
		}
	} catch (err) {
		replyInput.value = replyText;
		addToSubmittedReplies('Ошибка отправки ответа!');
		myLog(`onReplySubmitBtnClick(btn, evt): ERROR = ${err.toString()}`);
	}

}

function addToSubmittedReplies(replyText) {
	submittedRepliesHeading.style.visibility = 'visible';
	let rdiv = document.createElement('div');
	rdiv.innerText = replyText;
	submittedRepliesDiv.prepend(rdiv);
}

//
// LAYOUT
//
let logBox = document.getElementById("logbox");

let replyFormHeading = document.createElement('div');

let replyInput = document.createElement("textarea");
// Делаем, чтобы textarea для ввода ответа стала auto resize
// Source: https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
replyInput.setAttribute("style", "height:16px;overflow-y:hidden;");
//answerInputElm.setAttribute("style", "height:" + (answerInputElm.scrollHeight) + "px;overflow-y:hidden;");
replyInput.addEventListener("input", OnInput, false);
function OnInput() {
  this.style.height = 0;
  this.style.height = (this.scrollHeight) + "px";
}

let replySubmitBtn = document.createElement("button");
replySubmitBtn.innerHTML = '>>>';
replySubmitBtn.addEventListener('click', onReplySubmitBtnClick);

let submittedRepliesHeading = document.createElement('div');
submittedRepliesHeading.innerText = 'Вы ответили:';
submittedRepliesHeading.style.visibility = 'hidden';

let submittedRepliesDiv = document.createElement('div');

document.getElementById('dynamicDiv').appendChild(replyFormHeading);
document.getElementById('dynamicDiv').appendChild(replyInput);
document.getElementById('dynamicDiv').appendChild(replySubmitBtn);
document.getElementById('dynamicDiv').appendChild(submittedRepliesHeading);
document.getElementById('dynamicDiv').appendChild(submittedRepliesDiv);
//
// Конец LAYOUT
//
    

myLog('Версия 12');

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

// Получаем из БД предыдущие ответы пользователя на этот вопрос и отображаем их, если они есть
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

// Получаем из БД заголовок формы ответа пользователя для этого вопроса
try {	
	let wareqres = await webappRequest(
		'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
		JSON.stringify({
			'initData': window.Telegram.WebApp.initData, 
			'startappData': startappJson,
			'type': 'getReplyFormHeading',
			
		}),
		[1, 2, 2, 5, 5]
	);
	if (((wareqres || {}).data || {}).status == 'OK') {
		replyFormHeading.innerText = wareqres.data.data || 'Введите Ваш ответ';
	} else {
		replyFormHeading.innerText = 'Введите Ваш ответ';
	}	
} catch (err) {
	replyFormHeading.innerText = 'Введите Ваш ответ';
}


