MainChar = EntityClass.extend ({

  count : null,
  default_t : null,
  t : null,
  v : null,
  maxVel: null,
  posI : {x:0, y:0},
  velI : {x:0, y:0},
  jumpTime : null,
  jumpType : 0,
  damage : 25,
  existsFloorCol : false,
  movTime : 0,
  time : null,
  animTime: 130,
  walk_frames : {start: 0, end: 2 },
  jump_frames : {start: 3, end:  5},

  init : function() {
    Resources.player = this;
    this.name = 'MainChar';
    this.frame = 0;
    this.count = 0;
    this.default_t = 0.12;
    this.hp = 100;
    this.attack = 15;
    this.t = this.default_t;
    this.maxVel = 0.13;
    this.vel = {x : this.maxVel, y : 0 };
    this.v = 0;
    this.pos = {x : 50, y : 0}; 
    this.scale = 0.40;
    this.size = {x : SpriteSheet.Sprites[this.name][this.frame].frame.w*this.scale, y : SpriteSheet.Sprites[this.name][this.frame].frame.h*this.scale };
    this.jumpTime = Date.now();
    this.posI.x = this.pos.x;
    this.posI.y = this.pos.y;
    this.movTime = Date.now();
    this.facing = 1;
    this.type = OBJECT_PLAYER;

    var entityDef = {
      id : 'MainChar',
      x : this.pos.x,
      y : this.pos.y,
      halfHeight : this.size.y/2,
      halfWidth : this.size.x/2,
      damping : 1 ,
      type: 'dynamic'
    };

     this.physBody = gPhysicsEngine.addBody(entityDef);
  },

  step : function(dt) {

    this.size.x = SpriteSheet.Sprites[this.name][this.frame].frame.w*this.scale;
    this.size.y = SpriteSheet.Sprites[this.name][this.frame].frame.h*this.scale;

    /*var TimeFrame = Date.now() - this.movTime;
    this.movTime += TimeFrame;

    if(Game.keys['left']) { 
      this.facing = -1;
     // this.vel.x = -this.maxVel;
    }
    else if(Game.keys['right']) {
      this.facing = 1;
    //  this.vel.x = this.maxVel;
    }
    else if(this.existsFloorCol){ 
      this.t = this.default_t; 
     // this.frame = 0;
      this.movTime = Date.now();
    }

    if( !(this.existsFloorCol= ( ( gMap.collisionTile(this.pos.x, this.pos.y+this.size.y ) || gMap.collisionTile(this.pos.x+(this.size.x/2), this.pos.y+this.size.y ) || gMap.collisionTile(this.pos.x+(this.size.x), this.pos.y+this.size.y )  ) ) ) ){
        this.ApplyVel(this.jumpTime, false, true);
        this.jumpAnim();
    }
    else{
      this.existsFloorCol = true;
      this.posI.y = this.pos.y ;//-gMap.tileSize.y/4
      this.jumpTime = Date.now();//not necessary
      this.vel.y = 0;
      if(Game.keys['up']){
        this.jumpTime = Date.now();
        this.pos.y -= gMap.tileSize.y/2;
        this.vel.y = -300.0/1000.0; 
      }
    
    }
    //ceil col
    if( !(gMap.collisionTile(this.pos.x, this.pos.y ) || gMap.collisionTile(this.pos.x+(this.size.x/2), this.pos.y ) || gMap.collisionTile(this.pos.x+(this.size.x), this.pos.y )) ){
      this.jumpTime = Date.now();
      this.vel.y = 0;
      this.posI.y = this.pos.y;
    }

    //east col
    if(Game.keys['right'] && !(gMap.collisionTile(this.pos.x+this.size.x, this.pos.y ) || gMap.collisionTile(this.pos.x+this.size.x, this.pos.y+ (this.size.y/2) )) ){//upper right/mid right corner of player sprite
      //if running or not in near future
      this.pos.x += this.vel.x*TimeFrame;
      this.walkAnim();
    }

    //west col
    if(Game.keys['left'] && !( gMap.collisionTile(this.pos.x, this.pos.y ) || gMap.collisionTile(this.pos.x, this.pos.y+ (this.size.y/2) )) ){
      this.pos.x += this.vel.x*TimeFrame*-1;
      this.walkAnim();
    }
    */

    this.pos.y = this.physBody.GetPosition().y*gPhysicsEngine.SCALE;
    //console.log(this.pos.y);
    if(this.pos.x < 0) { this.pos.x = 0; }
    else if(this.pos.x > 7000 - this.size.x) { 
        this.pos.x = 7000 - this.size.x;
    }

    if(this.pos.x >= Game.width/2 && this.pos.x < 6600){//6600 is end of level
      gMap.centerAt(Resources.player.pos.x, Game.height/2);
    }

    if(this.hp <= 0){
      this.board.remove(this);
    }


  },

  walkAnim : function(){
    if(!this.existsFloorCol) return;

    if(Date.now() - this.animTime > 130){
        this.animTime = Date.now();
        this.frame++;
    }

    if(this.frame > this.walk_frames.end)
      this.frame = this.walk_frames.start;
  },
  jumpAnim : function(){
    if(Date.now()-this.animTime > 100){
      if(this.frame<this.jump_frames.start ) this.frame = this.jump_frames.start-1;
      this.frame++;
      this.animTime = Date.now();
    }

  if(this.frame > this.jump_frames.end)
    this.frame = this.jump_frames.start;
  }

});


Game.factory['MainChar'] = MainChar;
