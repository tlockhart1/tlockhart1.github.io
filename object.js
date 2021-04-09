
class OBJECT{
	constructor(type, category, mass, vx, vy, x, y, color = "black"){
		this.type = type;
		this.category = category;
		this.mass = mass;
		this.vx = vx;
		this.vy = vy;
		this.x = x;
		this.y = y;
		//this.restitution = restitution;
		this.collision = false;
        this.selected = false;
        this.solid = true;
        this.xscale = 1;
        this.yscale = 1;
        this.collision_indicator = false;
        this.color = color;
    }
    setSolid(bool) {
        this.solid = bool;
    }
    isSolid(){
        return this.solid;
    }
	rescale(amount){
		this.xscale *= amount;
		this.yscale *= amount;
	}
	toggleSelected(){
		return (this.selected = !this.selected);
	}
	getType(){
		return this.type;
	}
	getMass(){
		return this.mass;
	}
	getVx(){
		return this.vx;
	}
	getVy(){
		return this.vy;
	}
	getXpos(){
		return this.x;
	}
	getYpos(){
		return this.y;
	}
	getVelocity(){
		return Math.sqrt(this.vx*this.vx + this.vy*this.vy);
	}
	getDirection(){
		return Math.atan2(this.vy, this.vx);
	}
	updatePos(x, y){
		this.x = x;
		this.y = y;
    }
    setCollilsionIndicator(bool){
        this.collision_indicator = bool;
    }
	updateCollision(c_bool){
		this.collision = c_bool;
	}
	getCategory(){
		return this.category;
	}
	object(){
		return this;
	}
}

export { OBJECT };