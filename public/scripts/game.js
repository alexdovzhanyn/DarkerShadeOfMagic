document.getElementById("bgMusic").volume = 0.35;
document.getElementById("soundEffect1").volume = 0.5;
document.getElementById("soundEffect2").volume = 0.5;

//DEFINES PRESET VARIABLES
var ctx = document.getElementById("ctx").getContext("2d");
var WIDTH = 1000;
var HEIGHT = 500;
var totalResources = 20;
var numResourcesLoaded = 0;
var fps = 30;
var timer = 200;
var images = {};
var over = false;

var soundEffect = function(number) {
  return document.getElementById("soundEffect" + number);
}

//CHECKS IF ALL RESOURCES LOADED
var resourceLoaded = function() {
  numResourcesLoaded += 1;
  if(numResourcesLoaded === totalResources && over === false) {
    var updateInterval = setInterval(update, 1000 / fps);
  }
};
//LOADS IMAGES FOR PLAYERS
var loadImage = function(name) {
  images[name] = document.createElement('img');
  images[name].onload = function() {
      resourceLoaded();
  }
  images[name].src = "images/" + name + ".png";
};
//LOADS PLAYER 1
loadImage("kell_left_arm");
loadImage("kell_legs");
loadImage("kell_body");
loadImage("kell_right_arm");
loadImage("kell_head");
loadImage("kell_hair");
loadImage("fireball");
loadImage("kell_left_arm-left");
loadImage("kell_legs-left");
loadImage("kell_body-left");
loadImage("kell_right_arm-left");
loadImage("kell_head-left");
loadImage("kell_hair-left");
loadImage("fireball-left");
loadImage("kell_left_arm-damage");
loadImage("kell_left_arm-left-damage");
loadImage("kell_right_arm-damage");
loadImage("kell_right_arm-left-damage");
loadImage("kell_head-damage");
loadImage("kell_head-left-damage");

var actorList = {};
var entityList = {};

//GETS DIRECTION OF PLAYER
var getValue = function(player) {
  if (actorList[player].directionFacing === "left") {
    return -20;
  }
  else {
    return 90;
  }
};
//SHOOTS FIREBALL
var shootFireball = function(player){
  var fireball = {
    id: Math.random(),
    originX: actorList[player].spawnX + getValue(player),
    originY: actorList[player].spawnY + 80,
    moveX: 20,
    direction: actorList[player].directionFacing,
    duration: 0,
    height: 20,
    width: 20,
    shotBy: player,
  }
  entityList[fireball.id] = fireball;
};
//PLAYER OBJECT
var spawn = function(player, name, spawnX, spawnY, facingRight, facingLeft){
  var actor = {
    player: player,
    name: name,
    spawnX: spawnX,
    spawnY: spawnY,
    hp: 20,
    changeY: -15,
    changeX: 0,
    spawnWidth: 70,
    spawnHeight: 190,
    jumpCounter: 0,
    attackCounter: 20,
    facingRight: facingRight,
    facingLeft: facingLeft,
    jumping: false,
    damage: false,
    directionFacing: "right",
    attack: function(){
      if (actorList[player].attackCounter >= 20){
        shootFireball(player);
        actorList[player].attackCounter = 0;
        soundEffect(player).src = "audio/fireball.mp3";
        soundEffect(player).play();
      }
    },
  }
  actorList[player] = actor;
};

//SPAWNS PLAYER 1 AND 2
spawn(1, "Kell", 20, 20, true, false);
spawn(2, "Lila", 800, 20, false, true);

//USED TO DRAW ELLIPSES
function drawEllipse(centerX, centerY, width, height, color) {
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - height/2);
  ctx.bezierCurveTo(
    centerX + width/2, centerY - height/2,
    centerX + width/2, centerY + height/2,
    centerX, centerY + height/2);
  ctx.bezierCurveTo(
    centerX - width/2, centerY + height/2,
    centerX - width/2, centerY - height/2,
    centerX, centerY - height/2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};
