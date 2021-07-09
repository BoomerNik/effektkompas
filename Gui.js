function showTab(event, tabName){
	let tabs = document.getElementsByClassName("tab");
	for(let tab of tabs){
		if(tab.id == tabName)
			tab.style.display = "block";
		else
			tab.style.display = "none";
	}
	
	let buttons = document.getElementsByClassName("menu-button");
	for(let b of buttons){
		b.classList.remove("active");
	}
	
	event.currentTarget.classList.add("active");
}

function reloadGuide(){
	let f = document.getElementById("guideFrame");
	f.src = f.src;
}

function svgContainerMouseDown(){
	this.mouseDown = true;
}

function svgContainerMouseUp(){
	this.mouseDown = false;
}

function svgContainerMouseMove(event){
	if(this.mouseDown){
		view.x -= event.movementX / this.offsetWidth * 100;
		view.y -= event.movementY / this.offsetHeight * 100;

		updateViewBox();
	}
}

function svgContainerWheel(event){
	let dy = event.deltaY;
	
	if(event.shiftKey){
		let d;
		if(dy > 0)
			d = -0.01;
		else
			d = 0.01;
		
		let r = +rotationSlider.value + d;
		
		rotationSlider.value = r - Math.floor(r); //Wrap to 0-1  {a - floor(a/max) * max}
		
		updateSVG();
	}
	else{
		let d = 1;
		
		if(dy > 0)
			d = 0.9;
		else
			d = 10/9;
		
		zoomSlider.value *= d;
		updateViewBox();
	}
	
	event.preventDefault();
}

function updateViewBox(){	
	let zoom = +zoomSlider.value;
	let x = view.x / zoom;
	let y = view.y / zoom;
	let wh = 1 / zoom * 100;
	
	let viewbox = `${x} ${y} ${wh} ${wh}`;
		
	svg.setAttribute("viewBox", viewbox);
}

function resetButtonClicked(){
	view = {...defaultView};
	updateViewBox();
}

function textAreaKeyDown(e){
	if (e.key == 'Tab'){	
		let sS = textArea.selectionStart;	
		let sE = textArea.selectionEnd;
		let t = textArea.value;
		textArea.value = t.substring(0, sS) + "\t" + t.substr(sE);
		textArea.setSelectionRange(sS + 1, sS + 1);

		e.preventDefault();
		
		return false;
	}
	else if(e.ctrlKey && e.key == 'Enter' && textArea.selectionStart == textArea.selectionEnd){
		let pos = textArea.selectionStart;
		
		let t = textArea.value;

		textArea.value = t.substring(0, pos) + "\\\\" + t.substring(pos);
		textArea.selectionStart = textArea.selectionEnd = pos + 2
		
		e.preventDefault();

		return false;
	}
	
	return true;
}

function modeChanged(){
	let mode = document.querySelector("input[name=mode]:checked").value;
	
	switch(mode){
		case 'fast_mode': 
			majTextSizeSlider.disabled = false;
			minTextSizeSlider.disabled = false;
			break;
			
		case 'design_mode': 
			majTextSizeSlider.disabled = true;
			minTextSizeSlider.disabled = true; 
			break;
	}
}


/****************
******SETUP******
****************/
let svgContainer;
let svg;

let textArea;
let titleInput;

let zoomSlider;
let rotationSlider;
let radiusSlider;
let offsetSlider;
let titleTextSizeSlider;
let majTextSizeSlider;
let minTextSizeSlider;

let defaultView = {x: -50, y: -50};
let view = {...defaultView};

function setupGUI(){
	//Svg container
	svgContainer = document.getElementById("svg-container")
	svgContainer.addEventListener("mousedown", svgContainerMouseDown);
	svgContainer.addEventListener("mouseup", svgContainerMouseUp);
	svgContainer.addEventListener("mouseleave", svgContainerMouseUp);
	svgContainer.addEventListener("mousemove", svgContainerMouseMove);
	svgContainer.addEventListener("wheel", svgContainerWheel);

	svg = document.getElementById("drawing");

	//Start tab
	document.getElementById("mode_radio").addEventListener("click", modeChanged);
	titleInput = document.getElementById("titleInput");
	titleInput.addEventListener("input", updateSVG);
	
	for(let radio of document.getElementsByClassName("radio_container"))
		radio.addEventListener("click", updateSVG);

	//Kode tab
	textArea = document.getElementById("kode-textarea");
	textArea.addEventListener("keydown", textAreaKeyDown);
	textArea.addEventListener("keyup", updateSVG);

	//Udseende tab
	zoomSlider = document.getElementById("zoomSlider");
	zoomSlider.addEventListener("input", updateViewBox);
	
	rotationSlider = document.getElementById("rotationSlider");
	rotationSlider.addEventListener("input", updateSVG);
	
	radiusSlider = document.getElementById("radiusSlider");
	radiusSlider.addEventListener("input", updateSVG);
	
	titleTextSizeSlider = document.getElementById("titleTextSizeSlider");
	titleTextSizeSlider.addEventListener("input", updateSVG);
	
	majTextSizeSlider = document.getElementById("majTextSizeSlider");
	majTextSizeSlider.addEventListener("input", updateSVG);
	
	minTextSizeSlider = document.getElementById("minTextSizeSlider");
	minTextSizeSlider.addEventListener("input", updateSVG);
	
	
	//Eksport tab
	document.getElementById("savePNGButton").addEventListener("click", savePNG);
	document.getElementById("saveSVGButton").addEventListener("click", saveSVG);
	document.getElementById("saveJSONButton").addEventListener("click", saveJSON);
	document.getElementById("loadJSONButton").addEventListener("click", loadJSON);
	
	//Guide tab
	document.getElementById("guideButton").addEventListener("click", reloadGuide);
}