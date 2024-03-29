// script.js 

let logBox = document.getElementById("logbox");
function myLog(msg) {
	let curDate = new Date(Date.now());
	logBox.innerText = curDate.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) + ': ' + msg + '\n' + `${logBox.innerText || ''}`;
}

myLog('Версия 137');

//myLog('window.Telegram.WebApp.initDataUnsafe.start_param = ' + window.Telegram.WebApp.initDataUnsafe.start_param);
//myLog('window.location.search = ' + window.location.search);


import {webappRequest} from '/webappRequest.js'; // функция для отправки ajax-запросов

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


const settingsObj = {
	'selectEventToView': {
		'columns': [
			{dataKey: 'name', name: 'Игра', parsingType: '', width: '45%', sortable: 'alphabetic', searchable: 'yes'},
			{dataKey: 'createdAtUTC', name: 'Создана', parsingType: 'dateTimeString', width: '50%', sortable: 'dateTime'},
			{control: 'selectRow', name: '(_)', width: '5%'},
		],
		'assets': [],
		'assetColumns': [],
		'queries': {
			'getList': {name: 'requestEventsList', rowidName: 'eventid'},
			'selectRow': {name: 'selectEvent', rowidName: 'eventid'},
			
		},		
	},
	'editSending': {
		'columns': [
			{dataKey: 'qstnName', name: 'Вопрос', parsingType: '', width: '40%', sortable: 'alphabetic', searchable: 'yes'},
			{dataKey: 'modifiedAt', name: 'Изменено', parsingType: 'dateTimeString', width: '30%', sortable: 'dateTime'},
			{dataKey: 'rubric', name: 'Рубрика', parsingType: '', width: '20%', sortable: 'alphabetic', searchable: 'yes'},
			{control: 'expandRow', name: '(_)', width: '10%'},

		],
		'assets': [
			{assetType: 'rubricContent', headingText: 'Рубрика'},
			{assetType: 'qstnContent', headingText: 'Содержание вопроса'},
			{assetType: 'answerContent', headingText: 'Правильный ответ'},			
		],
		'assetColumns': ['content', 'selectAsset'],
		'queries': {
			'getList': {name: 'requestQuestionsList'},
			'getAssets': {name: 'requestQuestionAssets', rowidName: 'qstnid'},
			'selectAsset': {name: 'selectQuestionAsset', rowidName: 'qstnid'},
		},		
	},
	'viewQuestions': {
		'columns': [
			{dataKey: 'qstnName', name: 'Вопрос', parsingType: '', width: '40%', sortable: 'alphabetic', searchable: 'yes'},
			{dataKey: 'modifiedAt', name: 'Изменено', parsingType: 'dateTimeString', width: '30%', sortable: 'dateTime'},
			{dataKey: 'rubric', name: 'Рубрика', parsingType: '', width: '20%', sortable: 'alphabetic', searchable: 'yes'},
			{control: 'expandRow', name: '(_)', width: '10%'},
		],
		'assets': [
			{assetType: 'rubricContent', headingText: 'Рубрика'},
			{assetType: 'qstnContent', headingText: 'Содержание вопроса'},
			{assetType: 'answerContent', headingText: 'Правильный ответ'},
			{assetType: 'testingRegexp', headingText: 'Шаблон для проверки ответов'},
			
		],
		'assetColumns': ['content', 'editAsset', 'eraseAsset'],
		'queries': {
			'getList': {name: 'requestQuestionsList'},
			'getAssets': {name: 'requestQuestionAssets', rowidName: 'qstnid'},
			'editAsset': {name: 'selectQuestionAssetToEdit', rowidName: 'qstnid'},
			'eraseAsset': {name: 'eraseQuestionAsset', rowidName: 'qstnid'},
			
		},		
	},
	'viewSendings': {
		'columns': [
			{dataKey: 'quizName', name: 'Квиз', parsingType: '', width: '10%', sortable: 'alphabetic', searchable: 'yes'},
			{dataKey: 'eventName', name: 'Игра', parsingType: '', width: '20%', sortable: 'alphabetic', searchable: 'yes'},
			{dataKey: 'sendingSyntName', name: 'Сообщение', parsingType: '', width: '35%', sortable: 'alphabetic', searchable: 'yes'},
			{dataKey: 'sendingDateTime', name: 'Дата отправки', parsingType: 'dateTimeString', width: '25%', sortable: 'dateTime'},
			{control: 'expandRow', name: '(_)', width: '5%'},
			{control: 'deleteRow', name: '(_)', width: '5%'},
			
		],
		'assets': [
			{assetType: 'sendingContent', headingText: 'Содержание сообщения'},	
		],
		'assetColumns': ['content'],
		'queries': {
			'getList': {name: 'requestSendingsList'},
			'deleteRow': {name: 'deleteSending', rowidName: 'quizSendid'},
			'getAssets': {name: 'requestSendingAssets', rowidName: 'quizSendid'},
			'editAsset': {name: 'selectSendingAssetToEdit', rowidName: 'quizSendid'},
			'eraseAsset': {name: 'eraseSendingAsset', rowidName: 'quizSendid'},
			
		},		
	},
	'viewSendingsForEvent': {
		'aboveTable': [
			{
				type: 'dateTimePicker', 
				params: {min: 'NOW', step: '1'}, 
				label: 'Принимать ответы до:',
				getQuery: {name: 'getEvent', keyToRead: 'repliesAcceptedUntil'}, 
				setQuery: {name: 'updateEvent', keyToSet: 'repliesAcceptedUntil'},
			},
		],
		'columns': [
			{dataKey: 'sendingDateTime', name: 'Дата отправки', parsingType: 'dateTimeString', width: '50%', sortable: 'dateTime'},
			{dataKey: 'sendingSyntName', name: 'Сообщение', parsingType: '', width: '45%', sortable: 'alphabetic', searchable: 'yes'},
			{control: 'expandRow', name: '(_)', width: '5%'},
			{control: 'deleteRow', name: '(_)', width: '5%'},
		],
		'assets': [
			{assetType: 'sendingContent', headingText: 'Содержание сообщения'},	
		],
		'assetColumns': ['content'],
		'queries': {
			'getList': {name: 'requestSendingsList'},
			'deleteRow': {name: 'deleteSending', rowidName: 'quizSendid'},
			'getAssets': {name: 'requestSendingAssets', rowidName: 'quizSendid'},
			'editAsset': {name: 'selectSendingAssetToEdit', rowidName: 'quizSendid'},
			'eraseAsset': {name: 'eraseSendingAsset', rowidName: 'quizSendid'},
			
		},		
	},

};

