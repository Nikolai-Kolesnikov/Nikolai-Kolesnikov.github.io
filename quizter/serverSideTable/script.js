import {webappRequest} from '/webappRequest.js'; // функция для отправки ajax-запросов

const settingsObj = {
	'userReplies': {
		'_filters': [
			{
				'_filterid': 'quizSendid',
				'_label': 'Вопрос', 
				'_options': {
					'_getQuery': {
						'_name': 'getQuestionsByEventid',
						'_labelKey': 'qstnName',
						'_valueKey': 'quizSendid',
					},
					'_selectQuery': {
						'_name': 'getRepliesFromAllUsersByQuizSendid',
						'_key': 'quizSendid',
						'_onSuccess': 'RENDER_TABLE',
					}
				},
			},
		],
		'_table': {
			'_rowidDataKey': 'replyid',
			'_columns': [
				{
					'_label': 'Ответ',
					'_dataKey': 'replyText',
					'_parsingType': '',	
					'_width': '80%',			
				},
				{
					'_label': '',
					'_parsingType': 'TOGGLE4',
					'_toggle4': {'SOFT': 'isCorrectAuto', 'FIRM': 'isCorrectManual'},
					'_queryOnInput': {
						'_name':'updateUserReply',
						'_rowidName': 'replyid',
						'_key': 'isCorrectManual',
						'_value': 'CHECKED',
					},
					'_width': '20%',	
				},
			],
		},
	},
}


function myLog(msg) {
	let curDate = new Date(Date.now());
	logBox.innerText = curDate.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) + ': ' + msg + '\n' + `${logBox.innerText || ''}`;
}

/*function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}*/

async function onFilterChange(evt) {
	let filterid = evt.target.getAttribute('data-filterid');
	let filterObj;
	for (const f of settingsObj[startappJson['action']]['_filters']) {
		if (f['_filterid'] == filterid) {
			filterObj = f;
			break;
		};
	}
	try {
		let rData = {
			'initData': window.Telegram.WebApp.initData, 
			'startappData': startappJson,
			'type': filterObj['_options']['_selectQuery']['_name'],
			'data': {},	
		}
		rData['data'][filterObj['_options']['_selectQuery']['_key']] = evt.target.value;
		let wareqres = await webappRequest(
			'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
			JSON.stringify(rData),
			[1, 2, 2, 5, 5]
		);
		if (((wareqres || {}).data || {}).status == 'OK') {
			myLog(JSON.stringify(wareqres.data.data));
			switch (filterObj['_options']['_selectQuery']['_onSuccess']) {
				case 'RENDER_TABLE':
					renderTable(wareqres.data.data);
					break;
			}			
		} else {
			myLog(`Ошибка загрузки! Запрос ${filterObj['_options']['_selectQuery']['_name']}`);
		}	
	} catch (err) {
		myLog(`Ошибка загрузки! Запрос ${filterObj['_options']['_selectQuery']['_name']}`);
	}
}

