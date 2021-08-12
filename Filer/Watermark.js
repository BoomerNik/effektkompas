function createWatermark(){
    let t = totalRadius;
    let f = 50;
    let s = t/f;

    let x = t;
    let y = t - 1*s;
    
    
    return `
    <text x="${x}" y="${y}" transform="scale(${s})" transform-origin="${x} ${y}" text-anchor="end" letter-spacing="0.1" fill="#1e1e1c" font-size="3" font-family="Gohtam-Medium, Gotham" font-weight="500">
        Effektkompas™
    </text>
    `
}

//<text>${t}</text>
//<rect x="${-t}" y="${-t}" width="${t*2}" height="${t*2}" stroke="black" fill="none" stroke-width="0.05"/>