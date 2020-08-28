const { Config } = require("./config/config");
import * as PIXI from 'pixi.js';



//Load game configuration
var gameScreen = { width: 800, height: 600 };
var config = new Config(gameScreen);


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
    .add("assets/img/arrowBeige_left.png")
    .add("assets/img/arrowBeige_right.png");

//Init the game view
document.body.appendChild(app.view);

var titleTxt = new PIXI.Text("The unending", { fill: 'red', fontSize: '80px' });
titleTxt.x = gameScreen.width / 2 - titleTxt.width / 2;
titleTxt.y = gameScreen.height / 2 - titleTxt.height / 2 - 100;

var playTxt = new PIXI.Text("Play", { fill: 'gold', fontSize: '50px' });
playTxt.x = gameScreen.width / 2 - playTxt.width / 2;
playTxt.y = gameScreen.height / 2 - playTxt.height / 2;
playTxt.interactive = true;
playTxt.on('click', play);

var welcomeContainer = new PIXI.Container();
welcomeContainer.addChild(titleTxt);
welcomeContainer.addChild(playTxt);
app.stage.addChild(welcomeContainer);

console.log(welcomeContainer);

function play() {

    console.log("play");

    var arrowLeft = new PIXI.Sprite(app.loader.resources["assets/img/arrowBeige_left.png"].texture);
    arrowLeft.x = gameScreen.width * 1 / 4 - arrowLeft.width / 2;
    arrowLeft.y = gameScreen.height / 2;


    var arrowRight = new PIXI.Sprite(app.loader.resources["assets/img/arrowBeige_right.png"].texture);
    arrowRight.x = (gameScreen.width - arrowRight.width / 2) * 3 / 4;
    arrowRight.y = gameScreen.height / 2;

    var titleTxt = new PIXI.Text("The unending", { fill: 'red', fontSize: '80px' });
    titleTxt.x = gameScreen.width / 2 - titleTxt.width / 2;
    titleTxt.y = gameScreen.height / 2 - titleTxt.height / 2 - 100;

    var menuContainer = new PIXI.Container();
    menuContainer.addChild(arrowLeft);
    menuContainer.addChild(arrowRight);
    menuContainer.addChild(titleTxt);

    app.stage.removeChildAt(app.stage.children.length - 1);
    app.stage.addChild(menuContainer);

    console.log(menuContainer);

}