const { Config } = require("./config/config");
import * as PIXI from 'pixi.js';



//Load game configuration
var gameScreen = { width: 800, height: 600 };
var config = new Config(gameScreen);
const HERO_SPEED = 7;

//Init the game app

var app = new PIXI.Application({
    width: config.gameScreen.width,
    height: config.gameScreen.height,
    antialiasing: true,
    transparent: false,
    resolution: 1
}
);


//Load assets
app.loader
    .add("map", "assets/img/map/map.png")
    .add("arrowLeft", "assets/img/nav/arrowBeige_left.png")
    .add("arrowRight", "assets/img/nav/arrowBeige_right.png")
    .add("heroIdle", "assets/img/hero/idle_0.png")
    .add("hero", "assets/img/hero/hero.json")
    .load();

//Init the game view
document.body.appendChild(app.view);


var titleTxt = new PIXI.Text("The unending", { fill: 'red', fontSize: '80px' });
titleTxt.x = gameScreen.width / 2 - titleTxt.width / 2;
titleTxt.y = gameScreen.height / 2 - titleTxt.height / 2 - 100;

var playTxt = new PIXI.Text("Start", { fill: 'gold', fontSize: '50px' });
playTxt.x = gameScreen.width / 2 - playTxt.width / 2;
playTxt.y = gameScreen.height / 2 - playTxt.height / 2;
playTxt.interactive = true;
playTxt.on('click', start);

var welcomeContainer = new PIXI.Container();
welcomeContainer.addChild(titleTxt);
welcomeContainer.addChild(playTxt);
app.stage.addChild(welcomeContainer);

console.log(welcomeContainer);

function start() {

    console.log("start");

    console.log(app.loader)

    var arrowLeft = new PIXI.Sprite(app.loader.resources["arrowLeft"].texture);
    arrowLeft.x = (gameScreen.width - arrowLeft.width / 2) * 1 / 4;
    arrowLeft.y = gameScreen.height / 2;


    var arrowRight = new PIXI.Sprite(app.loader.resources["arrowRight"].texture);
    arrowRight.x = (gameScreen.width - arrowRight.width / 2) * 3 / 4;
    arrowRight.y = gameScreen.height / 2;

    var titleTxt = new PIXI.Text("The unending", { fill: 'red', fontSize: '80px' });
    titleTxt.x = gameScreen.width / 2 - titleTxt.width / 2;
    titleTxt.y = gameScreen.height / 2 - titleTxt.height / 2 - 200;


    var hero = new PIXI.Sprite(app.loader.resources["heroIdle"].texture);
    hero.x = gameScreen.width / 2 - hero.width / 2;
    hero.y = gameScreen.height / 2 - hero.height / 2;

    var selectTxt = new PIXI.Text("Play", { fill: 'gold', fontSize: '50px' });
    selectTxt.x = gameScreen.width / 2 - selectTxt.width / 2;
    selectTxt.y = gameScreen.height / 2 - selectTxt.height / 2 + 150;
    selectTxt.interactive = true;
    selectTxt.on("click", play)

    var menuContainer = new PIXI.Container();
    menuContainer.addChild(arrowLeft);
    menuContainer.addChild(arrowRight);
    menuContainer.addChild(titleTxt);
    menuContainer.addChild(hero);
    menuContainer.addChild(selectTxt);
    app.stage.removeChildren();
    app.stage.addChild(menuContainer);

    console.log(menuContainer);

}


