
import { CIRCLE } from './circle.js';
import { RECTANGLE } from './rectangle.js';
import * as COLLISION from './collisiondetection.js';
import * as RAND from './randfxns.js';


let objects = [];
let ctx = [];
let aframe = 0;

$(document).ready(() => {
    initCanvas(1);
    var scale = 1;
    for(var i = 0; i < ctx.length; i++){
        objects.push(initObjects(ctx[i], scale));
        //scale *= 0.15;
    }
    aframe = requestAnimationFrame(animate);
});

function initCanvas(num){
    for(var i = 0; i < num; i++){
        ctx.push(document.getElementById(`dacanvas${i}`).getContext("2d"));
        ctx[i].canvas.width = window.innerWidth; //???? why do i need to do this
        ctx[i].canvas.height = window.innerHeight;
    }
}

function initObjects(ctx, scale){
    var objects_list = [];
    for(var i = 0; i < 20 / scale; i++){
        if(Math.floor(RAND.randFromRange(0, 3)) == 1) objects_list.push(CIRCLE.genCircle(ctx.canvas.width, ctx.canvas.height, scale, "black"));
        else objects_list.push(RECTANGLE.genRectangle(ctx.canvas.width, ctx.canvas.height, scale, "black"));
    }
    return objects_list;
}

let last_step;

function animate(currentTime){
    if(last_step === undefined) last_step = currentTime;
    var delta_t = (currentTime - last_step) * 0.001;
    update_pos(delta_t);
    objects.forEach((obj_list) => {
        COLLISION._detectCollision(delta_t, obj_list);
    });
    path();
    last_step = currentTime;	
    aframe = window.requestAnimationFrame(animate);
}

function update_pos(delta_t){
    objects.forEach((obj_list, index) => {
        obj_list.forEach((obj) => {
            var x = obj.getXpos() + (obj.getVx() * delta_t);
            var y = obj.getYpos() + (obj.getVy() * delta_t);
            if(x > ctx[index].canvas.width)
                x = 0;
            else if(x < 0)
                x = ctx[index].canvas.width;
            if(y > ctx[index].canvas.height)
                y = 0;
            else if(y < 0)
                y = ctx[index].canvas.height;
            obj.updatePos(x, y);
        });
    });
}

function path(){
	objects.forEach((obj_list, index) =>{
        ctx[index].clearRect
        (
            0,
            0,
            ctx[index].canvas.width,
            ctx[index].canvas.height
        );
        obj_list.forEach((obj) => {
            obj.draw(ctx[index]);
        });
    });
}