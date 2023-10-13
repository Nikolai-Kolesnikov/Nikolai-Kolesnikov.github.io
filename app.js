
document.getElementById("verh").innerHTML = "dynamic 33<br>";

let tg = window.Telegram;

async function sendUserAnswer(answer) {
    let ret;
    try {
        let response = await fetch("https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf", {
            method: 'post',
            body: answer,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        });
        let responseJson = await response.json();
        ret = JSON.stringify(responseJson);
    } catch (err) {
        ret = err;
    }
    //document.getElementById("verh").innerHTML = ret;
    return ret;
}
let sendResult = await sendUserAnswer(JSON.stringify({'otvet': 'kuku'}));
document.getElementById("verh").innerHTML += sendResult;

/*fetch("https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf", {
    method: 'post',
    body: JSON.stringify({'otvet': 'kuku'}),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
    },
})
.then((response) => {
    document.getElementById("verh").innerHTML += `получен response. response.headers = ${JSON.stringify(response.headers)} <br> response.statusText = ${response.statusText}`;
    
    return response.json();
})
.then((res) => {
    document.getElementById("verh").innerHTML += JSON.stringify(res);
})
.catch((error) => {
   document.getElementById("verh").innerHTML += error;
})
;*/


