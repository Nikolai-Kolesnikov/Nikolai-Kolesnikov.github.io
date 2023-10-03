
document.getElementById("verh").innerHTML = "dynamic 6";
let tg = window.Telegram.WebApp;

let strtrtr = `dynamic 6 ### ${tg.initDataUnsafe.user.id} ${tg.initDataUnsafe.user.first_name} ${tg.initDataUnsafe.user.last_name}`;
document.getElementById("verh").innerHTML = strtrtr;
