const ws = new WebSocket("ws://74.77.166.146:12345");
ws.addEventListener("message", ev => {
    const json_info = JSON.parse(ev.data);
    switch(json_info[0]) {
        case "USERNAME_TAKEN":
            const utak = document.createElement("p");
            utak.className = "red";
            utak.innerHTML = "Username is taken";
            document.getElementsByClassName("centered")[0].appendChild(utak);
            setTimeout(() => {
                document.getElementsByClassName("centered")[0].lastChild.remove();
            }, 2000);
            break;
        case "USERNAME_AVAL":
            const info = json_info[1]["info"];
            localStorage.setItem("UUID", info);
            location.assign("talk.html");
    }
})
const submit = () => {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const info = ["SIGNUP", {"info": {
        "Username": user,
        "Password": pass
    }}];
    ws.send(JSON.stringify(info));
}
ws.addEventListener("open", ev => {
    document.getElementById("submit").onclick = submit;
    document.getElementById("submit").style = "";
})