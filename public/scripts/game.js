document.getElementById("bgMusic").volume = 0.35;
document.getElementById("soundEffect1").volume = 0.5;
document.getElementById("soundEffect2").volume = 0.5;
var player1Name = document.getElementById("player1").innerHTML.toLowerCase();
var player2Name = document.getElementById("player2").innerHTML.toLowerCase();

//DEFINES PRESET VARIABLES
var ctx = document.getElementById("ctx").getContext("2d");
var WIDTH = 1000;
var HEIGHT = 500;
var totalResources = 22;
var numResourcesLoaded = 0;
var fps = 38;
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
loadImage(player1Name + "_left_arm");
loadImage(player1Name + "_legs");
loadImage(player1Name + "_body");
loadImage(player1Name + "_right_arm");
loadImage(player1Name + "_head");
loadImage(player1Name + "_hair");
loadImage(player1Name + "_ranged");
loadImage(player1Name + "_left_arm-left");
loadImage(player1Name + "_legs-left");
loadImage(player1Name + "_body-left");
loadImage(player1Name + "_right_arm-left");
loadImage(player1Name + "_head-left");
loadImage(player1Name + "_hair-left");
loadImage(player1Name + "_ranged-left");
loadImage(player1Name + "_left_arm-damage");
loadImage(player1Name + "_left_arm-left-damage");
loadImage(player1Name + "_right_arm-damage");
loadImage(player1Name + "_right_arm-left-damage");
loadImage(player1Name + "_head-damage");
loadImage(player1Name + "_head-left-damage");
loadImage(player1Name + "_special");

//LOADS PLAYER 2
loadImage(player2Name + "_left_arm");
loadImage(player2Name + "_legs");
loadImage(player2Name + "_body");
loadImage(player2Name + "_right_arm");
loadImage(player2Name + "_head");
loadImage(player2Name + "_hair");
loadImage(player2Name + "_ranged");
loadImage(player2Name + "_left_arm-left");
loadImage(player2Name + "_legs-left");
loadImage(player2Name + "_body-left");
loadImage(player2Name + "_right_arm-left");
loadImage(player2Name + "_head-left");
loadImage(player2Name + "_hair-left");
loadImage(player2Name + "_ranged-left");
loadImage(player2Name + "_left_arm-damage");
loadImage(player2Name + "_left_arm-left-damage");
loadImage(player2Name + "_right_arm-damage");
loadImage(player2Name + "_right_arm-left-damage");
loadImage(player2Name + "_head-damage");
loadImage(player2Name + "_head-left-damage");
loadImage(player2Name + "_special");

var actorList = {};
var entityList = {};

//GETS DIRECTION OF PLAYER
var getValue = function(player) {
  if (actorList[player].directionFacing === "left") {
    return -5;
  }
  else {
    return 55;
  }
};
//MELEE ATTACK
var melee = function(player, name){
  var hit = {
    id: Math.random(),
    originX: actorList[player].spawnX + getValue(player),
    originY: actorList[player].spawnY + 80,
    moveX: 30,
    direction: actorList[player].directionFacing,
    duration: 19,
    height: 20,
    width: 20,
    shotBy: player,
    shotByName: name,
    attackType: "melee",
  }
  entityList[hit.id] = hit;
};

//SHOOTS FIREBALL
var shootRangedAttack = function(player, name){
  var ranged = {
    id: Math.random(),
    originX: actorList[player].spawnX + getValue(player),
    originY: actorList[player].spawnY + 80,
    moveX: 30,
    direction: actorList[player].directionFacing,
    duration: 0,
    height: 20,
    width: 20,
    shotBy: player,
    shotByName: name,
    attackType: "ranged",
  }
  entityList[ranged.id] = ranged;
};

//SPECIAL ATTACK
var shootSpecialAttack = function(player, name) {
  var special = {
    id: Math.random(),
    originX: 0,
    originY: -700,
    moveY: 15,
    direction: actorList[player].directionFacing,
    duration: -100,
    height: 20,
    width: 1000,
    shotBy: player,
    shotByName: name,
    attackType: "special",
  }
  entityList[special.id] = special;

}

