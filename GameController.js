import * as COLLISION from './collisiondetection.js';

export class GameController{
    constructor(ctx, name, objects = null){
        this.fields = {};
        this.fields.name = name;
        this.fields.ctx = ctx;
        this.fields.aframe = 0;
        this.fields.objects = [];
        if(objects != null)
            this.fields.objects = objects; 
        this.fields.last_step = null;
        this.fields.delta_t = null;
        this.input = {
            keya: {
                down: false,
                interval: -1
            },
            keys: {
                down: false,
                interval: -1
            },
            keyd: {
                down: false,
                interval: -1
            },
            keyw: {
                down: false,
                interval: -1
            }
        };
        this.fields.physics = {
            // environment physics
            // default values assigned here
            gravity: 9.81,
            frictionX: 2,
            frictionY: 0,
            getFrictionX(vc){
                if(vc < 0) return this.frictionX;
                else if(vc > 0) return (-1 * this.frictionX);
                else return 0;
            },
            getFrictionY(vc){
                if(vc < 0) return this.frictionY;
                else if(vc > 0) return (-1 * this.frictionY);
                else return 0;
            },
            applyPhysics(obj){
                obj.vx += this.getFrictionX(obj.getVx());
                obj.vy += this.getFrictionY(obj.getVy());
                obj.vy += this.gravity;
            },
            setFrictionX(friction){
                this.frictionX = friction;
            },
            setFrictionY(friction){
                this.frictionY = friction;
            },
            setGravity(gravity){
                this.gravity = gravity
            }
        }
    }
    start(){
        // pass reference of class fields to local scape variable
        var start_fields = this.fields;
        function update_pos(){
            start_fields.objects.forEach((obj, index) => {
                //console.log(obj.getVx());
                start_fields.physics.applyPhysics(obj);
                var x = obj.getXpos() + (obj.getVx() * start_fields.delta_t);
                var y = obj.getYpos() + (obj.getVy() * start_fields.delta_t);
                if(x > start_fields.ctx.canvas.width)
                    x = 0;
                else if(x < 0)
                    x = start_fields.ctx.canvas.width;
                if(y > start_fields.ctx.canvas.height)
                    y = 0;
                else if(y < 0)
                    y = start_fields.ctx.canvas.height;
                obj.updatePos(x, y);
            });
        }
        function path(){
            start_fields.ctx.clearRect
            (
                0,
                0,
                start_fields.ctx.canvas.width,
                start_fields.ctx.canvas.height
            );
            start_fields.objects.forEach((obj) => obj.draw(start_fields.ctx));
        }
        function update(currentTime){
            if(start_fields.last_step == null) start_fields.last_step = currentTime;
            start_fields.delta_t = (currentTime - start_fields.last_step) * 0.001;
            update_pos()
            COLLISION._detectCollision(start_fields.delta_t, start_fields.objects);
            path();
            start_fields.last_step = currentTime;
            start_fields.aframe = requestAnimationFrame(update);
        }
        this.fields.aframe = requestAnimationFrame(update);
    }
    putObjects(objects){
        this.fields.objects = objects;
    }
    gameInput(event, _input, category){
        function __movex(item, vx){
            return () => item.vx += vx;
        }
        function __movey(item, vy){
            return () => item.vy += vy;
        }
        if(event == 'keypress'){
            window.addEventListener(event, (function(e){
                this.fields.objects.forEach((item) => {
                    if(item.getCategory() == category){
                        //these should be a function determined by the event we received in the call
                        //how do i make this more plug n play
                        if(!this.input.keya.down && e.key == 'a' && _input.keya !== undefined){
                            item.vx += _input.keya;
                            this.input.keya.down = true;
                            this.input.keya.interval = setInterval(__movex(item, _input.keya), 15);
                        }
                        else if(!this.input.keyd.down && e.key == 'd' && _input.keyd !== undefined){ 
                            item.vx += _input.keyd;
                            this.input.keyd.down = true;
                            this.input.keyd.interval = setInterval(__movex(item, _input.keyd), 15);
                        }
                        else if(!this.input.keyw.down && e.key == 'w' && _input.keyw !== undefined){ 
                            item.vy += _input.keyw;
                            this.input.keyw.down = true;
                            this.input.keyw.interval = setInterval(__movey(item, _input.keyw), 15);
                        }
                        else if(!this.input.keys.down && e.key == 's' && _input.keys !== undefined){
                            item.vy += _input.keys;
                            this.input.keys.down = true;
                            this.input.keys.interval = setInterval(__movey(item, _input.keys), 15);
                        }
                    }
                });
            }).bind(this));
            window.addEventListener('keyup', (function(e){
                if(e.key == 'a' && this.input.keya.down){
                    this.input.keya.down = false;
                    clearInterval(this.input.keya.interval)
                    //console.log(e.key);
                } 
                else if(e.key == 'd' && this.input.keyd.down){
                    this.input.keyd.down = false;
                    clearInterval(this.input.keyd.interval)
                    //console.log(e.key);
                }
                else if(e.key == 'w' && this.input.keyw.down){
                    this.input.keyw.down = false;
                    clearInterval(this.input.keyw.interval)
                    //console.log(e.key);
                }
                else if(e.key == 's' && this.input.keys.down){
                    this.input.keys.down = false;
                    clearInterval(this.input.keys.interval)
                    //console.log(e.key);
                }
            }).bind(this));
        }

    }
}