const signin = (user, pass) => {
    console.log(`${user}: ${pass}`)
    ws.send(JSON.stringify(["SIGNIN", {[user]: pass}]))
}
const ws = new WebSocket("ws://74.77.166.146:12345");
ws.addEventListener("open", ev => {
    document.getElementById("submit").style = "";
})