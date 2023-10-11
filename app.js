
document.getElementById("verh").innerHTML = "dynamic 13";

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

let tg = window.Telegram;

let strtrtr = `dynamic 13 ### <br>${JSON.stringify(tg)}`;
//let strtrtr = `isFetchAPISupported() = ${isFetchAPISupported()}`;
document.getElementById("verh").innerHTML = strtrtr;
