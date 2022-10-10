const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const {v4: uuider} = require("uuid")
const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://" + res.getHeaders().host);
    let fname = url.pathname;
    const fext = fname.slice(fname.indexOf('.'));
    const dothing = (data) => {
        if(!data) {
            res.end();
            return;
        }
        switch(fext) {
            case ".html":
                res.writeHead(200, {"Content-Type": "text/html"});
                break;
            case ".js":
                res.writeHead(200, {"Content-Type": "text/javascript"});
                break;
            case ".css":
                res.writeHead(200, {"Content-Type": "text/css"});
                break;
            case ".png":
                res.writeHead(200, {"Content-Type": "image/png"});
        }
        res.write(data);
        res.end();
    }
    if(fname === '/') fname = "/index.html";
    fs.readFile("client" + fname, (err, data) => {
        if(err) {
            try {
                const cont = fs.readFileSync(`client${fname.slice(0, fname.indexOf('.'))}${fname}`)
                dothing(cont);
            } catch {
                res.end("404: Page not found");
            } finally {
                return;
            }
        }
        dothing(data);
    })
})
const wss = new WebSocket.Server({server:server});
const userUUID = uuid => {
    const cur_json = JSON.parse(fs.readFileSync("signin.json").toString());
    for(user of cur_json["Users"]) {
        if(user["I"] == uuid) {
            return user["U"];
        }
    }
    return null;
}
wss.on("connection", ws => {
    ws.on("message", data => {
        const json = JSON.parse(data.toString());
        let cur_json_buff = fs.readFileSync("signin.json");
        let cur_json = JSON.parse(cur_json_buff.toString());
        const users = cur_json["Users"];
        switch(json[0]) {
            case "SIGNUP":
                const info = json[1]["info"];
                const user = info["Username"];
                const pass = info["Password"];
                const uuid = uuider();
                let bool = true;
                for(const el of users) {
                    if(el['U'] === user) {
                        console.log(`${user} matches ${el['U']}`);
                        bool = false;
                        break;
                    }
                }
                if(bool) {
                    cur_json["Users"].push({"U": user, "P": pass, "I": uuid});
                    fs.writeFile("signin.json", JSON.stringify(cur_json), err => {
                        if(err) {
                            console.log("Problem");
                            return;
                        }
                        ws.send(JSON.stringify(["USERNAME_AVAL", {info: uuid}]));
                    });
                } else {
                    ws.send(JSON.stringify(["USERNAME_TAKEN"]));
                }
                break;
            case "SIGNIN":
                console.log(json[1]);
                for(const peep of users) {
                    const it = json[1][peep["U"]];
                    if(it) {
                        if(it == peep["P"]) {
                            ws.send(JSON.stringify(["SIGNIN_SUC", peep["I"]]));
                            return;
                        }
                    }
                    ws.send(JSON.stringify(["SIGNIN_FAL"]));
                }
                break;
            case "SEND_MES":
                console.log(json[1]);
                const person = userUUID(json[1]["I"]);
                if(person) {
                    console.log(`Broadcasting: ${json[1]["M"]}\nFrom: ${person}`);
                    wss.clients.forEach(val => {
                        val.send(JSON.stringify(["DIS_MES", {"U": person, "M": json[1]["M"]}]))
                    })
                }
        }
    })
})
server.listen(12345);