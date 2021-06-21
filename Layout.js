let svg;

let textArea;
let updateButton;
let saveSvgButton;
let saveImageButton;

let zoomSlider;
let sizeSlider;
let offsetSlider;
let modeRadio;

function setupLayout(){	
	svg = createElement("SVG", "");
	svg.attribute("id", "svg");
	
	textArea = createElement("textarea", "");
	textArea.attribute("rows", "30");
	textArea.attribute("cols", "40");
	textArea.attribute("onkeydown", "textAreaKeyDown(this,event);")
	textArea.attribute("onkeyup", "textAreaKeyUp(this,event);")
	textArea.attribute("wrap", "soft");
	textArea.value(loadCookie())
	
	updateButton = createButton("Opdater");
	updateButton.mousePressed(updateButtonPressed);
	
	saveSvgButton = createButton("Gem SVG");
	saveSvgButton.mousePressed(saveSvgButtonPressed);
	
	saveImageButton = createButton("Gem PNG");
	saveImageButton.mousePressed(saveImageButtonPressed);
	
	createElement("Label", "Zoom:");
	zoomSlider = createSlider(10,500, zoom);
	zoomSlider.size(300);
	zoomSlider.attribute("oninput", "zoomSliderMoved()")
	zoomSlider.attribute("class", "slider");
	
	createElement("br");
	
	createElement("Label","Tekst Størrelse:");
	sizeSlider = createSlider(0.1, 5, textSize, 0.05);
	sizeSlider.size(300);
	sizeSlider.attribute("oninput", "sizeSliderMoved()")
	sizeSlider.attribute("class", "slider");
	
	createElement("br");
	
	createElement("Label","Offset Størrelse:");
	offsetSlider = createSlider(0, 2, offset, 0.05);
	offsetSlider.size(300);
	offsetSlider.attribute("oninput", "offsetSliderMoved()")
	offsetSlider.attribute("class", "slider");
	
	createElement("br");
	
	modeRadio = createRadio();
	modeRadio.option(0,'Fast Mode');
	modeRadio.option(1,'Design Mode');
	modeRadio.selected('0');
	modeRadio.attribute("oninput", "updateSVG()");
}

function windowResized(){
	const sizeF = 0.8;
	
	resizeCanvas(windowHeight * sizeF, windowHeight * sizeF);
	
	svg.position(0,0);
	
	textArea.position(width+5,0);
	updateButton.position(width+5, 520);
	saveSvgButton.position(width+70, 520);
	saveImageButton.position(width+147, 520);
	
	updateSVG();
}

function updateButtonPressed(){
	updateSVG();
}

function saveSvgButtonPressed(){
	let s = createSVG();
	saveStrings([s], "Effektkompas", "svg");
}

function saveImageButtonPressed(){
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
		btoa(encodeURIComponent(svg.html())
		.replace(/%([0-9A-F]{2})/g, function(match, p1) {return String.fromCharCode('0x' + p1);}));;
}

function sizeSliderMoved(){
	textSize = sizeSlider.value();
	updateSVG();
}

function zoomSliderMoved(){
	zoom = zoomSlider.value();
	updateSVG();
}

function offsetSliderMoved(){
	offset = offsetSlider.value();
	updateSVG();
}

function textAreaKeyDown(textArea, e){
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

function textAreaKeyUp(o, e){
	updateSVG();
}