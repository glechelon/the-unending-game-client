const { Config } = require("./config/config");
import * as PIXI from 'pixi.js';



//Load game configuration
var gameScreen = { width: 800, height: 600 };
var config = new Config(gameScreen);

var ke
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
    var heroSheet = app.loader.resources["hero"].spritesheet;
    var hero = new PIXI.AnimatedSprite([heroSheet.textures["idle_0.png"]]);
    hero.animationSpeed = 0.2;
    hero.loop = true;
    hero.anchor.set(0.5);
    hero.x = gameScreen.width / 2;
    hero.y = gameScreen.height / 2;
    hero.name = "hero";
    let gameContainer = new PIXI.Container();
    gameContainer.addChild(hero);
    gameContainer.interactive = true;
    gameContainer.name = "gameContainer";
    app.stage.removeChildren();
    app.stage.addChild(gameContainer);
    console.time();
    window.addEventListener("keydown", (ev) => handleKeyboardInputs(ev, hero, heroSheet));
    window.addEventListener("keyup", (ev) => handleKeyboardRelease(ev, hero, heroSheet));
    app.ticker.add((delta, ero) => gameLoop(delta, hero));
    console.timeEnd;


}


function handleKeyboardInputs(ev, hero, heroSheet) {
    switch (ev.key) {
        case "z":
            console.log("Je vais en avant!");
            if (!hero.playing) {
                hero.textures = heroSheet.animations["run"];
                hero.play();
            }
            if (hero.y - hero.height / 2 > 0) {
                hero.y += -5;
            }
            break;
        case "q":
            console.log("Je vais à gauche!");
            if (!hero.playing) {
                hero.textures = heroSheet.animations["run"];
                hero.play();
            }
            if (hero.x - hero.width / 2 > 0) {
                hero.x += -5;
            }
            break;
        case "s":
            console.log("Je vais en arrière!");
            if (!hero.playing) {
                hero.textures = heroSheet.animations["run"];
                hero.play();
            }
            if (hero.y + hero.height / 2 < gameScreen.height) {
                hero.y += 5;
            }
            break;
        case "d":
            console.log("Je vais à droite!");
            if (!hero.playing) {
                hero.textures = heroSheet.animations["run"];
                hero.play();
            }
            if (hero.x + hero.width / 2 < gameScreen.width) {
                hero.x += 5;
            }
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


function gameLoop(delta, hero) {

}