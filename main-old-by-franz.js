import { options } from "./options";

const button = document.getElementById("button")
const winnerLabel = document.getElementById("winner")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d');
canvas.height = 500
canvas.width = 500
let myRec

const PI = Math.PI
let rotation = 0
let rotationRef = 0
let aceleration = 0.05
const lap = 2*PI
let winner = "" 

const drawPointer = () => {
    ctx.reset()
    ctx.fillStyle = "#fff"
    const pointerHeight = 40 * Math.cos(Math.PI / 6);
    ctx.beginPath()
    ctx.moveTo(230, 0);
    ctx.lineTo(270, 0);
    ctx.lineTo(250, 80 - pointerHeight);
    ctx.fill()
    ctx.closePath()
}

const drawRoulette = () => {
    ctx.fillStyle = "#7F7671";
    ctx.beginPath()
    ctx.arc(250 ,250 ,200 , PI/2, 2*PI)
    ctx.stroke();
    
    ctx.closePath()
}

const drawSections = (n=1, options) => {
    const sectionNames = Object.keys(options)
    const sectionColors = Object.values(options)
    for (let i = 0; i < n; i++){
        ctx.fillStyle = sectionColors[i]
        ctx.beginPath()
    
        const initArc = i * ((2*PI) / n)
        const endArc = (2*PI) / n + i * ((2*PI) / n)

        ctx.rect(250, 250, 0, 200)
        ctx.arc(250, 250, 200, initArc, endArc)
        ctx.fill()
        
        ctx.translate(250,250)
        ctx.rotate( i * ((2*PI) / n) )

        ctx.fillStyle="#000"
        ctx.fillText(sectionNames[i], 50, 50)

        ctx.rotate( -1*i * ((2*PI) / n) )
        ctx.translate(-250,-250)
        ctx.closePath()

    }

}

const startRotation = (n, options, finishRotation, limits) => {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0,45,canvas.width, canvas.height)
    
        ctx.translate(250,250)
        ctx.rotate(rotation)
        ctx.translate(-250,-250)
        
        drawRoulette()
        drawSections(n, options)

        rotation = rotation + aceleration
        rotationRef = rotationRef + aceleration
        
        if (Math.round(rotationRef*10) === Math.round(lap*10)){
            rotationRef = 0
        
        }
        myRec = requestAnimationFrame(()=> {
            startRotation(n,options, finishRotation, limits)
        })
        
        if(Math.round(rotation*10) === Math.round(finishRotation*10)){
            cancelAnimationFrame(myRec)
            if(rotationRef < (3*PI)/2){
                rotationRef = (3*PI) / 2 - rotationRef
            }
            else{
                rotationRef = 2*PI - (rotationRef - 3*PI / 2)
            }
            winner = limits.find((e)=>(
                rotationRef > e.inicio && rotationRef < e.fin
            ))
            winnerLabel.textContent = winner.color
        }      
}

const generateLimitSections = (options) => {
    const n = Object.keys(options).length
    const limits = Object.keys(options).map((color, i)=>{
        return{
            inicio: (i+1)* ((2*PI) / n) - (2*PI)/n,
            fin:  (i+1)* ((2*PI) / n),
            color
        }
    })
    return limits
} 

const draw = (options) => {
    if(myRec){
        cancelAnimationFrame(myRec)
    }
    ctx.clearRect(0,0,canvas.width, canvas.height)
    rotation = 0
    rotationRef = 0
    aceleration = 0.05
    const rouleteSections = Object.values(options)
    const finishRotation = Math.random() * (3*lap - lap) + lap
    const limits = generateLimitSections(options)
    drawPointer()
    startRotation(rouleteSections.length, options, Number(finishRotation), limits)
}

button.addEventListener("click", ()=>(   
    draw(options)
))
