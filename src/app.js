const { Config } = require("./config/config");
import * as PIXI from 'pixi.js';



//Load game configuration
var gameScreen = { width: 800, height: 600 };
var config = new Config(gameScreen);
const HERO_SPEED = 10;
var inputQueue = [];
var inputReleaseQueue = [];



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
    frame.futureX = frame.x;
    frame.futureY = frame.y;

    //this is the world map
    var worldTexture = new PIXI.Texture(app.loader.resources["map"].texture);
    var worldBoxes = [];
    worldBoxes.push({ x: 330, y: 840, width: 150, height: 150 });

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
    hero.futureX = hero.x;
    hero.futureY = hero.y;
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

    //We handle game inputs
    window.addEventListener("keydown", regsiterKeyboardInputs);
    window.addEventListener("keyup", unRegsiterKeyboardInputs);

    // Wre create the game loop
    app.ticker.add((delta, map) => gameLoop(delta, displayedWorld, hero, heroSheet, frame, worldTexture, worldBoxes));


}


//needs the player and the camera
function moveTop(frame, hero) {
    console.log(frame, hero);
    hero.willMove = true;
    //camera move
    if (frame.y > 3 && hero.y === gameScreen.height / 2) {
        frame.futureY = frame.y - HERO_SPEED;
    } else {
        //player move
        if (hero.y - hero.height / 2 > 0) {
            hero.futureY = hero.y - HERO_SPEED;
        }
    }
}


function moveLeft(frame, hero, worldTexture) {
    hero.willMove = true;

    if (frame.x >= 3 && hero.x === gameScreen.width / 2) {
        frame.futureX = frame.x - HERO_SPEED;
        //player
    } else {
        if (hero.x - hero.width / 2 > 0) {
            hero.futureX = hero.x - HERO_SPEED;
        }
    }
}


//Needs the player, the worldMap and the camera
function moveBottom(frame, hero, worldTexture) {
    hero.willMove = true;
    //camera move
    // if camera bottom hasn't reached the end of the world and the playered is not centered
    //TODO a method of the class game that checks if a sprite is centered in the game screen
    //TODO: a method of the class game that checks if a point is still in the screen
    //TODO: a method of the class camera that returns the bottom y coordinate of the sprite  
    if (frame.y + frame.height < worldTexture.height && hero.y === gameScreen.height / 2) {
        frame.futureY = frame.y + HERO_SPEED;
        //player
    } else {
        //While player is in the screen
        //TODO: a method of the class game that checks if a point is still in the screen
        //TODO a metod of the Player class that returns the bottom y coordinate of the sprite 
        if (hero.y + hero.height / 2 < gameScreen.height) {
            hero.futureY = hero.y + HERO_SPEED;
        }
    }
}

function moveRight(frame, hero, worldTexture) {

    hero.willMove = true;

    if (frame.x + frame.width < worldTexture.width && hero.x === gameScreen.width / 2) {
        frame.futureX = frame.x + HERO_SPEED;
        //player
    } else {

        if (hero.x + hero.width / 2 < gameScreen.width) {
            hero.futureX = hero.x + HERO_SPEED;
        }
    }
}

function updateHeroPosition(hero, heroSheet) {
    hero.x = hero.futureX;
    hero.y = hero.futureY;
}

function updateCameraPosition(frame) {

    frame.x = frame.futureX;
    frame.y = frame.futureY;
}

function updateHeroView(hero, heroSheet) {
    if (!hero.playing && hero.willMove) {
        hero.textures = heroSheet.animations["run"];
        hero.play();
    }
}


function idle(hero, heroSheet) {
    if (hero.playing) {
        hero.stop();
        hero.textures = [heroSheet.textures["idle_0.png"]];
    }
}

function regsiterKeyboardInputs(ev) {
    inputQueue.push(ev.key);
}

function unRegsiterKeyboardInputs(ev) {
    inputReleaseQueue.push(ev.key);
}


function handleKeyboardInputs(hero, heroSheet, frame, worldTexture) {
    switch (inputQueue.pop()) {
        case "z":
            console.log("Je vais en avant!");
            moveTop(frame, hero);
            break;
        case "q":
            console.log("Je vais à gauche!");
            moveLeft(frame, hero, worldTexture);
            break;
        case "s":
            console.log("Je vais en arrière!");
            moveBottom(frame, hero, worldTexture);
            break;
        case "d":
            console.log("Je vais à droite!");
            moveRight(frame, hero, worldTexture);
            break;
        default:
            break;
    }
}


function handleKeyboardRelease(hero, heroSheet) {
    if (["z", "q", "s", "d"].includes(inputReleaseQueue.pop())) {
        idle(hero, heroSheet);
        hero.willMove =false;
    }
}


function handleCollisions(hero, heroWorldPositionX, heroWorldPositionY, worldBoxes) {
    return heroWorldPositionX >= worldBoxes[0].x
        && heroWorldPositionX <= worldBoxes[0].x + worldBoxes[0].width
        && heroWorldPositionY >= worldBoxes[0].y
        && heroWorldPositionY <= worldBoxes[0].y + worldBoxes[0].height;


}

function gameLoop(delta, map, hero, heroSheet, frame, worldTexture, worldBoxes) {

    //INPUT

    frame.futureX = frame.x;
    frame.futureY = frame.y;

    hero.futureX = hero.x;
    hero.futureY = hero.y;

    //To replace by a state
    //hero.willMove = false;

    handleKeyboardInputs(hero, heroSheet, frame, worldTexture);

    //PREDICTIONS
    //We are making predictions about the FUTURE of the game
    let cameraCentreX = frame.futureX + frame.width / 2;
    let cameraCentreY = frame.futureY + frame.height / 2;
    //console.log(`Coordinates of the camera in the world (centre coordinates) : ${cameraCentreX} , ${cameraCentreY}`);
    //console.log(`Hero coordinates in the camera frame : ${hero.x}, ${hero.y}`);
    // We need deltaX and deltaY diff between the hero position and the middle of the screen
    let heroDeltaX = gameScreen.width / 2 - hero.futureX;
    let heroDeltaY = gameScreen.height / 2 - hero.futureY;
    //console.log(`DeltaY, DeltaY : ${heroDeltaX} ${heroDeltaY}`);

    let heroWorldPositionX = cameraCentreX - heroDeltaX;
    let heroWorldPositionY = cameraCentreY - heroDeltaY;

    //console.log(`wold size: width : ${worldTexture.width} , height :  ${worldTexture.height}` );

    let willCollide = handleCollisions(hero, heroWorldPositionX, heroWorldPositionY, worldBoxes);

    //APLLYING CHANGES
    updateHeroView(hero, heroSheet);

    //We are appliying 
    if (!willCollide) {
        updateHeroPosition(hero, heroSheet);
        updateCameraPosition(frame);
    }

    handleKeyboardRelease(hero, heroSheet);
    map.updateUvs();



}