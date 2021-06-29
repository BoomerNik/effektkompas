let textSize = 2;
let zoom = 125;
let offset = 0.5;
let verticalText = false;

let strokeColor = 'black';
let fillColor = 'None';

let textColor = 'white';

function createSVGHeader(){
let s = 
`<svg width="${width}" height="${height}" viewBox="${-zoom/2} ${-zoom/2} ${zoom} ${zoom}"
     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
	 
	 <style type="text/css">
		path {stroke-width: .2;}
		text {font-family: Gotham; font-weight: 325}
	 </style>
`;  
	return s
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
	
	let s = 
	`<path stroke="${strokeColor}" fill="${fillColor}"
		d="
		M ${v1.x} ${v1.y} 
		A ${r1} ${r1}, 0 0 1, ${v3.x} ${v3.y}
		L ${v4.x} ${v4.y}
		A ${r2} ${r2}, 0 0 0, ${v2.x} ${v2.y}
		z"/>\n`
	
	return s;
}

let textPathCount = 0;
function drawTextInArcSegment(t, r1, r2, a1, a2){
	t = t.split(`\\`);
	
	let pathids = [];
	
	let s = "<defs>\n";
	
	if(verticalText){
		for(let i = 0; i < t.length; i++){
			let a = a1+(a2-a1)/(t.length+1) * (i+1);
			
			let v1 = Vector.fromAngle(a, r1);
			let v2 = Vector.fromAngle(a, r2);
			
			pathids.push("path"+(textPathCount++));
			
			if(v1.x > v2.x)
				[v1,v2] = [v2,v1];
			
			s += `<path id="${pathids[i]}" d="M ${v1.x} ${v1.y} L ${v2.x} ${v2.y}" />\n`;
		}
	}
	else{
		for(let i = 0; i < t.length; i++){
			let v1 = Vector.fromAngle(a1);
			let v2 = Vector.fromAngle(a2);
			
			let r;
			if(v1.x < v2.x)
				r = r2 - ((r2-r1)/(t.length+1)) * (i+1);
			else
				r = r1 + ((r2-r1)/(t.length+1)) * (i+1);

			v1 = Vector.scale(v1, r);
			v2 = Vector.scale(v2, r);
		
			pathids.push("path"+(textPathCount++));
			
			if(v1.x < v2.x)
				s += `<path id="${pathids[i]}" d="M ${v1.x} ${v1.y} A ${r} ${r}, 0 0 1, ${v2.x} ${v2.y}" />\n`;
			else
				s += `<path id="${pathids[i]}" d="M ${v2.x} ${v2.y} A ${r} ${r}, 0 0 0, ${v1.x} ${v1.y}" />\n`;
		}
	}
	
	s += "</defs>\n<text>\n"
	
	for(let i = 0; i < t.length; i++){
		s += `<textPath xlink:href="#${pathids[i]}" font-size="${textSize}" fill="${textColor}" text-anchor="middle" startOffset="50%" alignment-baseline="middle">${t[i]}</textPath>\n`;
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
	return `<text transform="translate(${x} ${y}) rotate(${rotation})" text-anchor="${alignment}" font-size="${textSize}" fill="${textColor}">${t}</text>\n`
}
