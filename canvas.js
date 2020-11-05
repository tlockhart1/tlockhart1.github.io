import { RECTANGLE } from './rectangle.js';
import { CIRCLE } from './circle.js';

let canvas = null;
let ctx = null;
let aframe = 0;
let objects = [];
let circles = [];
let rectangles = [];
let selected = null;
let selected_obj = null;
let notifications = false;
let animating = false;
let track = {
	"rectangle": false,
	"circle": false,
	"extra": {}
};
let mouse_pos = {
	x: -1,
	y: -1,
	getRadius(){
		return 0;
	},
	getMass(){
		return 0;
	},
	getXpos(){
		return this.x;
	},
	getYpos(){
		return this.y;
	},
	getType(){
		return "mouse";
	}

}
function getMousePos(e){
	mouse_pos.x = e.pageX;
	mouse_pos.y = e.pageY;
}

/********************************************************************
 			overlay other elements on top of canvas
*********************************************************************/
$(document).ready(() => {
	canvas = document.getElementById("dacanvas");
	ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth; 
	canvas.height = window.innerHeight;

	$('#circle').click(() => {
		selected = "circle";
	});
	$('#submission').click(() => {
		getObjectInput(decideObject());
	});
	$('#dacanvas').mousedown((e) => {
		if(animating){
			getMousePos(e);	
			for(var i in objects){
				if(_isSelected(objects[i], mouse_pos)){
					selected_obj = i;
					$('#dacanvas').on("mousemove", getMousePos);
					objects[i].selected = true;
					break;
				}
			}
		}
	});
	$('#dacanvas').mouseup((e) => {
		if(animating){
			if(selected_obj != null){
				objects[selected_obj].selected = false;
				$('#dacanvas').off("mousemove", getMousePos);
			}
			selected_obj = null;
		}
	});
	$('#rectangle').click(() => selected = "rectangle");
	$('#rcircle').click(() => {
		// this is async and processes after the onclick function...
		selected = "circle";
		getObjectInput(genRcircle());
	});
	$('#rrectangle').click(() => {
		selected = "rectangle";
		getObjectInput(genRrectangle());
	});
	// listener for animating canvas
	$('#animatebtn').click(() => {
		if(objects.length == 0 && !animating){
			var anierror = $('#notifications');
			if(!notifications)
				anierror.append('<li>there are zero objects to animate</li>');
			anierror.toggle();
			notifications = !notifications;
		}
		else if(!animating){
			animating = true;
			aframe = requestAnimationFrame(animate);
		}
		else if(animating){
			animating = false;
			//cancelAnimationFrame(aframe);
		}
	});
});

function displayObjXPos(obj){
	return Number.parseFloat(obj.getXpos().toPrecision(6));
}

function displayObjYPos(obj){
	return Number.parseFloat(obj.getYpos().toPrecision(6));

}

function displayObjDir(obj){
	return Number.parseFloat(obj.getDirection() * 180 / Math.PI).toPrecision(5);
}

function displayObjXvelocity(obj){
	return Number.parseFloat(obj.getVx()).toPrecision(5);
}

function displayObjYvelocity(obj){
	return Number.parseFloat(obj.getVy()).toPrecision(5);
}

function getObjectInput(generator){
	generator;
	if(selected == "circle"){
		updateCaccumulator();
		appendObjList('#circlelist', 'circle', circles.length, objects.length);
		if(circles.length == 1){ // attach onlick listener only when the first circle is made
			$('#circleacc').css("display", "inline");
			slideToggleClick('#circleacc', '#circlelist','circle', objListItemToggle('circle'), 200);
		}
	}
	else if(selected == "rectangle"){
		updateRaccumulator();
		appendObjList('#rectanglelist', 'rectangle', rectangles.length, objects.length);
		if(rectangles.length == 1){ // attach onclick listener only when the first rectangle is made
			$('#rectangleacc').css("display", "inline");
			slideToggleClick('#rectangleacc', '#rectanglelist','rectangle', objListItemToggle('rectangle'), 200);
		}
	}
	else
		console.log('dunno how this went wrong D:');
	$('#dropdownbtn').text('Create Shape...');
	selected = '';
}
// toggle doesn't appear to be toggling
function slideToggleClick(initid, actionid, type, track_toggle, dur){
	$(initid).click(() => {
		var element = $(actionid);
		if(track[type]){
			element.children().each((index, child) => {
				if(track.extra[`objexp${index}`]){
					$(`#objexp${index}`).slideToggle(dur);
					track.extra[`objexp${index}`] = false;
				}
			});
		}
		element.slideToggle(dur);
		track_toggle();
	});
}

