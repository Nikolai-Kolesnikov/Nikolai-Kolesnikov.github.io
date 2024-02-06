// script.js 

let logBox = document.getElementById("logbox");
function myLog(msg) {
	let curDate = new Date(Date.now());
	logBox.innerText = curDate.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) + ': ' + msg + '\n' + `${logBox.innerText || ''}`;
}

myLog('Версия 90');

//myLog('window.Telegram.WebApp.initDataUnsafe.start_param = ' + window.Telegram.WebApp.initDataUnsafe.start_param);
//myLog('window.location.search = ' + window.location.search);


import {webappRequest} from '/webappRequest.js'; // функция для отправки ajax-запросов



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
		],
		'assetColumns': ['content', 'editAsset', 'eraseAsset'],
		'queries': {
			'getList': {name: 'requestQuestionsList'},
			'getAssets': {name: 'requestQuestionAssets', rowidName: 'qstnid'},
			'editAsset': {name: 'selectQuestionAssetToEdit', rowidName: 'qstnid'},
			'eraseAsset': {name: 'eraseQuestionAsset', rowidName: 'qstnid'},
			
		},		
	},
};

let searchableColumns = [];
for (const column of settingsObj[startappJson.action]['columns']) {
	if (column['searchable'] == 'yes') searchableColumns.push(column.dataKey);
}


let data = [];

let flag = {};

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

document.getElementById("searchInput").addEventListener("keyup", (e) => {
	searchItems(e.currentTarget.value.toLowerCase());
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
		expandRow(evt.currentTarget);
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
					let tempDateTime = new Date(e[column.dataKey]);
					cell.innerText = tempDateTime.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
					break;
			}
		}
		switch (column.control) {
			case 'expandRow':
				cell.innerText = 'v';
				break;
		}
	} 	
}

// Развернуть строку: добавить под ней строку со вложенной таблицей для отображения подробностей и загрузить в неё данные.
// Если подстрока уже создана, то изменить её видимость.
async function expandRow(rowToExpand) {
	if (rowToExpand.getAttribute("data-expanded") == "yes") {
		table.rows[rowToExpand.rowIndex + 1].style.visibility = table.rows[rowToExpand.rowIndex + 1].style.visibility == "collapse" ? "visible" : "collapse";
		return;
	}
	rowToExpand.setAttribute("data-expanded", "yes");
	let rowid = rowToExpand.getAttribute("data-rowid");
	let extraRow = table.insertRow(rowToExpand.rowIndex + 1);
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

	for (const cell of contentCells) {
		let assetType = cell.getAttribute("data-assetType");
		cell.innerHTML = '';
		for (const imgType of ["photo", "animation_img", "sticker_img"]) {
			cell.innerHTML += `${
				assets[assetType][imgType] ? 
				`<img src="https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf?initData=${encodeURIComponent(window.Telegram.WebApp.initData)}&type=getFileFromBot&fileId=${assets[assetType][imgType]}" />` : 
				''
			}`;
		}

		for (const videoType of ["video", "video_note", "animation_video", "sticker_video"]) {
			cell.innerHTML += `${
				assets[assetType][videoType] ? 
				`<video width="200" controls>
				<source src="https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf?initData=${encodeURIComponent(window.Telegram.WebApp.initData)}&type=getFileFromBot&fileId=${assets[assetType][videoType]}">
				Your browser does not support the video tag.
				</video>` : 
				``
			}`;
		}

		for (const audioType of ["audio", "voice"]) {
			cell.innerHTML += `${
				assets[assetType][audioType] ? 
				`<audio controls>
				<source src="https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf?initData=${encodeURIComponent(window.Telegram.WebApp.initData)}&type=getFileFromBot&fileId=${assets[assetType][audioType]}">
				Your browser does not support the audio tag.
		  		</audio>` : 
				``
			}`;
		}

		cell.innerHTML += `${assets[assetType]["document"] ? 
			`<a href="https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf?initData=${encodeURIComponent(window.Telegram.WebApp.initData)}&type=getFileFromBot&fileId=${assets[assetType]["document"]}">Документ</a>` : 
			''
		}`;

		cell.innerHTML += `${assets[assetType]["text"] ? `${assets[assetType]["text"]}` : ''}`;
		
		if (cell.innerHTML == '') cell.innerText = 'не определено';
	}
		
	//myLog(JSON.stringify(assets));
	
	
}

// Clear the table before updation 
function removeTable() { 
	while (table.rows.length > 1) table.deleteRow(-1); 
} 

function renderTable() {
	data.map((e) => {
		
		if (!e.filteredOut) {
			myLog(`e.filteredOut = ${e.filteredOut}. Добавляем.`);
			addItem(e);
		} else {
			myLog(`e.filteredOut = ${e.filteredOut}. НЕ добавляем.`);
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
	data.map((e) => { 
		let includes = false;
		for (const column of searchableColumns) {
			includes = includes || e[column].toLowerCase().includes(searchStr);			
		}
		e.filteredOut = !includes;
		//myLog(e.filteredOut);
	}); 

	removeTable(); 
	renderTable(); 
} 

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
//myLog(JSON.stringify(data) + '\nДанные загрузились!');


// Initiate table
renderTable();


