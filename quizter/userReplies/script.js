import {webappRequest} from '/webappRequest.js'; // функция для отправки ajax-запросов

let logBox = document.getElementById("logbox");
function myLog(msg) {
	let curDate = new Date(Date.now());
	logBox.innerText = curDate.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) + ': ' + msg + '\n' + `${logBox.innerText || ''}`;
}

myLog('Версия 1');

//
// LAYOUT
//
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

document.getElementById('dynamicDiv').appendChild(replyInput);
document.getElementById('dynamicDiv').appendChild(replySubmitBtn);
//
// Конец LAYOUT
//
    



function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
//myLog('startappJson = ' + JSON.stringify(startappJson));