function objListItemToggle(obj){
	return () => {
		track[obj] = !track[obj];
	}
}

function objListItemExpToggle(obj){
	track.extra[obj] = !track.extra[obj];
	//console.log(`child: ${track[obj]}`);
	return track.extra[obj];
}

function updateRaccumulator(){

	$(`#rectangleacc`).text(`${rectangles.length}x rectangles...`);

}
function updateCaccumulator(){

	$(`#circleacc`).text(`${circles.length}x circles...`);

}

function appendObjList(div, childiv, rcount, ocount){
	var childid = `${childiv}${rcount - 1}`;
	var exp_element = `objexp${ocount - 1}`;
	$(div).append
	(
		`
			<a class="list-group-item list-group-item-action text-left" id="${childid}">
				<b id="obj${ocount - 1}">x: <span id="objx${ocount - 1}"></span><br>y: <span id="objy${ocount - 1}"></span></b>
				<div id="${exp_element}" style="display: none"><kbd>&theta;: <span id="dir${ocount - 1}"></span></kbd><br><kbd>V<sub>x</sub>:<span id="vx${ocount - 1}"></span></kbd><br><kbd>V<sub>y</sub>:<span id="vy${ocount - 1}"></span></kbd></div>
			</a>
		`
	);
	track.extra[`objexp${ocount - 1}`] = false;
	$(`#${childid}`).click(() => {
		objListItemExpToggle(exp_element);
		$(`#${exp_element}`).slideToggle(200);
	});
}

function updateObjectList(id, obj){
	if(track[obj.getType()]){
		
		$(`#objx${id}`).text(displayObjXPos(obj));
		$(`#objy${id}`).text(displayObjYPos(obj));
		if(track.extra['objexp' + id]){
			$(`#dir${id}`).text(displayObjDir(obj));
			$(`#vx${id}`).text(displayObjXvelocity(obj));
			$(`#vy${id}`).text(displayObjYvelocity(obj));
		}
	}
}

function decideObject(){
	if(selected == "circle")
		genCircle();
	else if(selected == "rectangle")
		genRectangle();
}

function genCircle(){
	//constructor(radius, mass, vx, vy, x, y)
	var new_circle = new CIRCLE
		(
			parseFloat($('#radius').val()),
			"circle",
			"",
			parseFloat($('#mass').val()),
			parseFloat($('#vx').val()),
			parseFloat($('#vy').val()),
			parseFloat($('#xpos').val()),
			parseFloat($('#ypos').val()),
			"black"
		);
	objects.push(new_circle);
	circles.push(new_circle);
	$('#uinput').modal('toggle');
}

function genRectangle(){
	//constructor(height, width, mass, vx, vy, x, y)
	var new_rectangle = new RECTANGLE
		(
			parseFloat($('#height').val()),
			parseFloat($('#width').val()),
			"rectangle",
			"",
			parseFloat($('#mass').val()),
			parseFloat($('#vx').val()),
			parseFloat($('#vy').val()),
			parseFloat($('#xpos').val()),
			parseFloat($('#ypos').val()),
			"black"
		) 
	objects.push(new_rectangle);
	rectangles.push(new_rectangle);
	$('#uinput').modal('toggle');
}

function genRrectangle(){
	//constructor(height, width, mass, vx, vy, x, y)
	var new_rectangle = new RECTANGLE
		(
			randFromRange(10, 200),
			randFromRange(10, 200),
			"rectangle",
			"",
			randFromRange(1, 100),
			randFromRange(1, 100),
			randFromRange(1, 100),
			randFromRange(0, canvas.width),
			randFromRange(0, canvas.height),
			"black"
		) 
	objects.push(new_rectangle);
	rectangles.push(new_rectangle);

}