function renderTable(data) {
	while (table.rows.length > 0) table.deleteRow(-1);
	for (const dataRow of data) {
		let row = table.insertRow();
		for (const column of settingsObj[startappJson['action']]['_table']['_columns']) {
			let cell = row.insertCell();
			if (column['_dataKey'] || column['_parsingType']) {
				switch (column['_parsingType']) {
					case  '':
					case undefined:
					case null:
						cell.innerText = dataRow[column['_dataKey']];
						break;
					case 'TOGGLE4':
						{
							let label = document.createElement('label');
							label.className = 'switch';
							cell.appendChild(label);
							let checkbox = document.createElement('input');
							checkbox.setAttribute(
								'data-rowid', 
								dataRow[settingsObj[startappJson['action']]['_table']['_rowidDataKey']]
							);
							checkbox.type = 'checkbox';
							if (
								typeof column['_queryOnInput'] === 'object' &&
								!Array.isArray(column['_queryOnInput']) &&
								column['_queryOnInput'] !== null
							) {
								checkbox.setAttribute('data-queryOnInput-name', column['_queryOnInput']['_name']);
								checkbox.setAttribute('data-queryOnInput-rowidName', column['_queryOnInput']['_rowidName']);
								checkbox.setAttribute('data-queryOnInput-key', column['_queryOnInput']['_key']);
								checkbox.setAttribute('data-queryOnInput-value', column['_queryOnInput']['_value']);
							}
							if (dataRow[column['_toggle4']['FIRM']] === true) {
								checkbox.checked = true;
								checkbox.setAttribute('data-clicked', 'clicked');
							} else if (dataRow[column['_toggle4']['FIRM']] === false) {
								checkbox.checked = false;
								checkbox.setAttribute('data-clicked', 'clicked');
							} else if (dataRow[column['_toggle4']['SOFT']] === true) {
								checkbox.checked = true;
								checkbox.setAttribute('data-clicked', 'no');
							} else if (dataRow[column['_toggle4']['SOFT']] === false) {
								checkbox.checked = false;
								checkbox.setAttribute('data-clicked', 'no');
							}
							checkbox.addEventListener(
								'click', 
								async (evt) => {
									let checkboxClicked = evt.currentTarget;
									let queryName = checkboxClicked.getAttribute('data-queryOnInput-name');
									let rowidName = checkboxClicked.getAttribute('data-queryOnInput-rowidName');
									let keyToSet = checkboxClicked.getAttribute('data-queryOnInput-key');
									let valueToSet = checkboxClicked.getAttribute('data-queryOnInput-value');
									if (valueToSet == 'CHECKED') {
										valueToSet = checkboxClicked.checked;
									}

									if (queryName) {
										checkboxClicked.disabled = true;
										try {
											let rData = {
												'initData': window.Telegram.WebApp.initData, 
												'startappData': startappJson,
												'type': queryName,
												'data': {},
											};
											rData['data'][rowidName] = checkboxClicked.getAttribute('data-rowid');
											rData['data'][keyToSet] = valueToSet;
											
											let wareqres = await webappRequest(
												'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
												JSON.stringify(rData),
												[1, 2, 2, 5, 5]
											);
											if (((wareqres || {}).data || {}).status == 'OK') {
												checkboxClicked.setAttribute('data-clicked', 'clicked');
											} else {
												checkboxClicked.checked = !checkboxClicked.checked;
												myLog(`Ошибка загрузки! Запрос ${queryName}`);
											}	
										} catch (err) {
											checkboxClicked.checked = !checkboxClicked.checked;
											myLog(`Ошибка загрузки! Запрос ${queryName}`);
										}
										checkboxClicked.disabled = false;
									} else {
										// Если не надо делать запрос на сервер, то сразу ставим атрибут 'clicked'
										checkboxClicked.setAttribute('data-clicked', 'clicked');
									}
								}
							);
							label.appendChild(checkbox);
							let span = document.createElement('span');
							span.className = 'slider round';
							label.appendChild(span);
						}
						break;
				}
			}
		}
	}
}

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
    

myLog('Версия 15');

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

// Добавляем блок "фильтры" исходя из параметров startappJson
for (const filterObj of settingsObj[startappJson.action]['_filters']) {
	if (filtersContainer.style.visibility == 'hidden') {
		filtersContainer.style.visibility = 'visible';
	}
	let label = document.createElement('span');
	label.innerText = filterObj['_label'];
	filtersContainer.appendChild(label);
	let selectElm = document.createElement('select');
	selectElm.setAttribute('data-filterid', filterObj['_filterid']);
	selectElm.addEventListener('change', onFilterChange);
	filtersContainer.appendChild(selectElm);
	try {
		let wareqres = await webappRequest(
			'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
			JSON.stringify({
				'initData': window.Telegram.WebApp.initData, 
				'startappData': startappJson,
				'type': filterObj['_options']['_getQuery']['_name'],
				
			}),
			[1, 2, 2, 5, 5]
		);
		myLog(`${filterObj['_options']['_getQuery']['_name']}: wareqres = ${JSON.stringify(wareqres)}`);
		if (((wareqres || {}).data || {}).status == 'OK') {
			for (const optionObj of wareqres.data.data) {
				let optionElm = document.createElement('option');
				optionElm.value = optionObj[filterObj['_options']['_getQuery']['_valueKey']];
				optionElm.innerText = optionObj[filterObj['_options']['_getQuery']['_labelKey']];
				selectElm.appendChild(optionElm);
			}
		} else {
			myLog(`Ошибка загрузки! Запрос ${filterObj['_options']['_getQuery']['_name']}`);
		}	
	} catch (err) {
		myLog(`Ошибка загрузки! Запрос ${filterObj['_options']['_getQuery']['_name']}`);
	}
}




