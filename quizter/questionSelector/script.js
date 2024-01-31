// script.js 

let logBox = document.getElementById("logbox");
logBox.innerText = 'Версия 52';



import {webappRequest} from '/webappRequest.js'; // функция для отправки ajax-запросов

let startappJson = {};
try {
	let startappKVs = (window.Telegram.WebApp.initDataUnsafe.start_param).split('___');
	for (const kv of startappKVs) {
		let kvArr = kv.split('_-_');
		startappJson[kvArr[0]] = kvArr[1];
	}

} catch (err) {
	// оставляем startappJson пустым объектом
}

logBox.innerText = JSON.stringify(startappJson) + '\n' + logBox.innerText;

let data = [];


const table = document.getElementById("table"); 

for (const elm of ["qstnName", "rubric", "modifiedAt"]) {
	document.getElementById(elm).addEventListener("click", (e) => {
		//logBox.innerText = e.currentTarget.id + ' fired click event\n' + logBox.innerText;
		sortItems(e.currentTarget.id);		
	});
}

document.getElementById("searchInput").addEventListener("keyup", (e) => {
	searchItems(e.currentTarget.value.toLowerCase());
});


// For sorting ascending or descending 
const flag = { qstnName: false, modifiedAt: false, rubric: false }; 

/*let data = [ 
	{ qstnName: "вопрос про драконов 25", modifiedAt: 1705671948822, rubric: "фэнтези", qstnid: "038be69b-f1cb-4b99-af2d-e5e8a0b7aabc" }, 
	{ qstnName: "задачка с бассейном", modifiedAt: 1705661938822, rubric: "логиматика", qstnid: "545fe30a-09c7-432e-ae8d-2782e7dc2109"  }, 
	{ qstnName: "вопрос про хоббитов", modifiedAt: 1705651928822, rubric: "фэнтези", qstnid: "9cde4925-7ed1-4f51-9580-7fd159844539"  }, 
	{ qstnName: "новогодний вопрос", modifiedAt: 1705641918822, rubric: "", qstnid: "b80abf9b-01c7-42bb-8130-8a6dae3bd2fb"  }, 
	
]; */


// To create table 
function addItem(e) { 
	let row = table.insertRow(); 
	row.setAttribute("data-qstnid", e.qstnid);
	row.setAttribute("data-expanded", "no");
	row.addEventListener("click", (evt) => {
		logBox.innerText = "row clicked: " + evt.currentTarget.rowIndex + "\n" + logBox.innerText;
		expandRow(evt.currentTarget);
	});
	let c0 = row.insertCell(0); 
	let c1 = row.insertCell(1); 
	let c2 = row.insertCell(2); 
	let c3 = row.insertCell(3); 
	c0.innerText = e.qstnName;
	let tempDateTime = new Date(e.modifiedAt);
	c1.innerText = tempDateTime.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }); 
	c2.innerText = e.rubric; 
	c3.innerHTML = "v"; 
	c3.classList.add("zoom"); 
	//c3.addEventListener("click", () => edit(c3, i)); 	
}

