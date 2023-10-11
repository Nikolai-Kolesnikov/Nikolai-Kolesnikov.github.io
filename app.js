
document.getElementById("verh").innerHTML = "dynamic 12";

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

let strtrtr = `dynamic 12 ### <br>${JSON.stringify(tg)}`;
//let strtrtr = `isFetchAPISupported() = ${isFetchAPISupported()}`;
document.getElementById("verh").innerHTML = strtrtr;