let searchableColumns = [];
for (const column of settingsObj[startappJson.action]['columns']) {
	if (column['searchable'] == 'yes') searchableColumns.push(column.dataKey);
}
myLog(`searchableColumns = ${JSON.stringify(searchableColumns)}`);


let data = [];

let flag = {};

// Добавляем DOM-элементы, определённые в aboveTable
for (const obj of settingsObj[startappJson.action]['aboveTable']) {
	let div = document.createElement('div');
	document.getElementById('aboveTableDiv').appendChild(div);
	if (obj['type'] == 'dateTimePicker') {
		let label = document.createElement('label');
		label.innerText = obj.label;
		div.appendChild(label);
		let dateTimePicker = document.createElement('input');
		dateTimePicker.type = 'datetime-local';
		dateTimePicker.step = obj.params.step;
		let min = obj.params.min;
		if (min == 'NOW') {
			min = new Date(Date.now()+3*60*60*1000);
			min = min.toISOString();
			min = min.slice(0, -5);
		}
		dateTimePicker.min = min;
		if (obj.getQuery) {
			try {
				let wareqres = await webappRequest(
					'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
					JSON.stringify({
						'initData': window.Telegram.WebApp.initData, 
						'startappData': startappJson,
						'type': obj.getQuery.name,
						
					}),
					[1, 2, 2, 5, 5]
				);
				if (((wareqres || {}).data || {}).status == 'OK') {
					if (wareqres.data.data[obj.getQuery.keyToRead]) {
						let dtValue = new Date(wareqres.data.data[obj.getQuery.keyToRead]);
						dtValue = new Date(dtValue.getTime() + 3*60*60*1000);
						dtValue = dtValue.toISOString();
						dtValue = dtValue.slice(0,-5);	
						dateTimePicker.value = dtValue;		
					}
				} else {
					myLog(`Ошибка загрузки! Запрос ${obj.getQuery.name}`);
				}	
			} catch (err) {
				myLog(`Ошибка загрузки! Запрос ${obj.getQuery.name}`);
			}
		}
		try {
		if (obj.setQuery) {
			dateTimePicker.setAttribute('data-setQuery-name', obj.setQuery.name);
			dateTimePicker.setAttribute('data-setQuery-keyToSet', obj.setQuery.keyToSet);
			dateTimePicker.addEventListener(
				'change', 
				async (evt) => {
					let inputChanged = evt.currentTarget;
					inputChanged.disabled = true;
					let queryName = inputChanged.getAttribute('data-setQuery-name');
					let keyToSet = inputChanged.getAttribute('data-setQuery-keyToSet');
					let valueToSet = inputChanged.value;
					valueToSet = new Date(valueToSet);
					valueToSet = new Date(valueToSet.getTime() - valueToSet.getTimezoneOffset()*60*1000 - 3*60*60*1000);
					valueToSet = valueToSet.toISOString();
					valueToSet = valueToSet.slice(0,-5);
					let rData = {
						'initData': window.Telegram.WebApp.initData, 
						'startappData': startappJson,
						'type': queryName,
						'data': {}
					}
					rData.data[keyToSet] = valueToSet;

					try {
						let wareqres = await webappRequest(
							'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
							JSON.stringify(rData),
							[1, 2, 2, 5, 5]
						);
						if (((wareqres || {}).data || {}).status == 'OK') {
							//
						} else {
							myLog(`Ошибка загрузки! Запрос ${obj.setQuery.name}`);
						}	
					} catch (err) {
						myLog(`Ошибка загрузки! Запрос ${obj.setQuery.name}`);
					}
					inputChanged.disabled = false;
				}
			);
		}
		} catch (err) {
			myLog(err.toString());
		}
		label.appendChild(dateTimePicker);
	}
}


