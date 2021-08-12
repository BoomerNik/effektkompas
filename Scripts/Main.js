let segments = [];

function setup(){
	setupGUI();
	
	loadCookie();
	updateViewBox();
	updateSVG();
	//drawAndFade();
}

function createSVG(){
	let s = "\n<style>text {font-family: Gotham; font-weight: 325}</style>\n";
	
	let rotationOffset = +rotationSlider.value * TWO_PI;
	let radius = +radiusSlider.value;
	s += drawModel(radius, rotationOffset, segments);
	
	let ikon = document.querySelector("input[name=icon]:checked").value;
	s += ikoner[ikon];
	

	s += createWatermark();
	
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
	
	//Læs linjer
	for(let l of lines){
		//Hvis styling
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
		else{
			let tabs = countTabs(l);
			
			//Nyt segment
			if(tabs == 0){
				segments.push(new Segment(l));
				segments.last().addLayer();
			}
			//Fortsæt segment
			else{
				let seg = segments.last();
				
				//Hvis der ikke der nok lag
				for(let i = seg.layers.length; i <= tabs; i++){
					seg.addLayer();
				}
				
				l = l.trim();
				l = l.split("¤");
				let t = l[0];
				let s = l.length == 2 ? eval2(l[1]) : 1;
				seg.layers[tabs].addItem(t, s);
			}
		}
	}
}

function countTabs(s){
	let c = 0;
	for(let i = 0; i < s.length; i++){
		if(s[i] == "\t")
			c++;
		else
			break;
	}
	
	return c;
}

Array.prototype.last = function(item=null){
	if(item)
		this[this.length-1] = item;
	else 
		return this[this.length-1];
}