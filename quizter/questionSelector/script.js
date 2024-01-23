// script.js 
let data = [];
let logBox = document.getElementById("logbox");
logBox.innerText = 'Версия 17';

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
	row.addEventListener("click", (e) => {
		logBox.innerText = "row clicked: " + e.currentTarget.rowIndex + "\n" + logBox.innerText;
		expandRow(e.currentTarget);
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

// Развернуть строку: добавить под ней строку со вложенной таблицей для отображения подробностей
function expandRow(rowToExpand) {
	let extraRow = table.insertRow(rowToExpand.rowIndex);
	let c = extraRow.insertCell(0);
	c.colSpan = 4;
	c.innerText = "Добавленная строка";
	
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



import {webappRequest} from '/webappRequest.js'; // функция для отправки ajax-запросов
let wareqRes = await webappRequest(
	'https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf', 
	JSON.stringify({'initData': window.Telegram.WebApp.initData, 'type': 'requestQuestionsList'}),
	[1, 2, 2, 5, 5]
);
data = wareqRes['data'];
//logBox.innerText = JSON.stringify(data) + '\nДанные загрузились!\n' + logBox.innerText;

// Initiate table
renderTable();


