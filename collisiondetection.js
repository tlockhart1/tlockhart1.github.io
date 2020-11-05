
export function _computeCollision(obj1, obj2, delta_t){
	// get unit vector of collision
	/*var v1sqr = (obj1.getXpos()*obj1.getXpos() + obj1.getYpos()*obj1.getYpos());
	var f1 = 0.5 * obj1.getMass() * v1sqr;
	var p1 = obj1.getMass() * Math.sqrt(v1sqr);*/
	var cx = obj2.getXpos() - obj1.getXpos();
	var cy = obj2.getYpos() - obj1.getYpos();
	var distance = Math.sqrt
	(
		(cx * cx)  + 
		(cy * cy)
	);
	cx = cx / distance; // unit vector component of movement x-axis
	cy = cy / distance; // unit vector component of movement y-axis
	var rx = (obj1.getVx() - obj2.getVx()); // relative velocity component in x-axis
	var ry = (obj1.getVy() - obj2.getVy()); // relative velocity component in y-axis
	//
	var pdotv = cx * rx + cy * ry; // dot product of the difference of position vectors and difference of velocity vectors
	/****************************************************************************************
	 * 	for the following:
	 * I think we're just applying the direction of the collision to the relative velocity vector
	 * this is a dot product, we're getting the velocity vector normal to the angle of collision i think
	 *****************************************************************************************/
	// rv= ( cx * rx ) + ( cy * ry ) // Math.pow(c, 2) = Math.pow((cx*rx + cy*ry), 2)
	// p = momentum
	// p = (m1 + m2) * (2 * rv)
	if(pdotv <= 0)
		return;
	else{
		// this does not look like classical impulse -- why
		/**************************************************
		 * inelastic collision:
		 * 		m1*v1 = (m2 + m1)*v2
		 * 		(m1*v1)/(m2 + m1) = v2
		 * 		v2 is the resulting relative velocity of the system...
		 * 		this is not classically the IMPULSE though...
		 * 		2 * relative velocity = (m2 + m1) * final velocity 
		 * 		(2 * rv) / (m2 + m1) = fv
		 ****************************************************/
		// i think the constant '2' here is simply the number of objects in the collision
		// r
		let impulse = (2 * pdotv / (obj1.getMass() + obj2.getMass()));
		/*console.log("p1x: " + obj1.getXpos());
		console.log("p1y: " + obj1.getYpos());
		console.log("p1vx: " + obj1.getVx() + " p1vy: " + obj1.getVy());
		console.log("p2x: " + obj2.getXpos());
		console.log("p2y: " + obj2.getYpos());
		console.log("p2vx: " + obj2.getVx() + " p2vy: " + obj2.getVy());
		console.log("cx: " + cx);
		console.log("cy: " + cy);
		console.log("dot: " + pdotv);*/
		obj1.vx -= (impulse * obj2.getMass() * cx);
 		obj1.vy -= (impulse * obj2.getMass() * cy); 
		obj2.vx += (impulse * obj1.getMass() * cx);
		obj2.vy += (impulse * obj1.getMass() * cy);
	}
}
let __G = 6.673 * Math.pow(10, -11);
function applyGravity(obj1, obj2, delta_t){
	var cx = obj2.getXpos() - obj1.getXpos();
	var cy = obj2.getYpos() - obj1.getYpos();
	var distance = Math.sqrt
	(
		(cx * cx)  + 
		(cy * cy)
	);
	cx = cx / distance; // unit vector component of movement x-axis
	cy = cy / distance; // unit vector component of movement y-axis
	var force = ((__G * obj1.getMass() * obj2.getMass()) / (distance * distance));
	cx = (force / obj2.getMass()) * cx;
	cy = (force / obj2.getMass()) * cy;
	obj2.vx -= cx;
	obj2.vy -= cy;
}

export function testForCollision(obj1, obj2){
	if(obj1.getType() == "circle" && obj2.getType() == "circle") return _areCollidingC(obj1, obj2);
	else if(obj1.getType() == "rectangle" && obj2.getType() == "rectangle") return _areCollidingR(obj1, obj2);
	else{
		var rectangle, circle;
		if(obj1.getType() == "circle"){
			circle = obj1;
			rectangle = obj2;
		} 
		else{
			rectangle = obj1;
			circle = obj2;
		}
		return _areCollidingCR(circle, rectangle);
	}
}

export function _detectCollision(delta_t, objects){
	for(var i = 0; i < objects.length; i++){
		var obj1 = objects[i];
		for(var j = i + 1; j < objects.length; j++){
			var obj2 = objects[j];
			if(testForCollision(obj1, obj2)){
				_computeCollision(obj1, obj2, delta_t);
				obj1.updateCollision(true);
				obj2.updateCollision(true);
			}
		}
	}
}

export function _areCollidingC(obj1, obj2){
	var dx = obj2.getXpos() - obj1.getXpos();
	var dy = obj2.getYpos() - obj1.getYpos();

	var distance = (dx*dx + dy*dy) - ((obj1.getRadius() + obj2.getRadius()) * (obj1.getRadius() + obj2.getRadius()));
	return (distance <= 0);
}

export function _areCollidingCR(circle, rectangle){
	var dx, dy;

	// get x, y components of the distance (dx, dy) from center of circle to center of rectangle
	dx = Math.abs(circle.getXpos() - rectangle.getXpos());
	dy = Math.abs(circle.getYpos() - rectangle.getYpos());
	
	if (dx > rectangle.getWidth() * 0.5 + circle.getRadius()) return false;
	if (dy > rectangle.getHeight() * 0.5 + circle.getRadius()) return false;
	if (dx <= rectangle.getWidth() * 0.5) return true;
	if(dy <= rectangle.getHeight() * 0.5) return true;

	dx = dx - rectangle.getWidth() * 0.5;
	dy = dy - rectangle.getHeight() * 0.5;
	return (dx * dx + dy * dy <= circle.getRadius() * circle.getRadius())
}

export function _areCollidingR(obj1, obj2){
	return !(obj1.getLeft() >= obj2.getRight() || obj1.getTop() >= obj2.getBottom() || obj2.getLeft() >= obj1.getRight() || obj2.getTop() >= obj1.getBottom())
}