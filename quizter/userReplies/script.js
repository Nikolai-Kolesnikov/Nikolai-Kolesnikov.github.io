import {webappRequest} from '/webappRequest.js'; // функция для отправки ajax-запросов


function myLog(msg) {
	let curDate = new Date(Date.now());
	logBox.innerText = curDate.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) + ': ' + msg + '\n' + `${logBox.innerText || ''}`;
}

/*function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}*/

async function onReplySubmitBtnClick(btn, evt) {
	try {
		let replyText = replyInput.value;
		if (!replyText || replyText == 0) {
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
			if (wareqres.status == 'OK') {
				addToSubmittedReplies(replyText);
			} else {
				addToSubmittedReplies('Ошибка отправки ответа!');
			}
		}
	} catch (err) {
		myLog(`onReplySubmitBtnClick(btn, evt): ERROR = ${err.toString()}`);
	}

}

function addToSubmittedReplies(replyText) {
	let rdiv = document.createElement('div');
	rdiv.innerText = replyText;
	submittedRepliesDiv.prepend(rdiv);
}

//
// LAYOUT
//
let logBox = document.getElementById("logbox");

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

let submittedRepliesDiv = document.createElement('div');


document.getElementById('dynamicDiv').appendChild(replyInput);
document.getElementById('dynamicDiv').appendChild(replySubmitBtn);
document.getElementById('dynamicDiv').appendChild(submittedRepliesDiv);
//
// Конец LAYOUT
//
    

myLog('Версия 3');

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




