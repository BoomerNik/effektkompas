class Vector{
	static fromAngle(a, m=1){
		return {x: Math.cos(a)*m, y: Math.sin(a)*m};
	}

	static scale(v, f){
		return {x: v.x*f, y: v.y*f};
	}

	static sub(v1, v2){
		return {x: v1.x-v2.x, y: v1.y-v2.y}
	}
	
	static add(v1, v2){
		return {x: v1.x+v2.x, y: v1.y+v2.y}
	}
	
	static rot90C(v){
		return {x: v.y, y: -v.x};
	}
	
	static rot90CC(v){
		return {x: -v.y, y: v.x};
	}
	
	static setMag(v, m){
		let l = Math.sqrt(v.x*v.x+v.y*v.y);
		return {x: v.x/l*m, y: v.y/l*m};
	}
}