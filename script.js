const game = document.getElementById("game");
const touchArea = document.getElementById("touch-area");

let targetTime = (Math.floor(Math.random()*61)+20)/10;

document.getElementById("target").textContent =
targetTime.toFixed(1);

let pressing=false;
let finished=false;

let startTime=0;

let ripple=null;
let animation=null;





function start(e){

    e.preventDefault();

    if(finished) return;

    pressing=true;

    startTime=performance.now();

    const rect=game.getBoundingClientRect();

    let x,y;

    if(e.touches){

        x=e.touches[0].clientX-rect.left;
        y=e.touches[0].clientY-rect.top;

    }else{

        x=e.clientX-rect.left;
        y=e.clientY-rect.top;

    }

    ripple=document.createElement("div");

    ripple.className="ripple";

    ripple.style.left=x+"px";
    ripple.style.top=y+"px";

    game.appendChild(ripple);

    animation=requestAnimationFrame(growRipple);

}





function growRipple(){

    if(!pressing) return;

    const elapsed=(performance.now()-startTime)/1000;

    const scale=1+elapsed*6;

    const opacity=Math.max(
        .08-elapsed*.008,
        .015
    );

    ripple.style.transform=
        `translate(-50%,-50%) scale(${scale})`;

    ripple.style.background=
        `rgba(0,122,255,${opacity})`;

    animation=requestAnimationFrame(growRipple);

}





function end(e){

    e.preventDefault();

    if(!pressing || finished)
        return;

    pressing=false;
    finished=true;

    cancelAnimationFrame(animation);

    const elapsed=(performance.now()-startTime)/1000;

    ripple.style.transition=
        "opacity .35s ease";

    ripple.style.opacity=0;

    setTimeout(()=>{

        ripple.remove();

    },350);

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
{passive:false}
);

window.addEventListener(
"touchend",
end
);





function revealScore(elapsed){

    const error=Math.abs(
        elapsed-targetTime
    );

    const score=Math.max(
        0,
        100-error*40
    );

    document.getElementById("result").innerHTML=`

    <div>

        <div class="score">

            ${score.toFixed(1)}%

        </div>

        <p>

            Tu visais
            <span class="small-highlight">${targetTime.toFixed(1)} s</span>.

            <br>

            Tu as tenu
            <span class="small-highlight">${elapsed.toFixed(2)} s</span>.

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