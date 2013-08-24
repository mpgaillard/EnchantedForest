

CanvasTile = Class.extend({
    x: 0,
    y: 0,
    w: 32,
    h: 32,
    cvsHdl: null,
    ctx: null,


    create: function (width, height) {
        this.x = -1;
        this.y = -1;
        this.w = width;
        this.h = height;
        var can2 = document.createElement('canvas');
        can2.width = width;
        can2.height = height;
        this.cvsHdl = can2;
        this.ctx = can2.getContext('2d');
    },


    isVisible: function () {
        var r2 = gMap.viewRect;
        var r1 = this;
        return gMap.intersectRect({
            top: r1.y,
            left: r1.x,
            bottom: r1.y + r1.h,
            right: r1.x + r1.w
        }, {
            top: r2.y,
            left: r2.x,
            bottom: r2.y + r2.h,
            right: r2.x + r2.w
        });
    }

});


var TILEDMapClass = Class.extend({

    currMapData: null,


    tilesets: [],


    viewRect: {
        "x": 0,
        "y": 0,
        "w": 800,
        "h": 500
    },


    numXTiles: 100,
    numYTiles: 100,


    tileSize: {
        "x": 32,
        "y": 32
    },


    pixelSize: {
        "x": 64,
        "y": 64
    },


    imgLoadCount: 0,

    fullyLoaded: false,


    canvasTileSize: {
        "x": 32,
        "y": 32
    },


    canvasTileArray: [],


    load: function (map) {


        xhrGet(map, function (data) {

            gMap.parseMapJSON(data);
        }, null);
    },


    parseMapJSON: function (mapJSON) {

        gMap.currMapData = JSON.parse(mapJSON.responseText);


        var map = gMap.currMapData;
      

        gMap.numXTiles = map.width;
        gMap.numYTiles = map.height;
      

        gMap.tileSize.x = map.tilewidth;
        gMap.tileSize.y = map.tileheight;
      

        gMap.pixelSize.x = gMap.numXTiles * gMap.tileSize.x;
        gMap.pixelSize.y = gMap.numYTiles * gMap.tileSize.y;


        for(var i = 0; i < map.tilesets.length; i++) {

            var img = new Image();
            img.onload = function () {

                gMap.imgLoadCount++;
                if (gMap.imgLoadCount === map.tilesets.length) {

                    gMap.fullyLoaded = true;
                    gMap.preDrawCache();
                }
            };

            img.src = map.tilesets[i].image;

            var ts = {
                "firstgid": gMap.currMapData.tilesets[i].firstgid,


                "image": img,
                "imageheight": gMap.currMapData.tilesets[i].imageheight,
                "imagewidth": gMap.currMapData.tilesets[i].imagewidth,
                "name": gMap.currMapData.tilesets[i].name,


                "numXTiles": Math.floor(gMap.currMapData.tilesets[i].imagewidth / gMap.tileSize.x),
                "numYTiles": Math.floor(gMap.currMapData.tilesets[i].imageheight / gMap.tileSize.y)
            };

            gMap.tilesets.push(ts);

        }
    },


    getTilePacket: function (tileIndex) {


        var pkt = {
            "img": null,
            "px": 0,
            "py": 0
        };


        var tile = 0;
        for(tile = gMap.tilesets.length - 1; tile >= 0; tile--) {
            if(gMap.tilesets[tile].firstgid <= tileIndex) break;
        }


        pkt.img = gMap.tilesets[tile].image;

        var localIdx = tileIndex - gMap.tilesets[tile].firstgid;


        var lTileX = Math.floor(localIdx % gMap.tilesets[tile].numXTiles);
        var lTileY = Math.floor(localIdx / gMap.tilesets[tile].numXTiles);


        pkt.px = (lTileX * gMap.tileSize.x);
        pkt.py = (lTileY * gMap.tileSize.y);


        return pkt;
    },


    intersectRect: function (r1, r2) {

        return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
    },


    centerAt: function(x, y) {
       
        gMap.viewRect.x = x - (Game.width / 2);
        gMap.viewRect.y = y - (Game.height / 2);
        gMap.viewRect.w = Game.width;
        gMap.viewRect.h = Game.height;
    },

    //-----------------------------------------
    draw: function (ctx) {
        if(!gMap.fullyLoaded) return;


        for(var q = 0; q < gMap.canvasTileArray.length; q++) {
            var r1 = gMap.canvasTileArray[q];

            if(r1.isVisible()) ctx.drawImage(r1.cvsHdl, r1.x - gMap.viewRect.x, r1.y - gMap.viewRect.y);
        }
    },


    preDrawCache: function () {

        var xCanvasCount = /* YOUR CODE HERE */1 + Math.floor(gMap.pixelSize.x / gMap.canvasTileSize.x);
        var yCanvasCount = /* YOUR CODE HERE */1 + Math.floor(gMap.pixelSize.y / gMap.canvasTileSize.y);


        for(var yC = 0; yC < yCanvasCount; yC++) {
            for(var xC = 0; xC < xCanvasCount; xC++) {
                var canvasTile = new CanvasTile();
                canvasTile.create(gMap.canvasTileSize.x, gMap.canvasTileSize.y);
                canvasTile.x = xC * gMap.canvasTileSize.x;
                canvasTile.y = yC * gMap.canvasTileSize.y;
                gMap.canvasTileArray.push(canvasTile);

                gMap.fillCanvasTile(canvasTile);
            }
        }
        
        loadCount();

    },


    fillCanvasTile: function (ctile) {

        var ctx = ctile.ctx;
        ctx.fillRect(0, 0, ctile.w, ctile.h);
        var vRect = {
            top: ctile.y,
            left: ctile.x,
            bottom: ctile.y + ctile.h,
            right: ctile.x + ctile.w
        };


        for(var layerIdx = 0; layerIdx < gMap.currMapData.layers.length; layerIdx++) {

            if(gMap.currMapData.layers[layerIdx].type != "tilelayer") continue;


            var dat = gMap.currMapData.layers[layerIdx].data;


            for(var tileIDX = 0; tileIDX < dat.length; tileIDX++) {

                var tID = dat[tileIDX];
                if(tID === 0) continue;


                var tPKT = gMap.getTilePacket(tID);


                var worldX = Math.floor(tileIDX % gMap.numXTiles) * gMap.tileSize.x;
                var worldY = Math.floor(tileIDX / gMap.numXTiles) * gMap.tileSize.y;


                var visible = gMap.intersectRect(vRect, {
                    top: worldY,
                    left: worldX,
                    bottom: worldY + gMap.tileSize.y,
                    right: worldX + gMap.tileSize.x
                });

                if(!visible) continue;


                ctx.drawImage(tPKT.img, tPKT.px, tPKT.py, this.tileSize.x, this.tileSize.y, worldX - vRect.left, worldY - vRect.top, this.tileSize.x, this.tileSize.y);
            }
        }
    },

    collisionTile : function(x, y){

        var tile_x_num = Math.floor(x/this.tileSize.x);
        var tile_y_num = Math.floor(y/this.tileSize.y);

        //console.log(tile_x_num + "  " + tile_y_num);
        //console.log(gMap.currMapData.layers[1].data[1978] )


        var one_dim = tile_y_num*gMap.currMapData.width + tile_x_num;
        if(gMap.currMapData.layers[1].data[one_dim] > 0) { 
            console.log("COLLIDED!");
            return true; 
        }//collides with CollisionLayer
        else {return false;}
    }

});

var gMap = new TILEDMapClass();
