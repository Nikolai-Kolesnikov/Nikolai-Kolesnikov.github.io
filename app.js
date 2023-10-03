
document.getElementById("verh").innerHTML = "dynamic 7";
let tg = window.Telegram.WebApp;

let strtrtr = `dynamic 7 ### <br>initData = ${tg.initData}<br>${tg.initDataUnsafe.user.id} ${tg.initDataUnsafe.user.first_name} ${tg.initDataUnsafe.user.last_name}`;
document.getElementById("verh").innerHTML = strtrtr;
