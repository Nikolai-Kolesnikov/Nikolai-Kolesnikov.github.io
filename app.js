
document.getElementById("verh").innerHTML = "dynamic 36";

let tg = window.Telegram;

async function sendUserAnswer(answer) {
    let retryIntervals = [1, 2, 2, 5, 5];
    let retryCount = 0;
    async function tryRequest(answer) {
        let tryRes = {};
        try {
            let response = await fetch("https://functions.yandexcloud.net/d4e05ufk7qv7aq1cepqf", {
                method: 'post',
                body: answer,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            });
            if (!response.ok) {
                throw new Error("Network response was not OK");
            }
            let responseJson = await response.json();
            tryRes = {'status': 'OK', 'data': responseJson};
        } catch (err) {
            tryRes = {'status': 'ERROR', 'error': err};
        }
        return tryRes;
    }
    let reqRes = {'status': 'FAIL', 'error': 'Внутренняя ошибка.'};
    for (const ri of retryIntervals) {
        if (reqRes.status == 'OK') {
            break;
        } else {
            reqRes = await tryRequest(answer);
        }
    }
    
    return reqRes;
}

sendUserAnswer(JSON.stringify({'otvet': 'kuku'}))
.then((sendResult) => {
    document.getElementById("verh").innerHTML += `<br>${sendResult.status} ${sendResult.data ? JSON.stringify(sendResult.data) : ''} ${sendResult.error || ''}`;
})
;

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




