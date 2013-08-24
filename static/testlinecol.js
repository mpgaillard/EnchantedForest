var EPS = 0.0000001;

pointsToLine : function(p1, p2){
	var l = {"a" : null, "b" : 0, "c" : null};
	if(p1.x === p2.x){//Vertical
		l.a = 1.0; l.b = 0.0; l.c = -p1.x;
	}
	else{
		l.a = -(p1.y - p2.y) / (p1.x - p2.x);
		l.b = 1.0;
		l.c = -(double)(l.a * p1.x) - (l.b * p1.y);
	}
	
	return l;
};



intersect : function(line l1, line l2){
	var p = { x : null, y : null};

	p.x = (l2.b*l1.c - l1.b*l2.c)/(l2.a*l1.b - l1.a*l2.b);
	if(Math.abs(l1.b) > EPS){
		p.y = - (l1.a*p.x + l1.c)/l1.b;
	}
	else{
		p.y = - (l2.a*p.x + l2.c)/l2.b;
	}
	return p;
}

inRange : function(inters, points1, points2){

	if(inters.x < points1.start.x || inters.x > points1.end.x || inters.y < points1.start.y || inters.y > points1.end.y ){
		return false;
	}
	if(inters.x < points2.start.x || inters.x > points2.end.x || inters.y < points2.start.y || inters.y > points2.end.y ){
		return false;
	}
	return true;
}

//line_points : {start : {x : 0, y : 0} , end : {x : 3 , y : 5}}
floor_collision : function(ent, line_points){
	line = pointsToLine( {x : line_points.start.x, y : line_points.start.y}, {x : line_points.end.x, y : line_points.end.y } );
	var lower_rect_ent = pointsToLine( {x : ent.pos.x, y : ent.pos.y+ent.size.y }, {x : ent.pos.x+ent.size.x, y : ent.pos.y+ent.size.y } );
	var intersect_ground = intersect(lower_rect_ent, line);
	
	//Collision of floor with line
	if( inRange(intersect_ground, {start : {x : ent.pos.x, y : ent.pos.y+ent.size.y }, end : {x : ent.pos.x+ent.size.x, y : ent.pos.y+ent.size.y }  }, line_points ) ){
		return 'floor';
	}

	var right_rect_ent = pointsToLine ( {x : ent.pos.x+ent.size.x, y : ent.pos.y }, {x : ent.pos.x+ent.size.x, y : ent.pos.y+ent.size.y }  );
	var intersect_right = intersect( right_rect_ent, line);

	//Collision of right with line
	if( inRange(intersect_right, {start : {x : ent.pos.x+ent.size.x, y : ent.pos.y }, end : {x : ent.pos.x+ent.size.x, y : ent.pos.y+ent.size.y }  }, line_points ) ){
		return 'right';
	}	

	//Collision of top with line
	var top_rect_ent = pointsToLine ( {x : ent.pos.x, y : ent.pos.y }, {x : ent.pos.x+ent.size.x, y : ent.pos.y }  );
	var intersect_top = intersect( top_rect_ent, line);

	//Collision of right with line
	if( inRange(intersect_top, {start : {x : ent.pos.x, y : ent.pos.y }, end : {x : ent.pos.x+ent.size.x, y : ent.pos.y }  }, line_points ) ){
		return 'top';
	}	

	//Collision of bottom with line
	var bottom_rect_ent = pointsToLine ( {x : ent.pos.x, y : ent.pos.y+ent.size.y }, {x : ent.pos.x+ent.size.x, y : ent.pos.y+ent.size.y }  );
	var intersect_bottom = intersect( bottom_rect_ent, line);

	//Collision of right with line
	if( inRange(intersect_bottom, {start : {x : ent.pos.x, y : ent.pos.y+ent.size.y }, end : {x : ent.pos.x+ent.size.x, y : ent.pos.y+ent.size.y }  }, line_points ) ){
		return 'top';
	}	

	return false;

};


areParallel : function (l1, l2){
	return (Math.abs(l1.a-l2.a)<EPS) && (Math.abs(l1.b-l2.b)<EPS);
}

areSame : function ( l1, l2){
	return areParallel(l1, l2) && (Math.abs(l1.c-l2.c) < EPS);
}


