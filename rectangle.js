
import { OBJECT } from "./object.js";
import * as RAND from './randfxns.js';

export class RECTANGLE extends OBJECT{
	constructor(height, width, type, category, mass, vx, vy, x, y, color){
		super(type, category, mass, vx, vy, x, y, color)
		this.width = width;
		this.height= height;
		this.angular_speed = 2;
	}
	getWidth(){
		return this.width;
	}
	getHeight(){
		return this.height;
	}
	getRight(){
		return this.x + (this.width * 0.5);
	}
	getLeft(){
		return this.x - (this.width * 0.5);
	}
	getTop(){
		return this.y - (this.height * 0.5);
	}
	getBottom(){
		return this.y + (this.height * 0.5);
	}
	draw(ctx){
		var ox = this.x - (this.width * 0.5);
		var oy = this.y - (this.height * 0.5);
		if(this.collision && this.collision_indicator)
			ctx.fillStyle = "red";
		if(this.selected)
			ctx.fillStyle = "green";
		// some modifier here based on rotational speed, negative is counter-clockwise
		// positive is clockwise
		/*
		ctx.save();
		ctx.rotate(this.getDirection()):
		ctx.fillRect(ox, oy, this.width, this.height);
		ctx.restore();
		*/
		ctx.fillRect(ox, oy, this.width, this.height);
		this.collision = false;
		ctx.fillStyle = this.color;
    }
    static genRectangle(field_width, field_height, scale, color){
        var new_rectangle = new RECTANGLE
            (
                RAND.randFromRange(10 * scale, 200 * scale),
                RAND.randFromRange(10 * scale, 200 * scale),
				"rectangle",
				"",
                RAND.randFromRange(1, 100),
                RAND.randFromRange(1, 100),
                RAND.randFromRange(1, 100),
                RAND.randFromRange(0, field_width),
                RAND.randFromRange(0, field_height),
                color
            );
        return new_rectangle;
    }
}