function genRcircle(){
	//constructor(radius, mass, vx, vy, x, y)
	var new_circle = new CIRCLE
		(
			randFromRange(10, 50),
			"circle",
			"",
			randFromRange(1, 100),
			randFromRange(-100, 100),
			randFromRange(-100, 100),
			randFromRange(0, canvas.width),
			randFromRange(0, canvas.height),
			"black"
		);
	objects.push(new_circle);
	circles.push(new_circle);
}

function randFromRange(min, max) {

  return Math.random() * (max - min) + min;

}

let last_step;

function animate(currentTime){
	if(animating){
		if(last_step === undefined) last_step = currentTime;
		var delta_t = (currentTime - last_step) * 0.001;
		update_pos(delta_t);
		_detectCollision(delta_t);
		update_info();
		path();
		last_step = currentTime;	
		aframe = window.requestAnimationFrame(animate);
	}
	else last_step = undefined; // reset last_step if animate is paused
}

function update_info(){
	objects.forEach((obj, index) => {
		updateObjectList(index, obj);
	});
}

function update_pos(delta_t){
	objects.forEach((obj, index) => {
		if(index == selected_obj){
			obj.updatePos(mouse_pos.x, mouse_pos.y);
		}
		else{
			for(var i = 0; i < objects.length; i++){
				if(i != index)
					applyGravity(obj, objects[i]);
			}
			var x = obj.getXpos() + (obj.getVx() * delta_t);
			var y = obj.getYpos() + (obj.getVy() * delta_t);
			if(x > canvas.width)
				x = 0;
			else if(x < 0)
				x = canvas.width;
			if(y > canvas.height)
				y = 0;
			else if(y < 0)
				y = canvas.height;
			obj.updatePos(x, y);
		}
	});
}


function path(){
	ctx.clearRect
	(
		0,
		0,
		canvas.width,
		canvas.height
	);	
	objects.forEach((obj) => obj.draw(ctx));
}

function _isSelected(obj, mouse){
	if(obj.getType() == "circle"){
		return _areCollidingC(obj, mouse);
	}
	else{
		return (mouse.getXpos() <= obj.getRight() && mouse.getXpos() >= obj.getLeft() && mouse.getYpos() >= obj.getTop() && mouse.getYpos() <= obj.getBottom());
	}
}


function _areCollidingC(obj1, obj2){
	var dx = obj2.getXpos() - obj1.getXpos();
	var dy = obj2.getYpos() - obj1.getYpos();

	var distance = (dx*dx + dy*dy) - ((obj1.getRadius() + obj2.getRadius()) * (obj1.getRadius() + obj2.getRadius()));
	return (distance <= 0);
}

function _areCollidingCR(circle, rectangle){
	var dx, dy;

	// get x, y components of the distance (dx, dy) from center of circle to center of rectangle
	dx = Math.abs(circle.getXpos() - rectangle.getXpos());
	dy = Math.abs(circle.getYpos() - rectangle.getYpos());
	
	if (dx > rectangle.getWidth() * 0.5 + circle.getRadius()) return false;
	if (dy > rectangle.getHeight() * 0.5 + circle.getRadius()) return false;
	if (dx <= rectangle.getWidth() * 0.5) return true;
	if (dy <= rectangle.getHeight() * 0.5) return true;

	dx = dx - rectangle.getWidth() * 0.5;
	dy = dy - rectangle.getHeight() * 0.5;
	return (dx * dx + dy * dy <= circle.getRadius() * circle.getRadius())
}

function _areCollidingR(obj1, obj2){
	return !(obj1.getLeft() >= obj2.getRight() || obj1.getTop() >= obj2.getBottom() || obj2.getLeft() >= obj1.getRight() || obj2.getTop() >= obj1.getBottom())
}

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
	var force = ((9.81 * obj1.getMass() * obj2.getMass()) / (distance * distance));
	cx = (force / obj2.getMass()) * cx;
	cy = (force / obj2.getMass()) * cy;
	obj2.vx -= cx;
	obj2.vy -= cy;
}

function _computeCollision(obj1, obj2){
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
		let impulse = (2 * pdotv / (obj1.getMass() + obj2.getMass())) * 0.8;
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

function testForCollision(obj1, obj2){
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

function _detectCollision(delta_t){
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
