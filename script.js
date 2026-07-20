alert("JS chargé");
const track = document.getElementById("track");
const thumb = document.getElementById("thumb");
const fill = document.getElementById("fill");


// Cible

let target = Math.floor(Math.random() * 81) + 10;

document.getElementById("target").textContent = target;



let value = 0;
let dragging = false;
let finished = false;





function update(clientX){

    let rect = track.getBoundingClientRect();

    let x = clientX - rect.left;

    x = Math.max(
        0,
        Math.min(
            rect.width,
            x
        )
    );

    value = x / rect.width * 100;


    thumb.style.left = x + "px";

    fill.style.width = x + "px";

}





function start(e){

    e.preventDefault();

    if(finished)
        return;


    dragging = true;


    if(e.touches){

        update(
            e.touches[0].clientX
        );

    }

    else{

        update(
            e.clientX
        );

    }

}





function move(e){

    e.preventDefault();

    if(!dragging || finished)
        return;


    if(e.touches){

        update(
            e.touches[0].clientX
        );

    }

    else{

        update(
            e.clientX
        );

    }

}





function end(){

    if(!dragging || finished)
        return;


    dragging = false;

    finished = true;


    revealScore();

}





track.addEventListener(
    "mousedown",
    start
);

window.addEventListener(
    "mousemove",
    move
);

window.addEventListener(
    "mouseup",
    end
);



track.addEventListener(
    "touchstart",
    start,
    {passive:false}
);

window.addEventListener(
    "touchmove",
    move,
    {passive:false}
);

window.addEventListener(
    "touchend",
    end
);






function revealScore(){

    let error = Math.abs(
        value - target
    );


    let score = Math.max(
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

            Tu visais
            <span class="small-highlight">${target}%</span>.

            <br>

            Tu as glissé jusqu'à
            <span class="small-highlight">${value.toFixed(1)}%</span>.

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
