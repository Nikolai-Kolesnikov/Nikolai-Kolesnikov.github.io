
document.getElementById("verh").innerHTML = "dynamic 10";

function isFetchAPISupported() {
    return 'fetch' in window;
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

let tg = window.Telegram.WebApp;

//let strtrtr = `dynamic 10 ### <br>initData = ${tg.initData}<br>${tg.initDataUnsafe.user.id} ${tg.initDataUnsafe.user.first_name} ${tg.initDataUnsafe.user.last_name}`;
let strtrtr = `isFetchAPISupported() = ${isFetchAPISupported()}`;
document.getElementById("verh").innerHTML = strtrtr;
