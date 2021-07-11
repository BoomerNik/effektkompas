function saveSVG(){
	let blob = new Blob([svg.outerHTML], {type: "text/plain;charset=utf-8"});
	let link = document.createElement('a');
	link.download = "Effektkompas.svg";
	link.href = URL.createObjectURL(blob);
	link.click();
}

function savePNG(){
	let img = new Image();
	img.onload = () => {
		let can = document.createElement('canvas');
		can.width = 1500;
		can.height = 1500;
		ctx = can.getContext("2d");
		ctx.drawImage(img, 0, 0, can.width, can.height);
		
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

function saveCookie(){
	localStorage.setItem("EffektkompasData", createJSON());
}

function loadCookie(){
	let c = localStorage.getItem("EffektkompasData");
	if(c){
		const json = JSON.parse(c);
		readJSON(json);
	}
	else {
		readJSON(Eksempler.Stor);
	}
}

function createJSON(){
	let json = {};
	
	//Start
	json.title = titleInput.value;
	json.icon = document.querySelector("input[name=icon]:checked").value;
	
	//Kode
	json.text = textArea.value;
	
	//Udseende
	json.rotation = rotationSlider.value
	json.centerRadius = radiusSlider.value;
	json.titleTextSize = titleTextSizeSlider.value;
	json.majTextSize = majTextSizeSlider.value;
	json.minTextSize = minTextSizeSlider.value;
	
	return JSON.stringify(json, null, "\t");
}

function readJSON(json){	
	//Start
	titleInput.value = json.title;
	document.querySelector(`input[name=icon][value=${json.icon}]`).checked = true;
	
	//Kode
	textArea.value = json.text;
	
	//Udseende
	rotationSlider.value = json.rotation;
	radiusSlider.value = json.centerRadius;
	titleTextSizeSlider.value = json.titleTextSize;
	majTextSizeSlider.value = json.majTextSize;
	minTextSizeSlider.value = json.minTextSize;
	
	updateViewBox();
	updateSVG();
}

function saveJSON(){
	let blob = new Blob([createJSON()], {type: "text/plain;charset=utf-8"});

	let link = document.createElement('a');
	link.download = "Effektkompas.json";
	link.href = URL.createObjectURL(blob);
	link.click();
}

function loadJSON(){
	let fileInput = document.createElement("input");
	fileInput.setAttribute("type", "file");
	
	fileInput.onchange = () => {		
		let reader = new FileReader();
		reader.onload = (e) => {
			const json = JSON.parse(reader.result);
			readJSON(json);
		}
		reader.readAsText(fileInput.files[0]);
	}
	
	fileInput.click();
}