let offset = 0.5;

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
		
		for(let i = 0; i < n; i++){
			let a = am - (n-1)/2 * ai + ai*i;
			
			let v1 = Vector.fromAngle(a, r1);
			let v2 = Vector.fromAngle(a, r2);
			
			let id = "defpath"+(count.defPath++);
			pathids.push(id);
			
			if(v1.x > v2.x)
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

function createCircle(x, y, r){
	return `<circle cx="${x}" cy="${y}" r="${r}" fill="red" />\n`
}

function createText(t, x, y, rotation = 0, alignment="middle"){
	let id = "text"+count.text++;
	return `<text id="${id}" transform="translate(${x} ${y}) rotate(${rotation})" text-anchor="${alignment}" alignment-baseline="middle" font-size="${textSize}" fill="${textColor}">${t}</text>\n`
}

function createWatermark(x, y, w){
	return `<image x="${x}" y="${y}" width="${w}" xlink:href="data:image/png;base64,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"></image>`;
}