const table = document.createElement('table');
document.getElementById('mainTableDiv').appendChild(table);
let headRow = table.insertRow();
for (const column of settingsObj[startappJson.action]['columns']) {
	let th = document.createElement('th');
	if (column.dataKey) {
		th.id = column.dataKey;
	}
	if (column.sortable) {
		th.setAttribute('data-sortable', column.sortable);
		th.addEventListener("click", (evt) => {
			sortItems(evt.currentTarget.id, evt.currentTarget.getAttribute('data-sortable'));		
		});
		flag[column.dataKey] = false;
	}
	th.style.width = column.width;
	th.innerText = column.name;
	headRow.appendChild(th);
}
//const table = document.getElementById("table"); 

document.getElementById("searchInput").addEventListener("input", (e) => {
	//myLog('searchInput input event triggered');
	//myLog(`e.target.value.toLowerCase() = ${e.target.value.toLowerCase()}`);
	searchItems(e.target.value.toLowerCase());
});


// For sorting ascending or descending 
//const flag = { qstnName: false, modifiedAt: false, rubric: false }; 

/*let data = [ 
	{ qstnName: "вопрос про драконов 25", modifiedAt: 1705671948822, rubric: "фэнтези", qstnid: "038be69b-f1cb-4b99-af2d-e5e8a0b7aabc" }, 
	{ qstnName: "задачка с бассейном", modifiedAt: 1705661938822, rubric: "логиматика", qstnid: "545fe30a-09c7-432e-ae8d-2782e7dc2109"  }, 
	{ qstnName: "вопрос про хоббитов", modifiedAt: 1705651928822, rubric: "фэнтези", qstnid: "9cde4925-7ed1-4f51-9580-7fd159844539"  }, 
	{ qstnName: "новогодний вопрос", modifiedAt: 1705641918822, rubric: "", qstnid: "b80abf9b-01c7-42bb-8130-8a6dae3bd2fb"  }, 
	
]; */


