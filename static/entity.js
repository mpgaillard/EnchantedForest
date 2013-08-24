EntityClass = Class.extend({
    // can all be referenced by child classes
    name : null,
    pos : null,
    vel : null,
    size : null,
    scale : 1,
    facing : null,

    z : null,
    frame : null,

  merge : function(props) {
  		if(props) {
    		for (var prop in props) {
      			this[prop] = props[prop];
    		}
  		}
	},

  init : function(sprite ,props) {
  	this.merge(props);
  	this.frame = this.frame || 0;
  	this.size.x =  SpriteSheet.Sprites[this.name][this.frame].frame.w;
  	this.size.y =  SpriteSheet.Sprites[this.name][this.frame].frame.h;
	},

	hit : function(damage) {
  	this.board.remove(this);
	},
    // can be overloaded by child classes
  step : function(dt) {
    /*if(this.t < 0){
      this.frame = ++this.count % 3;
      this.pos.x += this.v;
      this.t = this.default_t;

    }
    else{
      this.t -= dt;
    }*/
  },

  draw : function(ctx){
      ctx.drawImage(SpriteSheet.image, SpriteSheet.Sprites[this.name][this.frame].frame.x, 
                                       SpriteSheet.Sprites[this.name][this.frame].frame.y, 
                                       SpriteSheet.Sprites[this.name][this.frame].frame.w, 
                                       SpriteSheet.Sprites[this.name][this.frame].frame.h,
                                       this.pos.x - gMap.viewRect.x, 
                                       this.pos.y, 
                                       SpriteSheet.Sprites[this.name][this.frame].spriteSourceSize.w*this.scale, 
                                       SpriteSheet.Sprites[this.name][this.frame].spriteSourceSize.h*this.scale);
  },

  ApplyVel : function (time, velX, gravity){
    var lapped_time;
    lapped_time = (Date.now() - time);
  
    if(velX)
      this.pos.x = this.vel.x*(lapped_time) + this.posI.x;
    if(gravity)//y = posInicial + v*t + 1/2(a*t^2)
      this.pos.y = this.posI.y + (this.vel.y*(lapped_time)) + (Game.Gravity * PPM * Math.pow( lapped_time, 2 )/(2.0*1000.0*1000.0));

  }


});