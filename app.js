
document.getElementById("verh").innerHTML = "Прива 2";
let tg = window.Telegram.WebApp;

let p = document.createElement("p");

p.innerText = `Ты кто 3`;
let strtrtr = `${tg.initDataUnsafe.user.first_name}
${tg.initDataUnsafe.user.last_name}`;

document.body.appendChild(p);

