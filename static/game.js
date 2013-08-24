var sprites = {
 ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
 missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
 enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
 enemy_bee: { sx: 79, sy: 0, w: 37, h: 43, frames: 1 },
 enemy_ship: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
 enemy_circle: { sx: 158, sy: 0, w: 32, h: 33, frames: 1 },
 explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }
};

var enemies = {
  straight: { x: 0,   y: -50, sprite: 'enemy_ship', health: 10, 
              E: 100 },
  ltr:      { x: 0,   y: -100, sprite: 'enemy_purple', health: 10, 
              B: 75, C: 1, E: 100  },
  circle:   { x: 250,   y: -50, sprite: 'enemy_circle', health: 10, 
              A: 0,  B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI/2 },
  wiggle:   { x: 100, y: -50, sprite: 'enemy_bee', health: 20, 
              B: 50, C: 4, E: 100 },
  step:     { x: 0,   y: -50, sprite: 'enemy_circle', health: 10,
              B: 150, C: 1.2, E: 75 }
};

var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16;

var startGame = function() {
  //Game.setBoard(1,new Starfield(50,0.6,100));
 // Game.setBoard(2,new Starfield(100,1.0,50));
  //gPhysicsEngine.create();
  Game.setBoard(0, new Background());          // Blue
  Game.setBoard(1, new Snowfield(4,20,0.6,300, "#1e90ff", false));
  Game.setBoard(3, new TitleScreen("Enchanted Forest", 
                                  "Press space to start playing.",
                                  playGame));

};

var level1 = [
 // Start,   End, Gap,  Type,   Override
  [ 0,      4000,  500, 'step' ],
  [ 6000,   13000, 800, 'ltr' ],
  [ 10000,  16000, 400, 'circle' ],
  [ 17800,  20000, 500, 'straight', { x: 50 } ],
  [ 18200,  20000, 500, 'straight', { x: 90 } ],
  [ 18200,  20000, 500, 'straight', { x: 10 } ],
  [ 22000,  25000, 400, 'wiggle', { x: 150 }],
  [ 22000,  25000, 400, 'wiggle', { x: 100 }]
];


var playGame = function() {
  var board = new GameBoard();

  //board.add(new Level(level1,winGame));
  board.add('MainChar');
  board.add('Wolf');
  board.add('Bee');
  board.add('Roach');


  Game.setBoard(3,board);
};

var winGame = function() {
  Game.setBoard(3,new TitleScreen("You win!", 
                                  "Press fire to play again",
                                  playGame));
};

var loseGame = function() {
  Game.setBoard(3,new TitleScreen("You lose!", 
                                  "Press fire to play again",
                                  playGame));
};

window.addEventListener("load", function() {
  
  Game.initialize("game", "/static/spriteinfo/SpriteSheet.json");
});

var Snowfield = function(size,speed,opacity,numStars, color, clear) {

  // Set up the offscreen canvas
  var snow = document.createElement("canvas");
  snow.width = 7000; 
  snow.height = Game.height;
  var snowCtx = snow.getContext("2d");
  snowCtx.lineWidth = 1;
  var offset = 0;

  // If the clear option is set, 
  // make the background black instead of transparent
  if(clear) {
    snowCtx.fillStyle = "#000";
    snowCtx.fillRect(0,0,snow.width,snow.height);
  }

  // Now draw a bunch of random 2 pixel
  // rectangles onto the offscreen canvas
  snowCtx.fillStyle = color;
  snowCtx.globalAlpha = opacity;

  for(var i=0;i<numStars;i++) {
    var x = Math.floor(Math.random()*snow.width);
    var y = Math.floor(Math.random()*snow.height);

    var Rgrad = snowCtx.createRadialGradient(x,y, size/2, x+2,y+1, (size/4));
    
    Rgrad.addColorStop(0, '#8ED6FF');
      // dark blue
    Rgrad.addColorStop(1, '#004CB3');
    
    snowCtx.beginPath();
    snowCtx.arc(x,y,size/2,0,2*Math.PI);
    snowCtx.fillStyle = Rgrad;
    snowCtx.fill();
  }

  // This method is called every frame
  // to draw the starfield onto the canvas
  this.draw = function(ctx) {
    var intOffset = Math.floor(offset);
    var remaining = snow.height - intOffset;

    // Draw the top half of the starfield
    if(intOffset > 0) {
      ctx.drawImage(snow,
                0, remaining,
                snow.width, intOffset,
                0 - gMap.viewRect.x, 0,
                snow.width, intOffset);
    }

    // Draw the bottom half of the starfield
    if(remaining > 0) {
      ctx.drawImage(snow,
              0, 0,
              snow.width, remaining,
              0 - gMap.viewRect.x, intOffset,
              snow.width, remaining);
    }
  };

  // This method is called to update
  // the starfield
  this.step = function(dt) {
    offset += dt * speed;
    offset = offset % snow.height;
  };
};

var Background = function(){
  this.x = -10;//pos in x
  this.y = -5;//pos in y
  var fps = 0;
  var drawfps = 0;
  var total_time = Date.now();
  this.angle = 0;
  
  this.v = 2;

  this.default_t = 0.65;
  this.t = this.default_t;

  this.step = function(dt) {
    fps++;
    
    if(VisibleMovingLeaves(leafs[0]) || VisibleMovingLeaves(leafs[1])){
      if(this.t < 0){
        this.x += Math.sin(this.angle) * this.v;
        this.y += Math.cos(this.angle) * this.v;

        this.angle += 90;
      
        this.t = this.default_t;
      }
      else{
        this.t -= dt;
      }
    }
  };

  this.draw = function(ctx){
      gMap.draw(ctx);
      
      //framerate test
      if(Date.now() - total_time >= 1000){
        drawfps = fps;
        fps = 0;
        total_time = Date.now();
      }
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 15px Ariel";
      ctx.fillText("FPS: "+ drawfps, Game.width-30,Game.height-5);

      if(SpriteSheet.leafs[0].visible)
        ctx.drawImage(SpriteSheet.leafs[0].img, this.x + SpriteSheet.leafs[0].x - gMap.viewRect.x , this.y + SpriteSheet.leafs[0].y);
      if(SpriteSheet.leafs[1].visible)
        ctx.drawImage(SpriteSheet.leafs[1].img, this.x + SpriteSheet.leafs[1].x - gMap.viewRect.x, this.y + SpriteSheet.leafs[1].y);
  };
};

VisibleMovingLeaves = function (leaf) {
    var r2 = gMap.viewRect;
    var r1 = leaf;
    return (leaf.visible=gMap.intersectRect({
        top: r1.y,
        left: r1.x,
        bottom: r1.y + r1.h,
        right: r1.x + r1.w
    }, {
        top: r2.y,
        left: r2.x,
        bottom: r2.y + r2.h,
        right: r2.x + r2.w
    }));
};