function play() {

    app.stage.removeChildren();
    console.log("play");

    //This is the camera 
    var frame = new PIXI.Rectangle(200, 800, 800, 600);

    //this is the world map
    var worldTexture = new PIXI.Texture(app.loader.resources["map"].texture);

    //this is the part of the map to be displayed
    var displayedWorld = new PIXI.Texture(worldTexture, frame);

    //This is where the world is displayed 
    var world = new PIXI.Sprite(displayedWorld);

    //This is the players graphical elements
    var heroSheet = app.loader.resources["hero"].spritesheet;

    //This is where the player is dipslayed
    var hero = new PIXI.AnimatedSprite([heroSheet.textures["idle_0.png"]]);
    hero.animationSpeed = 0.2;
    hero.loop = true;
    hero.anchor.set(0.5);
    hero.x = gameScreen.width / 2;
    hero.y = gameScreen.height / 2;
    hero.name = "hero";

    //This is where the game is displayed
    let gameContainer = new PIXI.Container();
    gameContainer.addChild(world);
    gameContainer.addChild(hero);
    gameContainer.interactive = true;
    gameContainer.name = "gameContainer";

    //We remove old displays and add the game display
    app.stage.removeChildren();
    app.stage.addChild(gameContainer);

    console.time();

    //We handle game inputs
    window.addEventListener("keydown", (ev) => handleKeyboardInputs(ev, hero, heroSheet, frame, worldTexture));
    window.addEventListener("keyup", (ev) => handleKeyboardRelease(ev, hero, heroSheet, frame));

    // Wre create the game loop
    app.ticker.add((delta, map) => gameLoop(delta, displayedWorld));
    console.timeEnd;


}


//needs the player and the camera
function moveTop(frame, hero) {
    console.log(frame, hero);
    //camera move
    if (frame.y > 3 && hero.y === gameScreen.height / 2) {
        frame.y -= HERO_SPEED;
    } else {
        //player move
        if (hero.y - hero.height / 2 > 0) {
            hero.y += -HERO_SPEED;
        }
    }
}


function moveLeft(frame, hero, worldTexture) {

    if (frame.x >= 3 && hero.x === gameScreen.width / 2) {
        frame.x -= HERO_SPEED;
        //player
    } else {
        if (hero.x - hero.width / 2 > 0) {
            hero.x -= HERO_SPEED;
        }
    }
}


//Needs the player, the worldMap and the camera
function moveBottom(frame, hero, worldTexture) {
    console.log(worldTexture);
    //camera move
    // if camera bottom hasn't reached the end of the world and the playered is not centered
    //TODO a method of the class game that checks if a sprite is centered in the game screen
    //TODO: a method of the class game that checks if a point is still in the screen
    //TODO: a method of the class camera that returns the bottom y coordinate of the sprite  
    if (frame.y + frame.height < worldTexture.height && hero.y === gameScreen.height / 2) {
        frame.y += HERO_SPEED;
        //player
    } else {
        //While player is in the screen
        //TODO: a method of the class game that checks if a point is still in the screen
        //TODO a metod of the Player class that returns the bottom y coordinate of the sprite 
        if (hero.y + hero.height / 2 < gameScreen.height) {
            hero.y += HERO_SPEED;
        }
    }
}

function moveRight(frame, hero, worldTexture) {

    if (frame.x + frame.width < worldTexture.width && hero.x === gameScreen.width / 2) {
        frame.x += HERO_SPEED;
        //player
    } else {

        if (hero.x + hero.width / 2 < gameScreen.width) {
            hero.x += HERO_SPEED;
        }
    }
}

function run(hero, heroSheet) {
    if (!hero.playing) {
        hero.textures = heroSheet.animations["run"];
        hero.play();
    }
}


function handleKeyboardInputs(ev, hero, heroSheet, frame, worldTexture) {
    switch (ev.key) {
        case "z":
            console.log("Je vais en avant!");
            run(hero, heroSheet);
            moveTop(frame, hero);
            break;
        case "q":
            console.log("Je vais à gauche!");
            run(hero, heroSheet);
            moveLeft(frame, hero, worldTexture);
            break;
        case "s":
            console.log("Je vais en arrière!");
            run(hero, heroSheet);
            moveBottom(frame, hero, worldTexture);
            break;
        case "d":
            console.log("Je vais à droite!");
            run(hero, heroSheet);
            moveRight(frame, hero, worldTexture);
            break;
        default:
            break;
    }
}


function handleKeyboardRelease(ev, hero, heroSheet) {
    if (["z", "q", "s", "d"].includes(ev.key)) {
        hero.stop();
        hero.textures = [heroSheet.textures["idle_0.png"]];
    }
}


function gameLoop(delta, map) {
    map.updateUvs();
    //TODO: a method from the 
}