// To create table 
function addItem(e) { 
	//myLog(`addItem(${JSON.stringify(e)})`);
	
	let row = table.insertRow(); 
	row.setAttribute("data-rowid", e.rowid);
	row.setAttribute("data-expanded", "no");
	row.addEventListener("click", (evt) => {
		//myLog("row clicked: " + evt.currentTarget.rowIndex);
		if (!evt.handled) expandRow(evt.currentTarget);
	});
	for (const column of settingsObj[startappJson.action]['columns']) {
		let cell = row.insertCell();
		if (column.dataKey) {
			switch (column.parsingType) {
				case '':
				case undefined:
				case null:
					cell.innerText = e[column.dataKey];
					break;
				case 'dateTimeString':
					if (e[column.dataKey]) {
						let tempDateTime = new Date(e[column.dataKey]);
						cell.innerText = tempDateTime.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
					} else {
						cell.innerText = '❓не определено❗';
					}
					break;
			}
		}
		switch (column.control) {
			case 'expandRow':
				cell.innerText = 'v';
				break;
			case 'deleteRow':
				cell.innerText = 'X';
				cell.setAttribute("data-rowid", e.rowid);
				
				cell.addEventListener('click', async (evt) => {
					evt.handled = true;
					let tempEvtCurrentTarget = evt.currentTarget; // фиксируем evt.currentTarget, т.к. - после применения await - evt.currentTarget обnullится
					try {
						// Подсвечиваем строку, которую пользователь хочет удалить
						let tempbgc = tempEvtCurrentTarget.parentElement.style.backgroundColor;
						tempEvtCurrentTarget.parentElement.style.backgroundColor = "pink";
						await timeout(10); // корявый способ заставить браузер применить стиль до вывода на экран окна confirm
						if (!window.confirm("Удалить сообщение?")) {
							// Если пользователь отменил удаление строки, убираем подсветку
							tempEvtCurrentTarget.parentElement.style.backgroundColor = tempbgc;
							return;
						}

						let rowidClicked = tempEvtCurrentTarget.getAttribute("data-rowid");
						let rData = {};
						rData[settingsObj[startappJson.action]['queries'][column.control]['rowidName']] = rowidClicked;
						let wareqRes = await webappRequest(
							'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
							JSON.stringify({
								'initData': window.Telegram.WebApp.initData,
								'startappData': startappJson,
								'type': settingsObj[startappJson.action]['queries'][column.control]['name'], 
								'data': rData,
								
							}),
							[1, 2, 2, 5, 5]
						);
					
					
						if (wareqRes.data.status = "OK") {
							// Удаляем все строки с атрибутом "data-rowid" == rowidClicked
							let rowiToDelete = [];
							for (const row of table.rows) {
								if (row.getAttribute("data-rowid") == rowidClicked) rowiToDelete.push(row.rowIndex);
							}							
							rowiToDelete.sort(function(a, b) { // Сортируем rowiToDelete как числа по убыванию
								return b - a;
							});
							for (const rowi of rowiToDelete) {
								table.deleteRow(rowi);
							}
							// Удаляем из объекта data
							data.splice(data.findIndex( (entry) => {entry.rowid == rowidClicked} ), 1);
							
							
							
						} else {
							myLog(`deleteRow click: что-то пошло не так.`);
						}
					} catch (err) {
						// TODO выдать сообщение об ошибке
						myLog(err);
					}
				});
				
				break;
			case 'selectRow':
				cell.innerText = '🔘';
				cell.setAttribute("data-rowid", e.rowid);
				
				cell.addEventListener('click', async (evt) => {
					evt.handled = true;
					let tempEvtCurrentTarget = evt.currentTarget; // фиксируем evt.currentTarget, т.к. - после применения await - evt.currentTarget обnullится
					try {
						// Подсвечиваем строку, которую пользователь выбрал
						let tempbgc = tempEvtCurrentTarget.parentElement.style.backgroundColor;
						tempEvtCurrentTarget.parentElement.style.backgroundColor = "green";
						await timeout(10); // корявый способ заставить браузер применить стиль до вывода на экран окна confirm
						
						let rowidClicked = tempEvtCurrentTarget.getAttribute("data-rowid");
						let rData = {};
						rData[settingsObj[startappJson.action]['queries'][column.control]['rowidName']] = rowidClicked;
						let wareqRes = await webappRequest(
							'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
							JSON.stringify({
								'initData': window.Telegram.WebApp.initData,
								'startappData': startappJson,
								'type': settingsObj[startappJson.action]['queries'][column.control]['name'], 
								'data': rData,
								
							}),
							[1, 2, 2, 5, 5]
						);
					
					
						if (wareqRes.data.status = "OK") {
							window.Telegram.WebApp.close();
							
						} else {
							tempEvtCurrentTarget.parentElement.style.backgroundColor = tempbgc;
							myLog(`selectRow click: что-то пошло не так.`);
						}
					} catch (err) {
						// TODO выдать сообщение об ошибке
						myLog(err);
					}
				});
				
				break;
		}
	} 	
}

