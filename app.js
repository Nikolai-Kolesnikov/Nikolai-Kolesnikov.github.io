
document.getElementById("verh").innerHTML = "Прива!";
let tg = window.Telegram.WebApp;



let usercard = document.getElementById("usercard");

let p = document.createElement("p");

p.innerText = `Ты кто 2`;
let strtrtr = `${tg.initDataUnsafe.user.first_name}
${tg.initDataUnsafe.user.last_name}`;

usercard.appendChild(p);

