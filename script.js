const game = document.getElementById("game");

const touchArea = document.getElementById("touch-area");



let targetTime =
(Math.floor(Math.random()*61)+20)/10;


document.getElementById("target").textContent =
targetTime.toFixed(1);




let startTime = 0;

let pressing = false;

let finished = false;


let ink = null;

let animation = null;





function start(e){


    e.preventDefault();


    if(finished)
        return;


    pressing = true;


    startTime = performance.now();



    const rect =
    game.getBoundingClientRect();



    let x;
    let y;



    if(e.touches){

        x =
        e.touches[0].clientX - rect.left;

        y =
        e.touches[0].clientY - rect.top;

    }

    else {

        x =
        e.clientX - rect.left;

        y =
        e.clientY - rect.top;

    }





    ink =
    document.createElement("div");


    ink.className="ink";


    ink.style.left=x+"px";

    ink.style.top=y+"px";


    game.appendChild(ink);



    animation =
    requestAnimationFrame(
        animateInk
    );


}





function animateInk(){


    if(!pressing)
        return;



    let elapsed =
    (performance.now()-startTime)/1000;



    let scale =
    1 + elapsed*2.5;



    let opacity =
    Math.max(
        0.12 - elapsed*0.01,
        0.03
    );



    ink.style.transform =
    `
    translate(-50%,-50%)
    scale(${scale})
    `;



    ink.style.background =
    `
    rgba(0,122,255,${opacity})
    `;



    animation =
    requestAnimationFrame(
        animateInk
    );

}





function end(e){


    e.preventDefault();


    if(!pressing || finished)
        return;



    pressing=false;

    finished=true;



    cancelAnimationFrame(animation);



    const elapsed =
    (performance.now()-startTime)/1000;




    if(ink){

        ink.style.transition =
        "opacity .8s ease, transform .8s ease";


        ink.style.opacity=0;


        ink.style.transform =
        `
        translate(-50%,-50%)
        scale(5)
        `;



        setTimeout(()=>{

            ink.remove();

        },800);

    }



    revealScore(elapsed);



}





touchArea.addEventListener(
"mousedown",
start
);



window.addEventListener(
"mouseup",
end
);





touchArea.addEventListener(
"touchstart",
start,
{
    passive:false
}
);



window.addEventListener(
"touchend",
end
);







function revealScore(elapsed){



    let error =
    Math.abs(
        elapsed-targetTime
    );



    let score =
    Math.max(
        0,
        100-error*40
    );



    document.getElementById("result").innerHTML =


    `

    <div>


        <div class="score">

        ${score.toFixed(1)}%

        </div>



        <p>


        Tu visais
        <span class="small-highlight">
        ${targetTime.toFixed(1)} s
        </span>.


        <br>


        Tu as tenu
        <span class="small-highlight">
        ${elapsed.toFixed(2)} s
        </span>.


        <br><br>


        ${message(score)}


        </p>


    </div>

    `;


}





function message(score){


    if(score>=99)

        return "Ok... c'est presque louche.";


    if(score>=95)

        return "Propre. Très propre.";


    if(score>=85)

        return "Pas loin. Mais pas assez.";


    return "On va faire comme si c'était voulu.";

}