//PLAYER OBJECT
var spawn = function(player, name, spawnX, spawnY, facingRight, facingLeft, directionFacing){
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
    meleeAttackCounter: 10,
    rangedAttackCounter: 40,
    meleeAttackCounter: 10,
    specialAttackCounter: 2000,
    facingRight: facingRight,
    facingLeft: facingLeft,
    jumping: false,
    damage: false,
    directionFacing: directionFacing,
    meleeAttack: function(){
      if (actorList[player].meleeAttackCounter >= 10) {
        melee(player, name);
        actorList[player].meleeAttackCounter = 0;
      }
    },
    rangedAttack: function(){
      if (actorList[player].rangedAttackCounter >= 40){
        shootRangedAttack(player, name);
        actorList[player].rangedAttackCounter = 0;
        soundEffect(player).src = "audio/fireball.mp3";
        soundEffect(player).play();
      }
    },
    specialAttack: function(){
      if (actorList[player].specialAttackCounter >= 2000) {
        shootSpecialAttack(player, name);
        actorList[player].specialAttackCounter = 0;
      }
    },
  }
  actorList[player] = actor;
};

//SPAWNS PLAYER 1 AND 2
spawn(1, player1Name, 20, 20, true, false, "right");
spawn(2, player2Name, 800, 20, false, true, "left");

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
  for (key in actorList){
    if (actorList[key].movingRight){
      actorList[key].spawnX += 10;
    }
    if (actorList[key].movingLeft) {
      actorList[key].spawnX -= 10;
    }
  }
  if (actorList[1].jumping) {
    actorList[1].spawnY -= 40;
    setTimeout(function() { actorList[1].jumping = false;}, 150); //ENABLES GRAVITY AFTER JUMP
  }
  if (actorList[2].jumping) {
    actorList[2].spawnY -= 40;
    setTimeout(function() { actorList[2].jumping = false;}, 150);
  }
};
//WHEN GAME ENDS
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
      delete entityList[key]; //DELETES ENTITY AFTER EXPIRATION
    }
    else { //DETERMINES DIRECTION AND TYPE OF ATTACK
      if (entityList[key].direction === "right"){
        if (entityList[key].attackType === "melee") {
          ctx.drawImage(images[entityList[key].shotByName + "_left_arm"], entityList[key].originX += entityList[key].moveX, entityList[key].originY);
        }
        else if (entityList[key].attackType === "ranged") {
          ctx.drawImage(images[entityList[key].shotByName + "_ranged"], entityList[key].originX += entityList[key].moveX, entityList[key].originY);
        }
        else if (entityList[key].attackType === "special") {
          ctx.drawImage(images[entityList[key].shotByName + "_special"], entityList[key].originX, entityList[key].originY += entityList[key].moveY);
        }
      }
      else if (entityList[key].direction === "left"){
        if (entityList[key].attackType === "melee") {
          ctx.drawImage(images[entityList[key].shotByName + "_left_arm"], entityList[key].originX -= entityList[key].moveX, entityList[key].originY);
        }
        else if (entityList[key].attackType === "ranged") {
          ctx.drawImage(images[entityList[key].shotByName + "_ranged-left"], entityList[key].originX -= entityList[key].moveX, entityList[key].originY);
        }
        else if (entityList[key].attackType === "special") {
          ctx.drawImage(images[entityList[key].shotByName + "_special"], entityList[key].originX, entityList[key].originY += entityList[key].moveY);
        }
      }
      entityList[key].duration++;
    }
  }
};
//DRAWS PLAYER WHEN NEEDED
var updateActor = function(actorList) {
  for (var key in actorList) {
    if (actorList[key].spawnY <= HEIGHT - actorList[key].spawnHeight) {
      if (actorList[key].jumping === false) { //ENABLES GRAVITY IF CHARACTER IS NOT JUMPING
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
    if (actorList[key].facingRight === true) { //RENDERS CHARACTER WITH BREATHING ANIMATION
      ctx.drawImage(images[actorList[key].name + "_right_arm"], x , y - breathAmt);
      ctx.drawImage(images[actorList[key].name + "_body"], x, y);
      ctx.drawImage(images[actorList[key].name + "_legs"], x, y);
      ctx.drawImage(images[actorList[key].name + "_left_arm"], x  , y - breathAmt);
      ctx.drawImage(images[actorList[key].name + "_head"], x , y - breathAmt);
      ctx.drawImage(images[actorList[key].name + "_hair"], x , y - breathAmt);
    }
    if (actorList[key].facingLeft === true) {
      ctx.drawImage(images[actorList[key].name + "_right_arm-left"], x , y - breathAmt);
      ctx.drawImage(images[actorList[key].name + "_body-left"], x, y);
      ctx.drawImage(images[actorList[key].name + "_legs-left"], x, y);
      ctx.drawImage(images[actorList[key].name + "_left_arm-left"], x  , y - breathAmt);
      ctx.drawImage(images[actorList[key].name + "_head-left"], x , y - breathAmt);
      ctx.drawImage(images[actorList[key].name + "_hair-left"], x , y - breathAmt);
    }
    if (actorList[key].damage === true && actorList[key].facingRight === true) {
      ctx.drawImage(images[actorList[key].name + "_right_arm-damage"], x , y - breathAmt);
      ctx.drawImage(images[actorList[key].name + "_body"], x, y);
      ctx.drawImage(images[actorList[key].name + "_legs"], x, y);
      ctx.drawImage(images[actorList[key].name + "_left_arm-damage"], x  , y - breathAmt);
      ctx.drawImage(images[actorList[key].name + "_head-damage"], x , y - breathAmt);
      ctx.drawImage(images[actorList[key].name + "_hair"], x , y - breathAmt);
    }
    if (actorList[key].damage === true && actorList[key].facingLeft === true) {
      ctx.drawImage(images[actorList[key].name + "_right_arm-left-damage"], x , y - breathAmt);
      ctx.drawImage(images[actorList[key].name + "_body-left"], x, y);
      ctx.drawImage(images[actorList[key].name + "_legs-left"], x, y);
      ctx.drawImage(images[actorList[key].name + "_left_arm-left-damage"], x  , y - breathAmt);
      ctx.drawImage(images[actorList[key].name + "_head-left-damage"], x , y - breathAmt);
      ctx.drawImage(images[actorList[key].name + "_hair-left"], x , y - breathAmt);
    }
    actorList[key].jumpCounter++; //UPDATES ALL PLAYER COUNTERS
    actorList[key].meleeAttackCounter++;
    actorList[key].rangedAttackCounter++;
    actorList[key].specialAttackCounter++;
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
  //MELEE ATTACK
  else if (event.keyCode === 67) {
    actorList[1].meleeAttack();
  }
  //RANGED ATTACK
  else if (event.keyCode === 70) {
    actorList[1].rangedAttack();
  }
  //SPECIAL ATTACK
  else if (event.keyCode === 88) {
    actorList[1].specialAttack();
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
  else if (event.keyCode === 191) {
    actorList[2].meleeAttack();
  }
  else if (event.keyCode === 190) {
    actorList[2].rangedAttack();
  }
  else if (event.keyCode === 188) {
    actorList[2].specialAttack();
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
     actorList[1].spawnHeight + actorList[1].spawnY > entityList[entity].originY &&
     entityList[entity].shotBy != actorList[1].player) {
       actorList[1].damage = true;
       setTimeout(function() {actorList[1].damage = false;}, 200);
       if (entityList[entity].attackType === "melee") {
        actorList[1].hp -= 1;
       }
       else if (entityList[entity].attackType === "ranged") {
         actorList[1].hp -= 3;
       }
       else if (entityList[entity].attackType === "special") {
         actorList[1].hp -= 5;
       }
       delete entityList[entity];
       soundEffect(1).src = "audio/kell_pain.mp3";
       soundEffect(1).play();
    }
    if (actorList[2].spawnX < entityList[entity].originX + entityList[entity].width &&
     actorList[2].spawnX + actorList[2].spawnWidth > entityList[entity].originX &&
     actorList[2].spawnY < entityList[entity].originY + entityList[entity].height &&
     actorList[2].spawnHeight + actorList[2].spawnY > entityList[entity].originY &&
     entityList[entity].shotBy !== actorList[2].player) { //ALLOWS ONLY VALID COLLISIONS (PLAYER CANNOT DAMAGE SELF)
       actorList[2].damage = true;
       setTimeout(function() {actorList[2].damage = false;}, 200);
       if (entityList[entity].attackType === "melee") {
        actorList[2].hp -= 1; //MELEE ATTACK DOES 1HP DAMAGE
       }
       else if (entityList[entity].attackType === "ranged") {
         actorList[2].hp -= 3; //RANGED ATTACK DOES 3HP DAMAGE
       }
       else if (entityList[entity].attackType === "special") {
         actorList[2].hp -= 5; //SPECIAL ATTACK DOES 5HP DAMAGE
       }
       delete entityList[entity];
       soundEffect(2).src = "audio/kell_pain.mp3"; //PLAYS SOUND EFFECT ON DAMAGE TAKEN
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
