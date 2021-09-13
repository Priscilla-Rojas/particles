'use strict'

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.heigth = window.innerHeight;

let particleArray;

// obtener posicion del Mouse

let mouse = {
    x: null,
    y: null,
    radius: (canvas.heigth/80) * (canvas.width/80)
};

window.addEventListener('mousemove', (event)=>{
    mouse.x = event.x;
    mouse.y = event.y;
});

// crear particulas

class Particle{
    constructor(x, y, directionX, directionY, size, color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // metodo para dibujar cada particula
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
    // metodo para verificar: posicion de la particula, del mouse, movimiento de la particula, dibujar la particula

    update(){
        // verificar si la particula esta dentro del canvas
        if(this.x > canvas.width || this.x < 0){
            this.directionX = -this.directionX;
        }
        
        if(this.y > canvas.width || this.y < 0){
            this.directionY = -this.directionY;
        }
        
        // verificar si se chocan con la posicion del mouse y la posicion de las particulas
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);

        if(distance < mouse.radius + this.size){
            if(mouse.x < this.x && this.x < canvas.width - this.size * 10){
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size *10){
                this.x -= 10;
            }
            if(mouse.y < this.y && this.y < canvas.heigth - this.size * 10){
                this.y += 10; 
            }
            if (mouse.y > this.y && this.y > this.size *10){
                this.y -= 10;
            }
        }
        // mover particulas
        this.x += this.directionX;
        this.y += this.directionY;
        // dibujar particulas
        this.draw();
    }
}

// crear array de partciulas
function init(){
    particleArray = [];
    let numberOfParticles = (canvas.heigth * canvas.width) / 9000;

    for(let i = 0; i < numberOfParticles * 2; i++){
        let size = (Math.random()*5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#8C5523';

        particleArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect(){
    let opacityValue = 1;

    for(let a = 0; a < particleArray.length; a++){
        for(let b = a; b < particleArray.length; b++){
            let distance = ((particleArray[a].x - particleArray[b].x) * (particleArray[a].x - particleArray[b].x)) + ((particleArray[a].y - particleArray[b].y) * (particleArray[a].y - particleArray[b].y));
            if(distance < (canvas.width/7) * (canvas.heigth/7)){
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle='rgba(140,85,31,' +  opacityValue + ')';
                ctx.linewidth = 1;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// animacion infinita
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth,innerHeight);

    for(let i = 0; i < particleArray.length; i++){
        particleArray[i].update();
    }
    connect();
}

window.addEventListener('resize', ()=>{
    canvas.width = innerWidth;
    canvas.heigth = innerHeight;
    mouse.radius = ((canvas.heigth/80) * (canvas.heigth/80));
    init();
});
window.addEventListener('mouseout', ()=>{
    mouse.x = undefined;
    mouse.y = undefined;
})


init();
animate();