//SETS VARIABLES FOR BREATHING
var breathInc = 0.1;
var breathDir = 1;
var breathAmt = 0;
var breathMax = 2;
var breathInterval = setInterval(updateBreath, 1000 / fps);
//UPDATES BREATHING ANIMATION
function updateBreath() {
  if (breathDir === 1) {  // breath in
    breathAmt -= breathInc;
    if (breathAmt < -breathMax) {
      breathDir = -1;
    }
  }
  else {  // breath out
    breathAmt += breathInc;
    if(breathAmt > breathMax) {
      breathDir = 1;
    }
  }
};
//UPDATES PLAYERS LOCATION ON SCREEN
var updatePlayerPosition = function(){
  if (actorList[1].movingRight) {
    actorList[1].spawnX += 10;
  }
  if (actorList[1].movingLeft) {
    actorList[1].spawnX -= 10;
  }
  if (actorList[1].jumping) {
    actorList[1].spawnY -= 40;
    setTimeout(function() { actorList[1].jumping = false;}, 150);
  }
  if (actorList[2].movingRight) {
    actorList[2].spawnX += 10;
  }
  if (actorList[2].movingLeft) {
    actorList[2].spawnX -= 10;
  }
  if (actorList[2].jumping) {
    actorList[2].spawnY -= 40;
    setTimeout(function() { actorList[2].jumping = false;}, 150);
  }
};
var gameOver = function(player){
  over = true;
  ctx.clearRect(0,0,WIDTH,HEIGHT);
  ctx.fillStyle="black";
  ctx.fillRect(0,0,WIDTH, HEIGHT);
  ctx.font="80px Verdana";
  ctx.fillStyle="red";
  ctx.fillText(player.name + " LOSES!", WIDTH/2 - WIDTH/2/2 + 75,HEIGHT/2);
  setTimeout(function() { location.reload();}, 5000);
  clearInterval(updateInterval);
};
//UPDATES SHOTS
var updateEntities = function(entityList){
  for (var key in entityList) {
    if (entityList[key].duration >= 20) {
      delete entityList[key];
    }
    else {
      if (entityList[key].direction === "right"){
        ctx.drawImage(images["fireball"], entityList[key].originX += entityList[key].moveX, entityList[key].originY);
      }
      else if (entityList[key].direction === "left"){
        ctx.drawImage(images["fireball-left"], entityList[key].originX -= entityList[key].moveX, entityList[key].originY);
      }
      entityList[key].duration++;
    }
  }
};
//DRAWS PLAYER WHEN NEEDED
var updateActor = function(actorList) {
  for (var key in actorList) {
    if (actorList[key].spawnY <= HEIGHT - actorList[key].spawnHeight) {
      if (actorList[key].jumping === false) {
        actorList[key].spawnY -= actorList[key].changeY;
      }
    }
    if (actorList[key].spawnX === WIDTH - actorList[key].spawnWidth - 70) {
      actorList[key].movingRight = false;
    }
    if (actorList[key].spawnX === actorList[key].spawnWidth - 80) {
      actorList[key].movingLeft = false;
    }
    var x = actorList[key].spawnX;
    var y = actorList[key].spawnY;
    if (actorList[key].facingRight === true) {
      ctx.drawImage(images["kell_right_arm"], x , y - breathAmt);
      ctx.drawImage(images["kell_body"], x, y);
      ctx.drawImage(images["kell_legs"], x, y);
      ctx.drawImage(images["kell_left_arm"], x  , y - breathAmt);
      ctx.drawImage(images["kell_head"], x , y - breathAmt);
      ctx.drawImage(images["kell_hair"], x , y - breathAmt);
      drawEllipse(x + 85, y + 75 - breathAmt, 8, 14, "#4d88ff"); // Left Eye
      drawEllipse(x + 100, y + 75 - breathAmt, 8, 14, "black"); // Right Eye
      drawEllipse(x + 90, y + 165, 160 - breathAmt, 6);
    }
    if (actorList[key].facingLeft === true) {
      ctx.drawImage(images["kell_right_arm-left"], x , y - breathAmt);
      ctx.drawImage(images["kell_body-left"], x, y);
      ctx.drawImage(images["kell_legs-left"], x, y);
      ctx.drawImage(images["kell_left_arm-left"], x  , y - breathAmt);
      ctx.drawImage(images["kell_head-left"], x , y - breathAmt);
      ctx.drawImage(images["kell_hair-left"], x , y - breathAmt);
      drawEllipse(x + 65, y + 75 - breathAmt, 8, 14, "#4d88ff"); // Left Eye
      drawEllipse(x + 50, y + 75 - breathAmt, 8, 14, "black"); // Right Eye
      drawEllipse(x + 90, y + 165, 160 - breathAmt, 6);
    }
    if (actorList[key].damage === true && actorList[key].facingRight === true) {
      ctx.drawImage(images["kell_right_arm-damage"], x , y - breathAmt);
      ctx.drawImage(images["kell_body"], x, y);
      ctx.drawImage(images["kell_legs"], x, y);
      ctx.drawImage(images["kell_left_arm-damage"], x  , y - breathAmt);
      ctx.drawImage(images["kell_head-damage"], x , y - breathAmt);
      ctx.drawImage(images["kell_hair"], x , y - breathAmt);
      drawEllipse(x + 85, y + 75 - breathAmt, 8, 14, "#4d88ff"); // Left Eye
      drawEllipse(x + 100, y + 75 - breathAmt, 8, 14, "black"); // Right Eye
      drawEllipse(x + 90, y + 165, 160 - breathAmt, 6);
    }
    if (actorList[key].damage === true && actorList[key].facingLeft === true) {
      ctx.drawImage(images["kell_right_arm-left-damage"], x , y - breathAmt);
      ctx.drawImage(images["kell_body-left"], x, y);
      ctx.drawImage(images["kell_legs-left"], x, y);
      ctx.drawImage(images["kell_left_arm-left-damage"], x  , y - breathAmt);
      ctx.drawImage(images["kell_head-left-damage"], x , y - breathAmt);
      ctx.drawImage(images["kell_hair-left"], x , y - breathAmt);
      drawEllipse(x + 65, y + 75 - breathAmt, 8, 14, "#4d88ff"); // Left Eye
      drawEllipse(x + 50, y + 75 - breathAmt, 8, 14, "black"); // Right Eye
      drawEllipse(x + 90, y + 165, 160 - breathAmt, 6);
    }
    actorList[key].jumpCounter++;
    actorList[key].attackCounter++;
    if (actorList[key].hp <= 0){
      gameOver(actorList[key]);
    }
  };
  updatePlayerPosition();
};
//PLAYER CONTROLS
document.onkeydown = function(event) {
  if (event.keyCode === 68){
    actorList[1].movingRight = true;
    actorList[1].facingLeft = false;
    actorList[1].facingRight = true;
    actorList[1].directionFacing = "right";
  }
  else if (event.keyCode === 65){
    actorList[1].movingLeft = true;
    actorList[1].facingRight = false;
    actorList[1].facingLeft = true;
    actorList[1].directionFacing = "left";
  }
  //MAIN ATTACK
  else if (event.keyCode === 70) {
    actorList[1].attack();
  }
  else if (event.keyCode === 39){
    actorList[2].movingRight = true;
    actorList[2].facingLeft = false;
    actorList[2].facingRight = true;
    actorList[2].directionFacing = "right";
  }
  else if (event.keyCode === 37){
    actorList[2].movingLeft = true;
    actorList[2].facingRight = false;
    actorList[2].facingLeft = true;
    actorList[2].directionFacing = "left";
  }
  else if (event.keyCode === 190) {
    actorList[2].attack();
  }
};
//UNSET MOVEMENT AFTER KEY IS NO LONGER BEING PRESSED
document.onkeyup = function(event) {
  if (event.keyCode === 68){
    actorList[1].movingRight = false;
  }
  else if (event.keyCode === 65){
    actorList[1].movingLeft = false;
  }
  else if (event.keyCode === 39){
    actorList[2].movingRight = false;
  }
  else if (event.keyCode === 37){
    actorList[2].movingLeft = false;
  }
};
//PLAYER JUMP
document.onkeypress = function(event) {
  if (event.keyCode === 32){
    if (actorList[1].spawnY >= HEIGHT - actorList[1].spawnHeight) {
      actorList[1].jumping = true;
    };
  }
  if (event.keyCode === 13){
    if (actorList[2].spawnY >= HEIGHT - actorList[2].spawnHeight) {
      actorList[2].jumping = true;
    }
  }
};
//UPDATES HP BAR
var updatePlayerAttribute = function(actorList){
  ctx.font="30px Verdana";
  ctx.fillStyle="blue";
  ctx.fillText(actorList[1].name,10,30);
  ctx.fillText(actorList[2].name,900,30);
  ctx.fillStyle="red";
  ctx.fillText("HP:" + actorList[1].hp,10,60);
  ctx.fillText("HP:" + actorList[2].hp,900,60);
};
//COLLISION DETECTION
var detectCollision = function(actorList, entityList){
  for (entity in entityList) {
    if (actorList[1].spawnX < entityList[entity].originX + entityList[entity].width &&
     actorList[1].spawnX + actorList[1].spawnWidth > entityList[entity].originX &&
     actorList[1].spawnY < entityList[entity].originY + entityList[entity].height &&
     actorList[1].spawnHeight + actorList[1].spawnY > entityList[entity].originY) {
       actorList[1].damage = true;
       setTimeout(function() {actorList[1].damage = false;}, 200);
       actorList[1].hp -= 1;
       delete entityList[entity];
       soundEffect(1).src = "audio/kell_pain.mp3";
       soundEffect(1).play();
    }
    if (actorList[2].spawnX < entityList[entity].originX + entityList[entity].width &&
     actorList[2].spawnX + actorList[2].spawnWidth > entityList[entity].originX &&
     actorList[2].spawnY < entityList[entity].originY + entityList[entity].height &&
     actorList[2].spawnHeight + actorList[2].spawnY > entityList[entity].originY) {
       actorList[2].damage = true;
       setTimeout(function() {actorList[2].damage = false;}, 200);
       actorList[2].hp -= 1;
       delete entityList[entity];
       soundEffect(2).src = "audio/kell_pain.mp3";
       soundEffect(2).play();
    }
  }
};
//MAIN FUNCTION, CALLS OTHER FUNCTIONS
var update = function() {
  ctx.clearRect(0,0,WIDTH,HEIGHT);
  updatePlayerAttribute(actorList);
  updateActor(actorList);
  updateEntities(entityList);
  detectCollision(actorList, entityList);
  ctx.fillStyle="yellow";
  ctx.fillText(Math.round(timer),500,30);
  timer -= 0.025;
  if (timer <= 0) {
    gameOver(actorList[1]);
  }
};