// Развернуть строку: добавить под ней строку со вложенной таблицей для отображения подробностей и загрузить в неё данные.
// Если подстрока уже создана, то изменить её видимость.
async function expandRow(rowToExpand) {
	if (rowToExpand.getAttribute("data-expanded") == "yes") {
		table.rows[rowToExpand.rowIndex + 1].style.visibility = table.rows[rowToExpand.rowIndex + 1].style.visibility == "collapse" ? "visible" : "collapse";
		return;
	}
	rowToExpand.setAttribute("data-expanded", "yes");
	let qstnid = rowToExpand.getAttribute("data-qstnid");
	let extraRow = table.insertRow(rowToExpand.rowIndex + 1);
	let c = extraRow.insertCell(0);
	c.colSpan = 4;
	let subTable = document.createElement("table");
	c.appendChild(subTable);
	let stR1 = subTable.insertRow(); // для названия рубрики
	let stR1C1 = stR1.insertCell(); 
	let stR1C2 = stR1.insertCell(); 
	let stR2 = subTable.insertRow(); // для сообщения с описанием рубрики
	let stR2C1 = stR2.insertCell();
	//let stR2C2 = stR2.insertCell();
	let stR3 = subTable.insertRow(); // для "Содержание вопроса"
	let stR3C1 = stR3.insertCell();
	let stR3C2 = stR3.insertCell();
	let stR4 = subTable.insertRow(); // для сообщения с содержанием вопроса
	let stR4C1 = stR4.insertCell();
	//let stR4C2 = stR4.insertCell();
	let stR5 = subTable.insertRow(); // для "Правильный ответ"
	let stR5C1 = stR5.insertCell();
	let stR5C2 = stR5.insertCell();
	let stR6 = subTable.insertRow(); // для сообщения с содержанием правильного ответа
	let stR6C1 = stR6.insertCell();
	//let stR6C2 = stR6.insertCell();	
	
	let wareqRes = await webappRequest(
		'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
		JSON.stringify({
			'initData': window.Telegram.WebApp.initData, 
			'type': 'requestQuestionAssets', 
			'data':{'qstnid': qstnid},
			'startappData': startappJson,
		}),
		[1, 2, 2, 5, 5]
	);
	let assets = wareqRes['data'];

	stR1C2.setAttribute("data-assetType", "rubric");
	stR3C2.setAttribute("data-assetType", "question");
	stR5C2.setAttribute("data-assetType", "answer");
	stR2C1.setAttribute("data-assetKey", "rubricContent");
	stR4C1.setAttribute("data-assetKey", "qstnContent");
	stR6C1.setAttribute("data-assetKey", "answerContent");
	
	stR1C1.innerText = "Рубрика " + (assets.rubricContent.title || "не определена");
	stR3C1.innerText = "Содержание вопроса";
	stR5C1.innerText = "Правильный ответ";
	
	for (const cell of [stR1C2, stR3C2, stR5C2]) {
		cell.rowSpan = 2;
		cell.innerText = "🔘";
		cell.setAttribute("data-qstnid", qstnid);
		cell.addEventListener("click", async (evt) => {
			let selectRes = await webappRequest(
				'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
				JSON.stringify({
					'initData': window.Telegram.WebApp.initData, 
					'type': 'selectQuestionAsset', 
					'data':{
						'qstnid': evt.currentTarget.getAttribute("data-qstnid"), 
						'assetType': evt.currentTarget.getAttribute("data-assetType"),
					},
					'startappData': startappJson,
				}),
				[1, 2, 2, 5, 5]
			);
			
		});
	}

	for (const cell of [stR2C1, stR4C1, stR6C1]) {
		let assetKey = cell.getAttribute("data-assetKey");
		
		for (const imgType of ["photo", "animation_img", "sticker_img"]) {
			cell.innerHTML = `${
				assets[assetKey][imgType] ? 
				`<img alt="🖼⌛" src="https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf?initData=${encodeURIComponent(window.Telegram.WebApp.initData)}&type=getFileFromBot&fileId=${assets[assetKey][imgType]}">` : 
				''
			}`;
		}

		for (const videoType of ["video", "video_note", "animation_video", "sticker_video"]) {
			cell.innerHTML += `${
				assets[assetKey][videoType] ? 
				`<video width="200" controls>
				<source src="https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf?initData=${encodeURIComponent(window.Telegram.WebApp.initData)}&type=getFileFromBot&fileId=${assets[assetKey][videoType]}">
				Your browser does not support the video tag.
				</video>` : 
				``
			}`;
		}

		for (const audioType of ["audio", "voice"]) {
			cell.innerHTML += `${
				assets[assetKey][audioType] ? 
				`<audio controls>
				<source src="https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf?initData=${encodeURIComponent(window.Telegram.WebApp.initData)}&type=getFileFromBot&fileId=${assets[assetKey][audioType]}">
				Your browser does not support the audio tag.
		  		</audio>` : 
				``
			}`;
		}

		cell.innerHTML += `${assets[assetKey]["document"] ? 
			`<a href="https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf?initData=${encodeURIComponent(window.Telegram.WebApp.initData)}&type=getFileFromBot&fileId=${assets[assetKey]["document"]}">Документ</a>` : 
			''
		}`;

		cell.innerHTML += `${assets[assetKey]["text"] ? `${assets[assetKey]["text"]}` : ''}`;
		
	}
		
	logBox.innerText = JSON.stringify(assets) + "\n" + logBox.innerText;
	
}

// Clear the table before updation 
function removeTable() { 
	while (table.rows.length > 1) table.deleteRow(-1); 
} 

function renderTable() {
	data.map((e) => {
		if (!e.filteredOut) addItem(e);
	}); 
}


// For sorting in different cases 
function sortItems(title) {
	//logBox.innerText = `sortItems(${title}) launched\n` + logBox.innerText;
	removeTable(); 
	switch (title) { 
		case "qstnName":
		case "rubric":
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

		case "modifiedAt":
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
		e.filteredOut = !e.qstnName.toLowerCase().includes(searchStr); 
	}); 

	removeTable(); 
	renderTable(); 
} 

let wareqRes = await webappRequest(
	'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
	JSON.stringify({
		'initData': window.Telegram.WebApp.initData, 
		'type': 'requestQuestionsList',
		'startappData': startappJson,
	}),
	[1, 2, 2, 5, 5]
);
data = wareqRes['data'];
//logBox.innerText = JSON.stringify(data) + '\nДанные загрузились!\n' + logBox.innerText;

// Initiate table
renderTable();


