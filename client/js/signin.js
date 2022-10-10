const signin = (user, pass) => {
    console.log(`${user}: ${pass}`)
    ws.send(JSON.stringify(["SIGNIN", {[user]: pass}]))
}
const ws = new WebSocket(`ws://${location.host}`);
ws.addEventListener("open", ev => {
    document.getElementById("submit").style = "";
})
ws.addEventListener("message", ev => {
    const json = JSON.parse(ev.data);
    switch(json[0]) {
        case "SIGNIN_SUC":
            localStorage.setItem("UUID", json[1]);
            location.assign("talk.html");
            break;
        case "SIGNIN_FAL":
            const el = document.createElement("p");
            el.className = "red";
            el.innerHTML = "Incorrect information";
            document.getElementsByClassName("centered")[0].appendChild(el);
            setTimeout(() => {
                document.getElementsByClassName("centered")[0].lastChild.remove();
            }, 2000)
    }
})