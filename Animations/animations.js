function drawAndFade(){

	let paths = document.querySelectorAll("Path");
	let record = 0;
	for(let p of paths){
		record = Math.max(record, p.getTotalLength());
	}
	console.log(record);
	
	let svg = document.querySelector("svg");
	svg.style.strokeDasharray = record+1;
	svg.style.strokeDashoffset = record+1;
	svg.style.animation = "drawAndFade 2s linear forwards";
}