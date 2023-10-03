
document.getElementById("verh").innerHTML = "Прива 4";
let tg = window.Telegram.WebApp;

let strtrtr = `${tg.initDataUnsafe.user.first_name}
${tg.initDataUnsafe.user.last_name}`;
document.getElementById("verh").innerHTML = strtrtr;
