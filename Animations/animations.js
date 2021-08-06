function drawAndFade() {

	let paths = document.querySelectorAll("path");
	let record = 0;
	for (let p of paths) {
		record = Math.max(record, p.getTotalLength());
	}
	console.log(record);

	/* for (let p of paths) {
		p.style.strokeDasharray = record + 1;
		p.style.strokeDashoffset = record + 1;
		p.style.animation = "drawAndFade 2s linear forwards";
	} */

	let icon = document.getElementsByClassName("icon")[0];
	icon.style.opacity = 0;

	let svg = document.querySelector("svg");

	svg.style.strokeDasharray = record + 1;
	svg.style.strokeDashoffset = record + 1;
	svg.style.animation = "drawAndFade 2s linear forwards";

	svg.onanimationend = svgAnimationEnd;
}

function svgAnimationEnd() {
	let svg = document.querySelector("svg");
	svg.style = "";

	document.querySelector('link[href="Animations/animations.css"]').remove();

	let icon = document.getElementsByClassName("icon")[0];
	icon.style.transition = "opacity .5s";
	icon.style.opacity = 1;
	icon.ontransitionend = iconAnimationEnd;
	
}

function iconAnimationEnd() {
	let icon = document.getElementsByClassName("icon")[0];
	icon.style = "";
}