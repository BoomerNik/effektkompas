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
	let d = 1;
	
	if(dy > 0)
		d = 0.9;
	else
		d = 10/9;
	
	view.zoom *= d;
	view.zoom = constrain(view.zoom, 0.1, 3);
	zoomSlider.value = view.zoom;
	updateViewBox();
	event.preventDefault();
}

function updateViewBox(){	
	let x = view.x / view.zoom;
	let y = view.y / view.zoom;
	let wh = 1 / view.zoom * 100;
	
	let viewbox = `${x} ${y} ${wh} ${wh}`;
		
	svg.setAttribute("viewBox", viewbox);
}

function resetButtonClicked(){
	view = {...defaultView};
	zoomSlider.value = view.zoom;
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
	else if(e.key == 'Enter' && textArea.selectionStart == textArea.selectionEnd){
		let pos = textArea.selectionStart;
		
		let t = textArea.value;
		
		if(e.ctrlKey){
			textArea.value = t.substring(0, pos) + "\\\\" + t.substring(pos);
		}
		else {
			textArea.value = t.substring(0, pos) + "\n\t" + t.substring(pos);
		}
		
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

function zoomSliderMoved(){
	view.zoom = parseFloat(zoomSlider.value);
	updateViewBox();
}

function offsetSliderMoved(){
	offset = parseFloat(offsetSlider.value);
	updateSVG();
}

function savePNGButtonPressed(){
	let img = new Image();
	img.onload = () => {
		let can = document.createElement('canvas');
		can.width = 1500;
		can.height = 1500;
		ctx = can.getContext("2d");
		ctx.drawImage(img,0,0, can.width, can.height);
		
		let link = document.createElement('a');
		link.download = "Effektkompas.png";
		link.href = can.toDataURL("image/png;base64");
		link.click();
	}
	img.onerror = () => {
		alert("Fejl: Kunne ikke lave billede");
	}
	
	img.src = "data:image/svg+xml;base64,"+
		btoa(encodeURIComponent(svg.outerHTML)
		.replace(/%([0-9A-F]{2})/g, function(match, p1) {return String.fromCharCode('0x' + p1);}));;
}

function saveSVGButtonPressed(){
	let blob = new Blob([svg.outerHTML], {type: "text/plain;charset=utf-8"});
	let link = document.createElement('a');
	link.download = "Effektkompas.svg";
	link.href = URL.createObjectURL(blob);
	link.click();
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

let defaultView = {x: -50, y: -50, zoom: 0.75};
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
	updateViewBox();

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
	zoomSlider.addEventListener("input", zoomSliderMoved);
	zoomSlider.value = defaultView.zoom;
	
	rotationSlider = document.getElementById("rotationSlider");
	rotationSlider.addEventListener("input", updateSVG);
	
	radiusSlider = document.getElementById("radiusSlider");
	radiusSlider.addEventListener("input", updateSVG);
	
	offsetSlider = document.getElementById("offsetSlider");
	offsetSlider.addEventListener("input", offsetSliderMoved);
	offsetSlider.value = offset;
	
	titleTextSizeSlider = document.getElementById("titleTextSizeSlider");
	titleTextSizeSlider.addEventListener("input", updateSVG);
	
	majTextSizeSlider = document.getElementById("majTextSizeSlider");
	majTextSizeSlider.addEventListener("input", updateSVG);
	
	minTextSizeSlider = document.getElementById("minTextSizeSlider");
	minTextSizeSlider.addEventListener("input", updateSVG);
	
	
	//Eksport tab
	document.getElementById("savePNGButton").addEventListener("click", savePNGButtonPressed);
	document.getElementById("saveSVGButton").addEventListener("click", saveSVGButtonPressed);
	
	//Guide tab
	document.getElementById("guideButton").addEventListener("click", reloadGuide);
}