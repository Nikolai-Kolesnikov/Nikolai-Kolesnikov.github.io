
document.getElementById("verh").innerHTML = "dynamic 9";
let tg = window.Telegram.WebApp;

let strtrtr = `dynamic 9 ### <br>initData = ${tg.initData}<br>${tg.initDataUnsafe.user.id} ${tg.initDataUnsafe.user.first_name} ${tg.initDataUnsafe.user.last_name}`;
document.getElementById("verh").innerHTML = strtrtr;
