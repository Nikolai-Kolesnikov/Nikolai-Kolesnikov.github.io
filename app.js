
document.getElementById("verh").innerHTML = "dynamic 22";

/*async function sendUserAnswer(answer) {
    let ret;
    let response = await fetch("https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf", {
        method: 'post',
        body: answer,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    let responseJson = await response.json();
    ret = JSON.stringify(responseJson);
    document.getElementById("verh").innerHTML = ret;
    return ret;
}*/

fetch("https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf", {
    method: 'post',
    body: JSON.stringify({'answer':'kuku'}),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})
.then((response) => {
    document.getElementById("sverh").innerHTML = 'получен response';
    return response.json();
})
.then((res) => {
    document.getElementById("verh").innerHTML = JSON.stringify(res);
})
.catch((error) => {
   document.getElementById("verh").innerHTML = error;
})
;

let tg = window.Telegram;

