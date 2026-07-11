const tg = window.Telegram.WebApp;
tg.expand();

// AdsGram
const AdController = window.Adsgram.init({
    blockId: "37806"
});

// User Data
let userBalance = 0;
let availableSpins = 3;
let completedVideos = 0;
let totalRefs = 0;

// Wheel
const canvas = document.getElementById("wheel-canvas");
let ctx;
let startAngle = 0;
let arcSize;
let isSpinning = false;

// Wheel Items
const sectors = [
 {text:"10",color:"#00c8ff",reward:10},
 {text:"15",color:"#00ff88",reward:15},
 {text:"20",color:"#ffd93d",reward:20},
 {text:"25",color:"#8b5cf6",reward:25},
 {text:"MISS",color:"#222",reward:0},
 {text:"10",color:"#ff4d4d",reward:10},
 {text:"15",color:"#ffffff",reward:15},
 {text:"20",color:"#3b82f6",reward:20},
 {text:"25",color:"#16a34a",reward:25},
 {text:"MISS",color:"#000000",reward:0}
];

document.addEventListener("DOMContentLoaded",()=>{

if(tg.initDataUnsafe.user){

document.getElementById("username").innerHTML=
"@"+(tg.initDataUnsafe.user.username ||
tg.initDataUnsafe.user.first_name);

}

ctx=canvas.getContext("2d");

arcSize=(2*Math.PI)/sectors.length;

drawWheel();

updateUI();

});
function drawWheel(){

ctx.clearRect(0,0,320,320);

for(let i=0;i<sectors.length;i++){

let angle=startAngle+i*arcSize;

ctx.beginPath();

ctx.moveTo(160,160);

ctx.arc(160,160,150,angle,angle+arcSize);

ctx.closePath();

ctx.fillStyle=sectors[i].color;

ctx.fill();

ctx.strokeStyle="#111";

ctx.lineWidth=2;

ctx.stroke();

ctx.save();

ctx.translate(160,160);

ctx.rotate(angle+arcSize/2);

ctx.fillStyle="#fff";

ctx.font="bold 18px Arial";

ctx.textAlign="right";

ctx.fillText(sectors[i].text,130,5);

ctx.restore();

}

}

function triggerSpin(){

if(isSpinning) return;

if(availableSpins<=0){

alert("No Spins Left");

return;

}

availableSpins--;

updateUI();

isSpinning=true;

let randomSector=Math.floor(Math.random()*sectors.length);

let spins=6;

let stopAngle=(3*Math.PI/2)

-(randomSector*arcSize)

-(arcSize/2);

let totalRotate=(spins*2*Math.PI)+stopAngle-startAngle;

let duration=5000;

let start=null;

let initial=startAngle;

function animate(time){

if(!start) start=time;

let progress=(time-start)/duration;

if(progress>1) progress=1;

let ease=1-Math.pow(1-progress,3);

startAngle=initial+(totalRotate*ease);

drawWheel();

if(progress<1){

requestAnimationFrame(animate);

}else{

isSpinning=false;

let reward=sectors[randomSector].reward;

if(reward>0){

userBalance+=reward;

alert("🎉 You won "+reward+" Coins");

}else{

alert("😢 MISS");

}

updateUI();

}

}

requestAnimationFrame(animate);

}
function watchVideoForSpin(){

show_11260099().then(()=>{

availableSpins++;

alert("🎉 +1 Spin Added");

updateUI();

}).catch(()=>{

alert("❌ Ad not completed.");

});

}

function watchTaskVideo(){

show_11260099().then(()=>{

completedVideos++;

userBalance+=15;

alert("✅ +15 Coins Earned");

updateUI();

}).catch(()=>{

alert("❌ Ad not completed.");

});

}

function claimDailyBonus(){

show_11260099().then(()=>{

userBalance+=25;

alert("🎁 Daily Bonus +25 Coins");

updateUI();

}).catch(()=>{

alert("❌ Ad not completed.");

});

}

function updateUI(){

document.getElementById("user-balance").innerHTML=userBalance;

document.getElementById("spin-count").innerHTML=availableSpins;

document.getElementById("video-count").innerHTML=completedVideos;

const wb=document.getElementById("withdraw-balance");
if(wb){
wb.innerHTML=userBalance;
}

const spinBtn=document.getElementById("spin-btn");

if(spinBtn){

spinBtn.disabled=availableSpins<=0;

}

function openWithdrawForm(gateway){

    if(userBalance < 1000){
        alert("❌ Minimum Withdraw is 1000 Coins");
        return;
    }

    let address = prompt(
        gateway === "Binance"
        ? "Enter Binance Pay ID"
        : "Enter FaucetPay Email"
    );

    if(address==null || address==""){
        return;
    }

    alert(
        "✅ Withdraw Request Submitted\n\n" +
        "Gateway : " + gateway +
        "\nAmount : 1000 Coins" +
        "\nStatus : Pending"
    );

    userBalance -= 1000;

    updateUI();

}

function copyRefLink(){

    let link=document.getElementById("ref-link");

    navigator.clipboard.writeText(link.value);

    alert("✅ Referral Link Copied");

}

function shareReferral(){

    if(navigator.share){

        navigator.share({

            title:"LOSTER FAST",

            text:"Join LOSTER FAST and earn USDT!",

            url:document.getElementById("ref-link").value

        });

    }else{

        copyRefLink();

    }

}

function switchTab(tab){

document.querySelectorAll(".tab-content").forEach(e=>{

e.classList.remove("active");

});

document.getElementById(tab).classList.add("active");

document.querySelectorAll(".nav-item").forEach(btn=>{

btn.classList.remove("active");

});

event.target.classList.add("active");

}
