const canvas = document.getElementById("wheel-canvas");
const ctx = canvas.getContext("2d");
const AdController = window.Adsgram.init({ blockId: "37806" });

let userBalance = 0;
let availableSpins = 3;
let startAngle = 0;
let isSpinning = false;

// ৬টি সেক্টর: ১০(২), ১৫(২), ২০(১), ৩০(১)
const sectors = [
    { label: "10", color: "#ffffff" }, // সাদা
    { label: "15", color: "#000000" }, // কালো
    { label: "10", color: "#ffff00" }, // হলুদ
    { label: "15", color: "#0000ff" }, // নীল
    { label: "20", color: "#00ff00" }, // সবুজ
    { label: "30", color: "#8a2be2" }  // পার্পল (আপনার ডিজাইনের সাথে সামঞ্জস্যপূর্ণ)
];

function drawWheel() {
    const arc = (2 * Math.PI) / sectors.length;
    ctx.clearRect(0, 0, 300, 300);
    sectors.forEach((sector, i) => {
        const angle = startAngle + i * arc;
        ctx.fillStyle = sector.color;
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.arc(150, 150, 140, angle, angle + arc);
        ctx.lineTo(150, 150);
        ctx.fill();
        ctx.save();
        ctx.fillStyle = sector.color === "#ffffff" ? "#000" : "#fff";
        ctx.translate(150 + Math.cos(angle + arc / 2) * 100, 150 + Math.sin(angle + arc / 2) * 100);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.fillText(sector.label, -10, 0);
        ctx.restore();
    });
}

function triggerSpin() {
    if (isSpinning || availableSpins <= 0) return;
    isSpinning = true;
    availableSpins--;
    updateUI();

    const spinDuration = 3000;
    const rotations = 5;
    const finalAngle = startAngle + (rotations * 2 * Math.PI) + (Math.random() * 2 * Math.PI);
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        startAngle = finalAngle * easeOut;
        drawWheel();
        if (progress < 1) requestAnimationFrame(animate);
        else {
            isSpinning = false;
            // এখানে থামার পর ক্যালকুলেশন হবে
            alert("🎉 স্পিন সম্পন্ন হয়েছে!");
        }
    }
    animate();
}

function updateUI() {
    document.getElementById('user-balance').innerText = userBalance;
    document.getElementById('spin-count').innerText = availableSpins;
}

drawWheel();
updateUI();
