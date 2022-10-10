const ws = new WebSocket("ws://localhost:12345");
ws.addEventListener("open", ev => {
    window.onkeydown = ev => {
        const cur_mes = document.getElementById('cur_mes');
        if(ev.key.length == 1) cur_mes.innerHTML += ev.key;
        else if(ev.key == "Backspace" || ev.key == "Delete") cur_mes.innerHTML = cur_mes.innerHTML.slice(0, -1);
        else if(ev.key == "Enter") {
            if(cur_mes.innerHTML == "") return;
            ws.send(JSON.stringify(["SEND_MES",
                {
                    "I": localStorage.getItem("UUID"),
                    "M": cur_mes.innerHTML
                }
            ]));
            cur_mes.innerHTML = "";
        }

    }
})
ws.addEventListener("message", ev => {
    const info = JSON.parse(ev.data);
    console.log(info);
    if(info[0] == "DIS_MES") {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${info[1]["U"]} : </strong>${info[1]["M"]}`;
        document.getElementById("messages").insertBefore(li, document.getElementById("messages").children[0])
    }
})