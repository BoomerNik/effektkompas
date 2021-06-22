const colors = {
	'b': ['rgb(112,161,179)', 'rgb(161,193,205)', 'rgb(209,227,236)'],
	'g': ['rgb(106,150,148)', 'rgb(156,184,182)', 'rgb(206,222,220)'],
	'r': ['rgb(182,129,134)', 'rgb(204,168,175)', 'rgb(232,214,216)'],
	'default': ['rgb(100,100,100)', 'rgb(150,150,150)', 'rgb(200,200,200)']
};

let styling = {default: {r: 10, v: false, t: 2}};

class Segment{
	constructor(t){
		t = t.split("#");
		
		if(t.length == 2 && t[1].toLowerCase().charAt(0) in colors)
			this.colors = colors[t[1].toLowerCase().charAt(0)];
		else
			this.colors = colors['default'];
		
		this.layers = [new Layer()];
		this.layers[0].addItem(t[0], 1);
	}
	
	addLayer(layer = null){
		if(layer)
			this.layers.push(layer);
		else
			this.layers.push(new Layer());
	}
	
	draw(r, a1, a2){
		let s = "";
		
		let r1 = r;
		
		for(let i = 0; i < this.layers.length; i++){
			strokeColor = 'None';
			let colorNum = constrain(i, 0, this.colors.length-1);
			fillColor = this.colors[colorNum];
			
			let style;
			
			//Apply styling
			if('L'+i in styling)
				style = styling['L'+i];
			else
				style = styling.default;
			
			textSize = style.t;
			
			let r2 = r1 + style.r;
			
			s += this.layers[i].draw(r1, r2, a1, a2);
			
			r1 = r2;
		}
		
		return s;
	}
}

class Layer{
	constructor(){
		this.items = [];
	}
	
	addItem(t, size=1){
		this.items.push({text: t, size: size});
	}
	
	totalSize(){
		let sum = 0;
		for(const i of this.items){
			sum += i.size;
		}
		return sum;
	}
	
	draw(r1, r2, a1, a2){
		if(this.items.length == 0)
			return;
		
		let s = "";
		
		let ai = (a2-a1) / this.totalSize();
		let at = a1;
		
		for(let i = 0; i < this.items.length; i++){
			let size = this.items[i].size;
			let t = this.items[i].text;
			
			let aa = at;
			let ab = at+ai*size;
			
			s += createArcSegment(r1, r2, aa, ab);
			s += drawTextInArcSegment(t, r1, r2, aa, ab);
			
			at += ai*size;
		}
		
		return s;
	}
}

function drawModel(R, segments){
	let s = "";
	
	let ai = TWO_PI / segments.length;
	
	for(let i = 0; i < segments.length; i++){
		a1 = ai*i;
		a2 = a1+ai;
		
		s += segments[i].draw(R, a1, a2, colors[i]);
	}
	
	return s;
}

function sum(a){
	return a.reduce((a, b) => {return a+b});
}