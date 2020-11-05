
import { OBJECT } from './object.js';
import * as RAND from './randfxns.js';

export class CIRCLE extends OBJECT{
	constructor(radius, type, category, mass, vx, vy, x, y, color){
		super(type, category, mass, vx, vy, x, y, color);
		this.radius = radius;
	}
	getRadius(){
		return this.radius;
	}
	draw(ctx){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		if(this.collision && this.collision_indicator)
			ctx.fillStyle = "red";
		if(this.selected)
			ctx.fillStyle = "green";
		ctx.fill();
		ctx.fillStyle = this.color;
		this.collision = false;

		/*ctx.lineWidth = "2";
		ctx.strokeStyle = "red";
		var mx = (this.radius + 20) * Math.cos(this.getDirection()) + this.x;
		var my = (this.radius + 20) * Math.sin(this.getDirection()) + this.y;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(mx, my);
		ctx.stroke();*/

    }
    
    static genCircle(field_width, field_height, scale, color){
        var new_circle = new CIRCLE
            (
                RAND.randFromRange(10 * scale, 100 * scale),
				"circle",
				"",
                RAND.randFromRange(1, 100),
                RAND.randFromRange(-100, 100),
                RAND.randFromRange(-100, 100),
                RAND.randFromRange(0, field_width),
                RAND.randFromRange(0, field_height),
                color
            );
        return new_circle;
    }

}

