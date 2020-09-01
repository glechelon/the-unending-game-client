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
    .add("monster", "assets/img/pnj/pnjSpiteSheet.json")
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

    //this is the world map
    var worldTexture = new PIXI.Texture(app.loader.resources["map"].texture);

    var worldBoxes = [];
    worldBoxes.push({ x: 330, y: 840, width: 150, height: 150 });

    var box = new PIXI.Graphics();
    box.drawRect(330, 840, 150, 150);
    box.lineStyle(5, 0x000000);

    var world = new PIXI.Sprite(worldTexture);

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



    var monsterSheet = app.loader.resources["monster"].spritesheet;

    var monster = new PIXI.AnimatedSprite([monsterSheet.textures["tile000.png"]]);
    monster.animationSpeed = 0.2;
    monster.loop = true;
    monster.anchor.set(0.5);
    monster.position.set(200, 400);


    world.addChild(monster);
    world.addChild(box);
    world.x = -200;
    world.y = -800;



    //This is where the game is displayed
    let gameContainer = new PIXI.Container();
    gameContainer.addChild(world);
    gameContainer.interactive = true;
    gameContainer.name = "gameContainer";

    //We remove old displays and add the game display
    app.stage.removeChildren();
    app.stage.addChild(gameContainer);
    app.stage.addChild(hero);

    //We handle game inputs
    window.addEventListener("keydown", regsiterKeyboardInputs);
    window.addEventListener("keyup", unRegsiterKeyboardInputs);

    // Wre create the game loop
    app.ticker.add((delta, map) => gameLoop(hero, heroSheet, world, worldTexture, worldBoxes, gameContainer));


}


//needs the player and the camera
function moveTop(world, hero) {
    hero.willMove = true;
    //camera move
    if (world.y < 0 && hero.y === gameScreen.height / 2) {
        world.futureY = world.y + HERO_SPEED;
    } else {
        //player move
        if (hero.y - hero.height / 2 > 0) {
            hero.futureY = hero.y - HERO_SPEED;
        }
    }
}


function moveLeft(world, hero) {
    hero.willMove = true;
    if (world.x < 0 && hero.x === gameScreen.width / 2) {
        world.futureX = world.x + HERO_SPEED;
        //player
    } else {
        if (hero.x - hero.width / 2 > 0) {
            hero.futureX = hero.x - HERO_SPEED;
        }
    }
}


//Needs the player, the worldMap and the camera
function moveBottom(world, hero) {
    hero.willMove = true;
    //camera move
    // if camera bottom hasn't reached the end of the world and the playered is not centered
    //TODO a method of the class game that checks if a sprite is centered in the game screen
    //TODO: a method of the class game that checks if a point is still in the screen
    //TODO: a method of the class camera that returns the bottom y coordinate of the sprite  
    if (Math.abs(world.y) < world.height - gameScreen.height && hero.y === gameScreen.height / 2) {
        world.futureY = world.y - HERO_SPEED;
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

function moveRight(world, hero) {

    hero.willMove = true;

    //Camera offset X must be less than the MAX offset which is the size of the world minus the gameScreen
    if (Math.abs(world.x) < world.width - gameScreen.width && hero.x === gameScreen.width / 2) {
        world.futureX = world.x - HERO_SPEED;
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

function updateWorldPosition(world) {

    world.x = world.futureX;
    world.y = world.futureY;
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
        hero.willMove = false;
    }
}


function handleCollisions(hero, worldBoxes) {
    return Math.abs(hero.futureWorldPosition.x) >= worldBoxes[0].x
        && Math.abs(hero.futureWorldPosition.x) <= worldBoxes[0].x + worldBoxes[0].width
        && Math.abs(hero.futureWorldPosition.y) >= worldBoxes[0].y
        && Math.abs(hero.futureWorldPosition.y) <= worldBoxes[0].y + worldBoxes[0].height;


}


function computeFutureWorldPositions(world, hero){

    let deltaX = world.futureX - world.x +  hero.futureX - hero.x;
    let deltaY = world.futureY - world.y +  hero.futureY - hero.y;

    hero.futureWorldPosition = new PIXI.Point(hero.worldPosition.x +deltaX, hero.worldPosition.y + deltaY);
}

function gameLoop(hero, heroSheet, world, worldTexture, worldBoxes, gameContainer) {

    //INPUT

    world.futureX = world.x;
    world.futureY = world.y;

    hero.futureX = hero.x;
    hero.futureY = hero.y;

    hero.worldPosition = hero.toLocal(world);

    //To replace by a state

    handleKeyboardInputs(hero, heroSheet, world, worldTexture);

    //PREDICTIONS
    //We are making predictions about the FUTURE of the game

    computeFutureWorldPositions(world, hero);

    //TODO: a method of the Game class that returns a list of manifolds 
    let willCollide = handleCollisions(hero, worldBoxes);

    //APLLYING CHANGES
    updateHeroView(hero, heroSheet);

    //We are appliying 
    if (!willCollide) {
        updateHeroPosition(hero, heroSheet);
        updateWorldPosition(world);
    }

    handleKeyboardRelease(hero, heroSheet);

}