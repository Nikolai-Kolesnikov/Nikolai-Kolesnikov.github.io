

//window.Telegram.WebApp.BackButton.isVisible = true;
//window.Telegram.WebApp.MainButton.isVisible = true;


document.getElementById("verh").innerHTML = "dynamic 47";

let answerInputElm = document.getElementById("answerInput");
answerInputElm.focus();
answerInputElm.click();

// Делаем, чтобы textarea для ввода ответа стала auto resize
// Source: https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
answerInputElm.setAttribute("style", "height:16px;overflow-y:hidden;");
//answerInputElm.setAttribute("style", "height:" + (answerInputElm.scrollHeight) + "px;overflow-y:hidden;");
answerInputElm.addEventListener("input", OnInput, false);
function OnInput() {
  this.style.height = 0;
  this.style.height = (this.scrollHeight) + "px";
}

let answerSubmitBtnElm = document.getElementById("answerSubmitBtn");
answerSubmitBtnElm.addEventListener("click", onAnswerSubmitBtnClick);
function onAnswerSubmitBtnClick() {
  sendUserAnswer(JSON.stringify({'otvet': answerInputElm.value}))
  .then((sendResult) => {
    document.getElementById("verh").innerHTML += `<br>Сервер ответил:<br>${sendResult.status} ${sendResult.data ? JSON.stringify(sendResult.data) : ''} ${sendResult.error || ''}`;
  })
  ;
}



function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function postpone(fn, ms, ...args) {
    await timeout(ms);
    let ret = await fn(...args);
    return ret;
}

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


async function sendUserAnswer(answer) {
    let retryIntervals = [1, 2, 2, 5, 5];
    
    let reqRes = await tryRequest(answer);
    for (const ri of retryIntervals) {
        if (reqRes.status == 'OK') {
            break;
        } else {
            reqRes = await postpone(tryRequest, ri*1000, answer);
        }
    }
    
    return reqRes;
}

