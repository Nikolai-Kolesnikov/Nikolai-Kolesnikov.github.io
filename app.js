
document.getElementById("verh").innerHTML = "dynamic 14";

async function sendUserAnswer(answer) {
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
    return ret;
}

/*fetch("https://jsonplaceholder.typicode.com/posts", {
    method: 'post',
    body: post,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}).then((response) => {
    return response.json()
}).then((res) => {
    if (res.status === 201) {
        console.log("Post successfully created!")
    }
}).catch((error) => {
    console.log(error)
});*/

let tg = window.Telegram;

let strtrtr = await sendUserAnswer('кукарамба');
document.getElementById("verh").innerHTML = strtrtr;
