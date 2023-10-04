
document.getElementById("verh").innerHTML = "dynamic 10";

function isFetchAPISupported() {
    return 'fetch' in window;
}

let tg = window.Telegram.WebApp;

//let strtrtr = `dynamic 10 ### <br>initData = ${tg.initData}<br>${tg.initDataUnsafe.user.id} ${tg.initDataUnsafe.user.first_name} ${tg.initDataUnsafe.user.last_name}`;
let strtrtr = `isFetchAPISupported() = ${isFetchAPISupported()}`;
document.getElementById("verh").innerHTML = strtrtr;
