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
	
	
	
	let title = titleInput.value;
	let titleSize = titleTextSizeSlider.value;
	textColor = "black";
	textSize = titleSize;
	if(title.length > 0)
		s += createText(title, 0, 5);
	
	return s;
}

function updateSVG(){
	let mode = document.querySelector("input[name=mode]:checked").value;
	switch(mode){
		case 'fast_mode': readTextToSVGFastMode(); break;
		case 'design_mode': readTextToSVGDesignMode(); break;
	}
	
	svg.innerHTML = createSVG();
	saveCookie();
}

function readTextToSVGDesignMode(){
	segments = [];
	styling = {default: {...defaultStyling}};
	
	//Del linier og fjern blanke
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

function readTextToSVGFastMode(){
	styling = {default: {...defaultStyling}, L0: {...defaultStyling}, L1: {...defaultStyling}};
	
	let majT = +majTextSizeSlider.value;
	let minT = +minTextSizeSlider.value;
	styling.default.t = minT;
	styling.L0.t = majT;
	styling.L1 = {r: 20, v: true, t: minT};
	
	
	//Del linier og fjern blanke
	let lines = textArea.value
		.split("\n")
		.filter(l => l.trim()!="");
	
	//Prepocess
	let record = 0;
	let count = 0;
	for(const l of lines){
		if(!l.startsWith("\t") || l.trim() == "-"){
			record = Math.max(record, count);
			count = 0;
		}
		else
			count++;
	}
	record = Math.max(record, count);
	
	let repeat = true;
	while(repeat){
		repeat = false;
		count = 0;
		
		for(let i = 1; i < lines.length; i++){
			let l = lines[i];
			
			if(!l.startsWith("\t") || l.trim() == "-"){
				if(count < record){
					lines.splice(i, 0, "\t.");
					
					repeat = true;
					break;
				}
				
				count = 0;
			}
			else
				count++;
			
			if(i == lines.length-1)
				if(count < record)
				{
					lines.push("\t.");
					repeat = true;
				}
		}
	}
	
	//Process
	segments = [];
	let layerNum;
	
	for(let l of lines){
		if(!l.startsWith("\t")){
			segments.push(new Segment(l));
			
			layerNum = 1;
		}
		else {		
			let seg = segments.last();
			l = l.trim();
			
			if(l == "-"){
				layerNum = 1;
			}
			else {
				if(seg.layers.length == layerNum)
					seg.addLayer();
				
				seg.layers[layerNum].addItem(l);
				layerNum++;
			}
			
		}
	}
}

function checkVersion(){
	let v = localStorage.getItem("EffektkompasVersion");
	
	if(v != version){
		localStorage.setItem("EffektkompasVersion", version);
		alert(newInVersion);
	}
}

Array.prototype.last = function(item=null){
	if(item)
		this[this.length-1] = item;
	else 
		return this[this.length-1];
}