// Развернуть строку: добавить под ней строку со вложенной таблицей для отображения подробностей (assets) и загрузить в неё данные.
// Если подстрока уже создана, то изменить её видимость.
async function expandRow(rowToExpand) {
	if ((settingsObj[startappJson.action]['assets'] || []).length == 0) return; // Не разворачивать строку, если нет assets
	if (rowToExpand.getAttribute("data-expanded") == "yes") {
		table.rows[rowToExpand.rowIndex + 1].style.visibility = table.rows[rowToExpand.rowIndex + 1].style.visibility == "collapse" ? "visible" : "collapse";
		return;
	}
	rowToExpand.setAttribute("data-expanded", "yes");
	let rowid = rowToExpand.getAttribute("data-rowid");
	let extraRow = table.insertRow(rowToExpand.rowIndex + 1);
	extraRow.setAttribute("data-rowid", rowid);
	let c = extraRow.insertCell(0);
	c.colSpan = settingsObj[startappJson.action]['columns'].length;
	let subTable = document.createElement("table");
	c.appendChild(subTable);

	let contentCells = [];

	for (const assetSettings of settingsObj[startappJson.action]['assets']) {
		let assetHeadingRow = subTable.insertRow();
		let assetContentRow = subTable.insertRow();
		for (const assetColumn of settingsObj[startappJson.action]['assetColumns']) {
			let assetHeadingCell = assetHeadingRow.insertCell();
			assetHeadingCell.setAttribute("data-assetType", assetSettings['assetType']);
			assetHeadingCell.setAttribute("data-assetColumn", assetColumn);
			
			if (assetColumn != 'content') {
				assetHeadingCell.rowSpan = 2;
			} else {
				assetHeadingCell.innerText = assetSettings['headingText'];
				let assetContentCell = assetContentRow.insertCell();
				assetContentCell.setAttribute("data-assetType", assetSettings['assetType']);
				contentCells.push(assetContentCell);		
			}
			if (['selectAsset', 'editAsset'].includes(assetColumn)) {
				assetHeadingCell.setAttribute("data-rowid", rowid);
				assetHeadingCell.addEventListener("click", async (evt) => {
					let rData = {};
					let assetColumnClicked = evt.currentTarget.getAttribute("data-assetColumn");
					rData[settingsObj[startappJson.action]['queries'][assetColumnClicked]['rowidName']] = evt.currentTarget.getAttribute("data-rowid");
					rData['assetType'] = evt.currentTarget.getAttribute("data-assetType");
					let wareqRes = await webappRequest(
						'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
						JSON.stringify({
							'initData': window.Telegram.WebApp.initData, 
							'type': settingsObj[startappJson.action]['queries'][assetColumnClicked]['name'], 
							'data': rData,
							'startappData': startappJson,
						}),
						[1, 2, 2, 5, 5]
					);
					//myLog('wareqRes = ' + JSON.stringify(wareqRes));
					try {
						if (wareqRes.data.status = "OK") {
							window.Telegram.WebApp.close();
						}
					} catch (err) {
						// TODO выдать сообщение об ошибке
					}
				});
			}
			if (assetColumn == 'selectAsset') {
				assetHeadingCell.innerText = "🔘";				
			}
			if (assetColumn == 'editAsset') {
				assetHeadingCell.innerText = "ред.";
			}
		}
	}	
	
	let rData = {};
	rData[settingsObj[startappJson.action]['queries']['getAssets']['rowidName']] = rowid;
	let wareqRes = await webappRequest(
		'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
		JSON.stringify({
			'initData': window.Telegram.WebApp.initData, 
			'type': settingsObj[startappJson.action]['queries']['getAssets']['name'], 
			'data': rData,
			'startappData': startappJson,
		}),
		[1, 2, 2, 5, 5]
	);
	let assets = wareqRes['data'];

	myLog(`assets = ${JSON.stringify(assets)}`);
	myLog(`contentCells = ${JSON.stringify(contentCells)}`);

	for (const cell of contentCells) {
		let assetType = cell.getAttribute("data-assetType");
		let cellHTML = '';
		for (const imgType of ["photo", "animation_img", "sticker_img"]) {
			cellHTML += `${
				assets[assetType][imgType] ? 
				`<img src="https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf?initData=${encodeURIComponent(window.Telegram.WebApp.initData)}&type=getFileFromBot&fileId=${assets[assetType][imgType]}" />` : 
				''
			}`;
		}

		for (const videoType of ["video", "video_note", "animation_video", "sticker_video"]) {
			cellHTML += `${
				assets[assetType][videoType] ? 
				`<video width="200" controls>
				<source src="https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf?initData=${encodeURIComponent(window.Telegram.WebApp.initData)}&type=getFileFromBot&fileId=${assets[assetType][videoType]}">
				Your browser does not support the video tag.
				</video>` : 
				``
			}`;
		}

		for (const audioType of ["audio", "voice"]) {
			cellHTML += `${
				assets[assetType][audioType] ? 
				`<audio controls>
				<source src="https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf?initData=${encodeURIComponent(window.Telegram.WebApp.initData)}&type=getFileFromBot&fileId=${assets[assetType][audioType]}">
				Your browser does not support the audio tag.
		  		</audio>` : 
				``
			}`;
		}

		cellHTML += `${assets[assetType]["document"] ? 
			`<a href="https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf?initData=${encodeURIComponent(window.Telegram.WebApp.initData)}&type=getFileFromBot&fileId=${assets[assetType]["document"]}">Документ</a>` : 
			''
		}`;

		cellHTML += `${assets[assetType]["text"] ? `${assets[assetType]["text"]}` : ''}`;
		
		if (cellHTML == '') {
			cellHTML = 'не определено';
		} else if (assetType == 'qstnContent' || assets[assetType]['msgType'] == 'qstnContent_by_qstnid') {
			cellHTML += `<br><button>${assets[assetType]['replyButtonText'] || 'Ответить >>>'}</button>`;
		}
		cell.innerHTML = cellHTML;
	}
		
	//myLog(JSON.stringify(assets));
	
	
}

