Wolf = EntityClass.extend ({

  count : null,
  default_t : null,
  t : null,
  v : null,
  maxVel: null,

  init : function() {
   // Resources.player = this;
    this.name = 'Wolf';
    this.frame = 0;
    this.count = 0;
    this.default_t = 0.12;
    this.hp = 100;
    this.attack = 15;
    this.t = this.default_t;
    this.maxVel = 250;
    this.v = 0;
    this.pos = {x : 50, y : 250 };
    this.scale = 0.70;
    this.size = {x : SpriteSheet.Sprites[this.name][this.frame].frame.w*this.scale, y : SpriteSheet.Sprites[this.name][this.frame].frame.h*this.scale };
    this.type = OBJECT_ENEMY;


  },

  step : function(dt) {
    this.size.x = SpriteSheet.Sprites[this.name][this.frame].frame.w*this.scale;
    this.size.y = SpriteSheet.Sprites[this.name][this.frame].frame.h*this.scale;



/*
    if(this.t < 0){
      this.frame = ++this.count % 9;
      this.t = this.default_t;
    }
    else{
      this.t -= dt;
    }

    this.pos.x += this.v * dt;

    if(this.pos.x < 0) { this.pos.x = 0; }
    else if(this.pos.x > 7000 - this.size.x) { 
        this.pos.x = 7000 - this.size.x;
    }

    this.size.x = SpriteSheet.Sprites[this.name][this.frame].frame.w;
    this.size.y = SpriteSheet.Sprites[this.name][this.frame].frame.h;



    if(this.hp <= 0){
      this.board.remove(this);
    }
  */},
});

Game.factory['Wolf'] = Wolf;