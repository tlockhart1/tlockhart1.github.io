import { GameController } from './GameController.js';
import { RECTANGLE } from './rectangle.js';
import { CIRCLE } from './circle.js';

$(document).ready(() => {
    var canvas = document.getElementById("dagameboard");
	var ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    var objects = []
    objects.push(new CIRCLE(20, "circle", "player", 1, 0, 0, 400, 400, "red"));
    var game = new GameController(ctx, "somegame", objects);
    movePlayer(game);
    game.fields.physics.setFrictionX(1);
    game.fields.physics.setFrictionY(1);
    game.fields.physics.setGravity(0);
    game.start();
    canvas.focus();

});

function movePlayer(game){
    var movement_input= {
        keya: -10,
        keyd: 10,
        keyw: -10,
        keys: 10,
    };
    game.gameInput('keypress', movement_input, 'player');
}