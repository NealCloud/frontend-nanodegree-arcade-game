
var Enemy = function(x,y,speed) {
    this.x = x;             //enemy cordinates given
    this.y = y;
    this.s = speed;         //variable speed added
    this.sprite = 'images/enemy-bug.png';
    allEnemies.push(this); //push instance to a list
}

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter (ok good to know)

        if(this.x > 600){       //check if bug has left the x boundary
            this.x = -200;      //reset bug to left side of screen
        }
        else{this.x += (this.s * dt);}   //move bug by speed * dt value

    if (this.x >= player.x - 10 && this.x <= player.x + 10
       && this.y >= player.y - 10 && this.y <= player.y + 10){
            player.death(); // activate death if player is within bug length
    }
}

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);  //draws bugs every frame
}

var Player = function(x,y){  //player class
    this.x = x; //starting coordinates
    this.y = y;
    this.died = "Good";
    this.start = false;// to initiate start
    this.score = 0;
    this.playerChoice = 3;  //to switch character
    this.sprite = 'images/char-boy.png'; //starting charcter choice
}

Player.prototype.update = function(dt,x,y){  //update player function
     if(this.y <= 50){  //checks if you won crossing y boundary
        this.y = 0;
        console.log("u win");
        this.died = "You made it! "
        this.score += 10;
        this.reset();
        this.bugout();
     }
}

Player.prototype.render = function(){  //keeps drawing player
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Player.prototype.death = function(){
    console.log("you died"); //death scene
    this.score -= 10;
    this.died = "Ouch Try again";
    var nope = allEnemies.pop();
    this.reset();
}
Player.prototype.reset = function(){
    this.x = 200;  //return to start
    this.y = 400;

    this.start = false;
    infoMain.clear();
    ctx.fillText("Select player with Right/Left and Up to Start", canvas.width/2, 610);
    ctx.fillText( this.died + " Score: " + player.score, canvas.width/2, 40);
}

Player.prototype.handleInput = function(input){  //input
    if(player.start == true){  //character choice "menu"

        player.move(input);
    }
    else{                       //delegates back to game controls
        player.select(input);
    }
}

Player.prototype.select = function(input){  //list of possible character sprites;
    var sprites = ['images/char-boy.png', 'images/char-horn-girl.png',
    'images/char-pink-girl.png','images/char-cat-girl.png','images/char-princess-girl.png'];
    var spriteLength = sprites.length - 1; //variables used to cycle through list
    var selection = this.playerChoice;
    switch(input){
        case "up": //starts the game
            this.start = true;
            infoMain.clear();
            infoMain.display();
            break;
        case "left":  //cycles through sprite list
            selection += selection < spriteLength ? 1 : -spriteLength;
            break;
        case "right":
            selection -= selection > 0 ? 1 : -spriteLength;
            break;
        default:
            console.log("wrong button");
    }
    this.playerChoice = selection;  //gives i back to playerChoice var to remember position in list
    player.sprite = sprites[selection];   //set player to current sprite in list
}
Player.prototype.move = function(input){ //move buttons
    switch(input){
        case "up":
            this.y -= this.y >= 50 ? 50 : 0;
            break;
        case "down":
            this.y += this.y <= 350 ? 50 : 0;
            break;
        case "left":
            this.x -= this.x >= 50 ? 50 : 0;
            break;
        case "right":
            this.x += this.x <= 350 ? 50 : 0;
            break;
        default:
            console.log("wrong button");
    }
}

var ScoreBoard = function (){
    this.score = 0;
    this.character = 0;
}
Player.prototype.bugout = function(){
    var bugY = [50,100,150,200,300,350];
    var y = bugY[Math.floor(Math.random()* bugY.length)];
    var s = Math.floor(Math.random()* 300) + 110;
    var bugger = new Enemy(0, y, s);
    console.log(s);
}

ScoreBoard.prototype.clear = function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

ScoreBoard.prototype.display = function(){
     ctx.fillText("Get to the Water!   Score: " + player.score, canvas.width/2, 40);

}
var infoMain = new ScoreBoard();
var allEnemies = [];  //create list for enemies
var player = new Player(200,400); //create a player with starting coords
var bug1 = new Enemy(0,250,400);// create bug enemy
var bug2 = new Enemy(0,100,140);

document.addEventListener('keyup', function(e) {  //keystroke translator
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

