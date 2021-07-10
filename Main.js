let segments = [];

function setup(){
	setupGUI();
	
	loadCookie();
	updateViewBox();
	updateSVG();
}

function createSVG(){
	let s = "<style>text {font-family: Gotham; font-weight: 325}</style>";
	
	let rotationOffset = +rotationSlider.value * TWO_PI;
	let radius = +radiusSlider.value;
	s += drawModel(radius, rotationOffset, segments);
	
	let ikon = document.querySelector("input[name=icon]:checked").value;
	s += ikoner[ikon];
	
	s += createWatermark(43,55,15);
	
	let title = titleInput.value;
	let titleSize = titleTextSizeSlider.value;
	textColor = "black";
	textSize = titleSize;
	let titleY = ikon == "Intet" ? 0:5;
	if(title.length > 0)
		s += createText(title, 0, titleY);
	
	return s;
}

function updateSVG(){
	readTextToSVG();
	
	svg.innerHTML = createSVG();
	saveCookie();
}

function readTextToSVG(){
	segments = [];
	styling = {default: {...defaultStyling}};
	
	//Del linjer og fjern blanke
	let lines = textArea.value
		.split("\n")
		.filter(l => l.trim() != "");
	
	for(let l of lines){
		if(l.startsWith("¤")){
			l = l.replace("¤", "").split(" ");
			
			styling[l[0]] = {...styling.default};
			
			for(let i = 1; i < l.length; i++){
				let s1 = l[i].substring(0,1);
				let s2 = l[i].substring(1);
				
				if(s1 == "v")
					styling[l[0]].v = true;
				else
					styling[l[0]][s1] = eval2(s2);
			}
		}
		else if(!l.startsWith("\t")){
			segments.push(new Segment(l));
			segments.last().addLayer();
		}
		else{		
			let seg = segments[segments.length-1];
			
			l = l.trim()
			
			if(l == "-"){
				seg.layers.push(new Layer());
			}
			else{
				let s = l.split("¤");
				let t = s[0];
				let size = s.length > 1 ? eval2(s[1]) : 1;
				
				seg.layers[seg.layers.length-1].addItem(t, size);
			}
		}
	}
}

Array.prototype.last = function(item=null){
	if(item)
		this[this.length-1] = item;
	else 
		return this[this.length-1];
}