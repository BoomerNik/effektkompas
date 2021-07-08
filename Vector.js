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

const PI = 3.1416;
const TWO_PI = 6.283185307;

function constrain(v, min, max){
	let val = Math.min(v, max);
	val = Math.max(val, min);
	return val;
}

function eval2(S){
	try{
		return eval(S.replace(',','.'));
	}
	catch(err){
		try{
			return eval(S.replace(',','.')+'1');
		}
		catch(err2){
			let a = 'Teksten: "'+S+'" kunne ikke oversættes til et tal';
			console.error(a);
		}
	}
	
	return 1;
}