// Clear the table before updation 
function removeTable() { 
	myLog(`removeTable() called.`);
	while (table.rows.length > 1) table.deleteRow(-1); 
} 

function renderTable() {
	myLog(`renderTable() called.`);
	
	data.map((e) => {
		
		if (!e.filteredOut) {
			//myLog(`e.filteredOut = ${e.filteredOut}. Добавляем.`);
			addItem(e);
		} else {
			//myLog(`e.filteredOut = ${e.filteredOut}. НЕ добавляем.`);
		}
	}); 
}

// For sorting in different cases 
function sortItems(title, method) {
	//logBox.innerText = `sortItems(${title}) launched\n` + logBox.innerText;
	removeTable(); 
	switch (method) { 
		case "alphabetic":
			data.sort((a, b) => { 
				let fa = (a[title] || '').toLowerCase(), 
				fb = (b[title] || '').toLowerCase(); 
		
				if (fa < fb) { 
					return -1; 
				} 
				if (fa > fb) { 
					return 1; 
				} 
				return 0; 
			}); 
			if (flag[title]) data.reverse(); 
			flag[title] = !flag[title]; 
			break;

		case "dateTime":
			data.sort((a, b) => new Date(a[title]) - new Date(b[title]));
			if (flag[title]) data.reverse(); 
			flag[title] = !flag[title]; 
			break;
			
	} 
	renderTable();
} 

// To search and filter items 
function searchItems(searchStr) { 
	/*let input = document 
		.getElementById("searchInput") 
		.value.toLowerCase(); */
	myLog(`searchItems(${searchStr}) called.`);
	try {
	for (const entry of data) {
		let includes = false;
		for (const column of searchableColumns) {
			includes = (entry[column] || '').toLowerCase().includes(searchStr);		
			if (includes) break;	
		}
		entry.filteredOut = !includes;
	}
	} catch (err) {
		myLog(err);
	} 
	//myLog(`updated DATA = ${JSON.stringify(data)}`);
	removeTable(); 
	renderTable(); 
} 

// Загружаем данные для таблицы
let wareqRes = await webappRequest(
	'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
	JSON.stringify({
		'initData': window.Telegram.WebApp.initData, 
		'type': settingsObj[startappJson.action]['queries']['getList']['name'],
		'startappData': startappJson,
	}),
	[1, 2, 2, 5, 5]
);
data = wareqRes['data'];
if (settingsObj[startappJson.action]['queries']['getList']['rowidName']) {
	data.map((entry) => entry['rowid'] = entry[settingsObj[startappJson.action]['queries']['getList']['rowidName']]);
}
myLog(JSON.stringify(data) + '\nДанные загрузились!');

// Initiate table
renderTable();




