
(function() {

    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var LoadPercentage = 0;
var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_APPLE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_PLAYER_POWERUP = 16;


var Game = (function() {                                                                  
  var boards = [];
  Gravity = 9.8;// ms^2;
  PPM = 50.0;
  factory = {};
  var time;//to be used in game loop

  // Game Initialization
  this.initialize = function(canvasElementId,sprite_link) {
    this.canvas = document.getElementById(canvasElementId);
    this.width = this.canvas.width;
    this.height= this.canvas.height;

    this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
    if(!this.ctx) { return alert("Please upgrade your browser to play"); }

    this.setupInput();
    this.setBoard(0,new LoadBar(this.ctx));
    gPhysicsEngine.create();
    this.loop(); 

    //SpriteSheet.load(sprite_data);
    InitialLoad(sprite_link);
  };

  // Handle Input
  var KEY_CODES = {  87 : 'up', 65 : 'left', 68 : 'right' ,32 :'fire' };
  this.keys = {};

  this.setupInput = function() {
    window.addEventListener('keydown',function(e) {
      if(KEY_CODES[event.keyCode]) {
       Game.keys[KEY_CODES[event.keyCode]] = true;
       e.preventDefault();
      }
    },false);

    window.addEventListener('keyup',function(e) {
      if(KEY_CODES[event.keyCode]) {
       Game.keys[KEY_CODES[event.keyCode]] = false; 
       e.preventDefault();
      }
    },false);
  };

  
  this.loop = function() {
      requestAnimationFrame(this.loop);
      var now = new Date().getTime(), dt = now - (time || now);
      time = now;
      for(var i=0,len = boards.length;i<len;i++) {
        if(boards[i]) { 
          boards[i].step(dt/1000);
          boards[i].draw(Game.ctx);
        }
      }
      gPhysicsEngine.update(dt/1000);
  }
  // Change an active game board
  this.setBoard = function(num,board) { boards[num] = board; };
  return this;

})();

var Resources = {
  total_amnt_resources : 6,
  amnt_resources_loaded : 0,
  player : null
};

//Load initial resources to memory
var InitialLoad = function(spriteLink){

  var self = this;

    loadCount = function(){
        if(++Resources.amnt_resources_loaded === Resources.total_amnt_resources){
            startGame();
        }
        LoadPercentage = Resources.amnt_resources_loaded/Resources.total_amnt_resources;
    }

    //Load music
    xhrGet('/static/sounds/FindYou.ogg', playSound, 'arraybuffer');

    xhrGet(spriteLink, function(xhr){ 
      var map = JSON.parse(xhr.responseText);
      LoadEntities(map);
      loadCount();
    }, null);

    //Load Spritesheet
    SpriteSheet.image = new Image();
    SpriteSheet.image.onload = loadCount;
    SpriteSheet.image.src = '/static/images/SpriteSheet.png';


    //Load Moving Leaves
    SpriteSheet.leafs.push( {img : new Image(), x : 0, y : -50, w : 825, h : 400, visible : false  } );
    SpriteSheet.leafs.push( {img : new Image(), x : 1817, y : -55, w : 1000, h : 600, visible : false } );

   
    SpriteSheet.leafs[0].img.onload = loadCount;
    SpriteSheet.leafs[1].img.onload = loadCount;


    SpriteSheet.leafs[0].img.src = '/static/images/leafs.png';
    SpriteSheet.leafs[1].img.src = '/static/images/leafs2.png';

    
    gMap.load('/static/spriteinfo/TileSet.json');
    
};

var LoadEntities = function(map){
    for(SpriteName in map.frames){
      var spriteList = [ ];
      
      for(SpriteInfo in map.frames[SpriteName]){
        spriteList.push(map.frames[SpriteName][SpriteInfo]);
      }
      
      SpriteSheet.Sprites[SpriteName] = spriteList;
    }
};

var SpriteSheet = (function() {
  this.Sprites = { };
  this.leafs = [ ];

  var self = this;

  this.draw = function(ctx,sprite,x,y,frame) {
    var s = this.map[sprite];
    if(!frame) frame = 0;
    ctx.drawImage(this.image,
                     s.sx + frame * s.w, 
                     s.sy, 
                     s.w, s.h, 
                     Math.floor(x), Math.floor(y),
                     s.w, s.h);
  };
  return this;
})();

var LoadBar = function(){
    this.step = function(dt) {

    };

    this.draw = function(ctx) {
      ctx.font = "bold 20px Caesar Dressing";
      ctx.fillText("Loading",Game.width/2 - 30,Game.height/2 + 85);
      var grd=ctx.createRadialGradient(0,0,Game.width/6,Game.width,Game.height,Game.width/2);
      ctx.strokeStyle=grd;
      ctx.lineWidth = 5;
      var start_x_load = Game.width/2 - 140;
      var start_y_load = Game.height/2 + 90;
      ctx.strokeRect(start_x_load, start_y_load,250, 30);
      ctx.fillRect(start_x_load, start_y_load, 250*LoadPercentage, 30);
    };
};

var TitleScreen = function TitleScreen(title,subtitle,callback) {
  var up = false;
  
  this.step = function(dt) {
    if(!Game.keys['fire']) up = true;
    if(up && Game.keys['fire'] && callback) callback();
  };

  this.draw = function(ctx) {
    var grd=ctx.createRadialGradient(0,0,Game.width/6,Game.width,Game.height,Game.width/2);
    grd.addColorStop(0,"green");
    grd.addColorStop(1,"white");
    //ctx.fillStyle = "#FFFFFF";
    ctx.fillStyle=grd;
    ctx.textAlign = "center";

    ctx.font = "bold 60px Princess Sofia";
    ctx.fillText(title,Game.width/2,Game.height/2);

    ctx.font = "bold 30px Princess Sofia";
    ctx.fillText(subtitle,Game.width/2,Game.height/2 + 40);

  };
};


var playSound = function (xhr) {
    try {
          var context = new webkitAudioContext();

          var mainNode = context.createGainNode(0);
          mainNode.connect(context.destination);

          var clip = context.createBufferSource();

          context.decodeAudioData(xhr.response, function (buffer) {
              clip.buffer = buffer;
              clip.gain.value = 1.0;
              clip.connect(mainNode);
              clip.loop = true;
              clip.noteOn(0);
        }, function (data) {});

        if(++Resources.amnt_resources_loaded === Resources.total_amnt_resources){
            startGame();
        }

        LoadPercentage = Resources.amnt_resources_loaded/Resources.total_amnt_resources;
    }
    catch(e) {
        console.alert('Web Audio API is not supported in this browser');
    }
};

var GameBoard = function() {
  var board = this;

  // The current list of objects
  this.objects = [];
  this.cnt = {};

  // Add a new entities to the object list
  this.add = function(entity) { 
    var ent = new (Game.factory[entity])();
    ent.board=this; 
    this.objects.push(ent); 
    this.cnt[ent.type] = (this.cnt[ent.type] || 0) + 1;
    return ent; 
  };

  // Mark an entity for removal
  this.remove = function(ent) { 
    var idx = this.removed.indexOf(ent);
    if(idx == -1) {
      this.removed.push(ent); 
      return true;
    } else {
      return false;
    }
  };

  // Reset the list of removed objects
  this.resetRemoved = function() { this.removed = []; };

  // Removed an objects marked for removal from the list
  this.finalizeRemoved = function() {
    for(var i=0,len=this.removed.length;i<len;i++) {
      var idx = this.objects.indexOf(this.removed[i]);
      if(idx != -1) {
        this.cnt[this.removed[i].type]--;
        this.objects.splice(idx,1);
      }
    }
  };

  // Call the same method on all current objects 
  this.iterate = function(funcName) {
     var args = Array.prototype.slice.call(arguments,1);
     for(var i=0,len=this.objects.length;i<len;i++) {
       var obj = this.objects[i];
       obj[funcName].apply(obj,args);
     }
  };

  // Find the first object for which func is true
  this.detect = function(func) {
    for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
      if(func.call(this.objects[i])) return this.objects[i];
    }
    return false;
  };

  // Call step on all objects and them delete
  // any object that have been marked for removal
  this.step = function(dt) { 
    this.resetRemoved();
    this.iterate('step',dt);
    this.finalizeRemoved();
  };

  // Draw all the objects
  this.draw= function(ctx) {
    this.iterate('draw',ctx);
  };

  // Check for a collision between the 
  // bounding rects of two objects
  this.overlap = function(o1,o2) {
    return !((o1.y+o1.h-1<o2.y) || (o1.y>o2.y+o2.h-1) ||
             (o1.x+o1.w-1<o2.x) || (o1.x>o2.x+o2.w-1));
  };

  // Find the first object that collides with obj
  // match against an optional type
  this.collide = function(obj,type) {
    return this.detect(function() {
      if(obj != this) {
       var col = (!type || this.type & type) && board.overlap(obj,this);
       return col ? this : false;
      }
    });
  };


};

var Level = function(levelData,callback) {
  this.levelData = [];
  for(var i =0; i<levelData.length; i++) {
    this.levelData.push(Object.create(levelData[i]));
  }
  this.t = 0;
  this.callback = callback;
};


Level.prototype.step = function(dt) {
  var idx = 0, remove = [], curShip = null;

  // Update the current time offset
  this.t += dt * 1000;

  //   Start, End,  Gap, Type,   Override
  // [ 0,     4000, 500, 'step', { x: 100 } ]
  while((curShip = this.levelData[idx]) && 
        (curShip[0] < this.t + 2000)) {
    // Check if we've passed the end time 
    if(this.t > curShip[1]) {
      remove.push(curShip);
    } else if(curShip[0] < this.t) {
      // Get the enemy definition blueprint
      var enemy = enemies[curShip[3]],
          override = curShip[4];

      // Add a new enemy with the blueprint and override
      this.board.add(new Enemy(enemy,override));

      // Increment the start time by the gap
      curShip[0] += curShip[2];
    }
    idx++;
  }

  // Remove any objects from the levelData that have passed
  for(var i=0,len=remove.length;i<len;i++) {
    var remIdx = this.levelData.indexOf(remove[i]);
    if(remIdx != -1) this.levelData.splice(remIdx,1);
  }

  // If there are no more enemies on the board or in 
  // levelData, this level is done
  if(this.levelData.length === 0 && this.board.cnt[OBJECT_ENEMY] === 0) {
    if(this.callback) this.callback();
  }

};

Level.prototype.draw = function(ctx) { };