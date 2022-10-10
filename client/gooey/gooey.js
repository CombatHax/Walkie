const ws = new WebSocket(`ws://${location.host}`)
let hovering = -1;
let mouse = []
let win = [window.innerWidth, window.innerHeight];
const doHover = (hover) => {
    switch(hover) {
        case 0:
            console.log("Left");
            break;
        case 1:
            console.log("Right");
            break;
    }
}
window.addEventListener("mousemove", ev => {
    mouse = [ev.clientX, ev.clientY];
    let new_hover = null;
    if(mouse[0] < win[0]/5) {
        new_hover = 0;
    } else if(mouse[0] > win[0] - win[0]/5) {
        new_hover = 1;
    } else {
        new_hover = -1;
    }
    if(new_hover != hovering && new_hover != -1) {
        doHover(new_hover);
    }
    hovering = new_hover;
})
window.addEventListener("resize", () => {
    win = [window.innerWidth, window.innerHeight];
})
window.addEventListener("mousedown", ev => {
    console.log("Mouse down");
    if(ev.button == 0) {
        doHover(hovering);
    }
})