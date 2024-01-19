// script.js 

// For edit item 
let index = -1; 
const table = document.getElementById("table"); 

// For sorting ascending or descending 
const flag = { qstnName: false, modifiedAt: false, rubric: false }; 
let data = [ 
	{ qstnName: "вопрос про драконов 2", modifiedAt: "17.01.2024 12:43", rubric: "фэнтези" }, 
	{ qstnName: "задачка с бассейном", modifiedAt: "14.01.2024 11:21", rubric: "логиматика" }, 
	{ qstnName: "вопрос про хоббитов", modifiedAt: "16.01.2024 09:19", rubric: "фэнтези" }, 
	{ qstnName: "новогодний вопрос", modifiedAt: "31.12.2023 15:53", rubric: "" }, 
	
]; 

// To create table 
function addItem(e, i) { 
	let row = table.insertRow(i + 1); 
	let c0 = row.insertCell(0); 
	let c1 = row.insertCell(1); 
	let c2 = row.insertCell(2); 
	let c3 = row.insertCell(3); 
	c0.innerText = e.qstnName; 
	c1.innerText = e.modifiedAt; 
	c2.innerText = e.rubric; 
	c3.innerHTML = "v"; 
	c3.classList.add("zoom"); 
	//c3.addEventListener("click", () => edit(c3, i)); 
	
} 

// Traverse and insert items to table 
data.map((e, i) => addItem(e, i)); 

// For sorting in different cases 
function sortItems(title) { 
	remove(); 
	switch (title) { 
		case "qstnName":
		case "rubric":
		case "modifiedAt":
			data.sort((a, b) => { 
				let fa = a[title].toLowerCase(), 
				fb = b[title].toLowerCase(); 
		
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
		
			
	} 
	data.map((e, i) => addItem(e, i)); 
} 

// Clear the table before updation 
function remove() { 
	while (table.rows.length > 1) table.delete(-1); 
} 



// To search and filter items 
function searchItems() { 
	let input = document 
		.getElementById("searchInput") 
		.value.toLowerCase(); 
	let filterItems = data.filter((e) => { 
		return ( 
			e.qstnName.toLowerCase().includes(input)
		); 
	}); 

	remove(); 
	filterItems.map((e, i) => addItem(e, i)); 
} 

