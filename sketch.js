let segments = [];


function setup() {
	checkVersion();
	
	noCanvas();
	
	setupLayout();
	
	windowResized();
	
	updateButtonPressed();
}


function draw() {
	clear();
}

function mouseWheel(e){
	if(mouseX < width && mouseY < height){
		zoom += event.delta/10;
		zoom = constrain(zoom, 10, 1000);
		
		zoomSlider.value(zoom);
		
		updateSVG();
		return false;
	}
	return true;
}

function createSVG(){
	const ikon = ikoner[iconRadio.value()];
	
	return createSVGHeader() + drawModel(15, segments) + ikon + "</svg>";
}

function updateSVG(){
	switch(modeRadio.value()){
		case '0': readTextToSVGFastMode(); break;
		case '1': readTextToSVGDesignMode(); break;
	}
	
	svg.html(createSVG());
}

function readTextToSVGDesignMode(){
	segments = [];
	styling = {default: styling.default};
	
	//Del linier og fjern blanke
	let lines = textArea.value()
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
	
	saveCookie();
}

function readTextToSVGFastMode(){
	styling = {default: styling.default};
	
	//Del linier og fjern blanke
	let lines = textArea.value()
		.split("\n")
		.filter(l => l.trim()!="");
	
	//Prepocess
	let record = 0;
	let count = 0;
	for(const l of lines){
		if(!l.startsWith("\t") || l.trim() == "-"){
			record = max(record, count);
			count = 0;
		}
		else
			count++;
	}
	record = max(record, count);
	
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
	
	saveCookie();
}

function saveCookie(){
	localStorage.setItem("EffektkompasTekst", encodeURIComponent(textArea.value()));
}

function loadCookie(){
	let c = localStorage.getItem("EffektkompasTekst");
	if(c)	
		return decodeURIComponent(c);
	
	return "";
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