let offset = 0.2;

let strokeColor = 'black';
let fillColor = 'None';

let textSize = 2;
let textColor = 'red';
let verticalText = false;

//Counters for ids
const count = {
	defPath: 0,
	textPath: 0,
	path: 0,
	text: 0
}

function createArcSegment(r1, r2, a1, a2){		
	r1 += offset
	r2 -= offset
	
	let v1 = Vector.fromAngle(a1, r1);
	let v2 = Vector.fromAngle(a1, r2);
	let v3 = Vector.fromAngle(a2, r1);
	let v4 = Vector.fromAngle(a2, r2);
	
	if(offset != 0){
		let v12 = Vector.sub(v2, v1);
		v12 = Vector.rot90CC(v12);
		v12 = Vector.setMag(v12, offset);
		
		let v34 = Vector.sub(v4, v3);
		v34 = Vector.rot90C(v34);
		v34 = Vector.setMag(v34, offset);
		
		v1 = Vector.add(v1, v12);
		v2 = Vector.add(v2, v12);
		
		v3 = Vector.add(v3, v34);
		v4 = Vector.add(v4, v34);
	}
	
	let id = "path"+count.path++;
	
	let large = (a2-a1 < PI) ? "0" : "1";

	let s = 
	`<path id="${id}" stroke="${strokeColor}" fill="${fillColor}"
		d="
		M ${v1.x} ${v1.y} 
		A ${r1} ${r1}, 0 ${large} 1, ${v3.x} ${v3.y}
		L ${v4.x} ${v4.y}
		A ${r2} ${r2}, 0 ${large} 0, ${v2.x} ${v2.y}
		z"/>\n`
	
	return s;
}


function drawTextInArcSegment(t, r1, r2, a1, a2){
	t = t.split(String.raw`\\`);
	
	let pathids = [];
	
	let s = "<defs>\n";
	
	if(verticalText){
		let am = (a2+a1) / 2;
		let ai = textSize / r1;
		let n = t.length;

		if(PI/2 < am && am < PI*3/2)
			ai *= -1;

		for(let i = 0; i < n; i++){
			let a = am - (n-1)/2 * ai + ai*i;
			
			let v1 = Vector.fromAngle(a, r1);
			let v2 = Vector.fromAngle(a, r2);
			
			let id = "defpath"+(count.defPath++);
			pathids.push(id);
			
			if(ai < 0)
				[v1,v2] = [v2,v1];
			
			s += `<path id="${id}" d="M ${v1.x} ${v1.y} L ${v2.x} ${v2.y}" />\n`;
		}
	}
	else{
		let ri = textSize;
		let n = t.length;
		let rm = (r1+r2)/2;
		
		for(let i = 0; i < n; i++){
			let v1 = Vector.fromAngle(a1);
			let v2 = Vector.fromAngle(a2);
			
			let r;
			if(v1.x < v2.x)
				r = rm + (n-1)/2 * ri - ri*i;
			else
				r = rm - (n-1)/2 * ri + ri*i;

			v1 = Vector.scale(v1, r);
			v2 = Vector.scale(v2, r);
		
			let id = "defpath"+(count.defPath++);
			pathids.push(id);
			
			if(Math.abs(v1.x-v2.x) < 0.01 && Math.abs(v1.y-v2.y) < 0.01){
				let vm = Vector.rot90CC(v1);
				vm = Vector.setMag(vm, offset);
				v1 = Vector.add(v1, vm);
				v2 = Vector.sub(v2, vm);
			}
			
			let large = (a2-a1 < PI) ? "0" : "1";
			let sweep = (v1.x > v2.x) ? "0" : "1"
			
			if(v1.x > v2.x)
				[v1,v2] = [v2,v1];
			
			s += `<path id="${id}" d="M ${v1.x} ${v1.y} A ${r} ${r} 0 ${large} ${sweep}, ${v2.x} ${v2.y}" />\n`;
		}
	}
	
	s += "</defs>\n<text>\n"
	
	for(let i = 0; i < t.length; i++){
		let id = "textPath"+(count.textPath++);
		s += `<textPath id="${id}" xlink:href="#${pathids[i]}" font-size="${textSize}" fill="${textColor}" text-anchor="middle" startOffset="50%" alignment-baseline="middle">${t[i]}</textPath>\n`;
	}
	
	s += "</text>\n"
	
	return s;
}

function drawTextInArcSegmentPoint(t, r1, r2, a1, a2){	
	let r = (r2+r1)/2;
	let a = (a1+a2)/2;
	
	let c = Vector.fromAngle(a, r);
	
	a = (degrees(a)+90) % 360;
	
	if(90 < a && a < 270)
		a += 180;
	
	return createText(t, c.x, c.y, a.toFixed(2));
}

function createTextBubble(x, y, r, t){
	let s = "";
	s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${fillColor}" />\n`;
	s += `<circle cx="${x}" cy="${y}" r="${r+1}" fill="none" stroke="black" stroke-width="0.2" stroke-dasharray="1 1"/>\n`

	lines = t.split("\\\\");
	for (let i = 0; i < lines.length; i++) {
		const l = lines[i];

		let ty = y - (lines.length-1)/2 * textSize + textSize * i;

		s += createText(l, x, ty);
	}
		


	return s;
}

function createCircle(x, y, r){
	return `<circle cx="${x}" cy="${y}" r="${r}" fill="red" />\n`
}

function createText(t, x, y, rotation = 0, alignment="middle"){
	let id = "text"+count.text++;
	return `<text id="${id}" transform="translate(${x} ${y}) rotate(${rotation})" text-anchor="${alignment}" alignment-baseline="middle" font-size="${textSize}" fill="${textColor}">${t}</text>\n`
}