const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 350;


// Angle demandé
let targetAngle = Math.floor(Math.random() * 120) + 30;

document.getElementById("target").textContent = targetAngle;



const center = {
    x: 175,
    y: 175
};


let point = null;
let drawing = false;
let finished = false;



function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ligne de référence
	ctx.strokeStyle = "#1D1D1F";
	ctx.lineWidth = 3;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";

    ctx.beginPath();

    ctx.moveTo(
        center.x,
        center.y
    );

    ctx.lineTo(
        300,
        center.y
    );

    ctx.stroke();



    // ligne du joueur
    if(point){

		ctx.strokeStyle = "#007AFF";
		ctx.lineWidth = 4;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

        ctx.beginPath();

        ctx.moveTo(
            center.x,
            center.y
        );

        ctx.lineTo(
            point.x,
            point.y
        );

        ctx.stroke();

    }



    // point central

    ctx.fillStyle="#1D1D1F";

    ctx.beginPath();

	ctx.arc(
		center.x,
		center.y,
		7,
		0,
		Math.PI*2
	);

    ctx.fill();

}




function getPosition(e){

    let rect = canvas.getBoundingClientRect();

    let x;
    let y;


    if(e.touches){

        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;

    } 
    
    else {

        x = e.clientX - rect.left;
        y = e.clientY - rect.top;

    }


    return {
        x,
        y
    };

}




// Début du geste

function start(e){

    e.preventDefault();

    if(finished) return;


    drawing = true;

    point = getPosition(e);

    draw();

}




// Mouvement

function move(e){

    e.preventDefault();

    if(!drawing || finished)
        return;


    point = getPosition(e);

    draw();

}




// Relâchement

function end(){

    if(!drawing || finished)
        return;


    drawing = false;
    finished = true;


    revealScore();

}





canvas.addEventListener(
"mousedown",
start
);


canvas.addEventListener(
"mousemove",
move
);


canvas.addEventListener(
"mouseup",
end
);




canvas.addEventListener(
"touchstart",
start,
{passive:false}
);


canvas.addEventListener(
"touchmove",
move,
{passive:false}
);


canvas.addEventListener(
"touchend",
end
);





function calculateAngle(){


    let dx = point.x - center.x;

    let dy = center.y - point.y;


    let angle =
        Math.atan2(dy, dx)
        *
        180
        /
        Math.PI;


    if(angle < 0)
        angle += 360;


    return angle;

}





function revealScore(){


    let angle = calculateAngle();


    let error =
        Math.abs(angle - targetAngle);



    let score =
        Math.max(
            0,
            100 - error * 2
        );



    document.getElementById("result").innerHTML =

    `
    <div>

        <div class="score">
            ${score.toFixed(1)}%
        </div>


        <p>

            Tu visais <span class="small-highlight">${targetAngle}°</span>.<br>

            Tu as fait <span class="small-highlight">${angle.toFixed(1)}°</span>.

            <br><br>

            ${message(score)}

        </p>

    </div>
    `;


}




function message(score){


    if(score >= 99)
        return "Ok... c'est presque louche.";

    if(score >= 95)
        return "Propre. Très propre.";

    if(score >= 85)
        return "Pas loin. Mais pas assez.";

    return "On va faire comme si c'était voulu.";

}




draw();