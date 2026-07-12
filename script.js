const tg = window.Telegram.WebApp;
tg.expand();
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDF8cpTgTFM4OFehNd1VGh3SQcFVnvhxqM",
  authDomain: "myfastapp-67358.firebaseapp.com",
  databaseURL: "https://myfastapp-67358.firebaseio.com",
  projectId: "myfastapp-67358",
  storageBucket: "myfastapp-67358.firebasestorage.app",
  messagingSenderId: "627059107646",
  appId: "1:627059107646:web:beba3f4790ecc9b4ac6e6f",
  measurementId: "G-V23WC40NP5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
let userBalance = 0;
let availableSpins = 2;
let completedVideos = 0;

document.addEventListener("DOMContentLoaded", function() {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        document.getElementById('username').innerText = `@${tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name}`;
    }
    updateUI();
    initWheel();
});

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    const activeBtn = Array.from(document.querySelectorAll('.nav-item')).find(btn => btn.getAttribute('onclick').includes(tabId));
    if (activeBtn) activeBtn.classList.add('active');
}

function updateUI() {
    document.getElementById('user-balance').innerText = userBalance;
    document.getElementById('spin-count').innerText = availableSpins;
    document.getElementById('video-count').innerText = completedVideos;
    document.getElementById('spin-btn').disabled = availableSpins <= 0;
}

const canvas = document.getElementById("wheel-canvas");
let ctx, arcSize, startAngle = 0, isSpinning = false;
const sectors = [
    { amount: 5, color: "#14142b" },
    { amount: 15, color: "#8a2be2" },
    { amount: 50, color: "#00e5ff" },
    { amount: 0, color: "#222244" },
    { amount: 100, color: "#00ff88" },
    { amount: 20, color: "#ff0055" }
];

function initWheel() {
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    arcSize = (2 * Math.PI) / sectors.length;
    drawWheel();
}

function drawWheel() {
    ctx.clearRect(0, 0, 300, 300);
    for (let i = 0; i < sectors.length; i++) {
        let angle = startAngle + i * arcSize;
        ctx.fillStyle = sectors[i].color;
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.arc(150, 150, 140, angle, angle + arcSize);
        ctx.lineTo(150, 150);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.stroke();
        
        ctx.save();
        ctx.translate(150, 150);
        ctx.rotate(angle + arcSize / 2);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(sectors[i].amount === 0 ? "Miss" : sectors[i].amount, 120, 5);
        ctx.restore();
    }
}

function triggerSpin() {
    if (isSpinning || availableSpins <= 0) return;
    isSpinning = true;
    availableSpins--;
    updateUI();
    
    let extraSpins = Math.floor(Math.random() * 5) + 5;
    let targetSector = Math.floor(Math.random() * sectors.length);
    let stopAngle = (3 * Math.PI / 2) - (targetSector * arcSize) - (arcSize / 2);
    let totalRotation = stopAngle + (extraSpins * 2 * Math.PI) - startAngle;
    
    let duration = 4000, startTime = null, initialAngle = startAngle;

    function animateWheel(timestamp) {
        if (!startTime) startTime = timestamp;
        let elapsed = timestamp - startTime;
        let progress = Math.min(elapsed / duration, 1);
        let easeOut = 1 - Math.pow(1 - progress, 3);
        
        startAngle = initialAngle + totalRotation * easeOut;
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animateWheel);
        } else {
            isSpinning = false;
            let winAmount = sectors[targetSector].amount;
            if (winAmount > 0) {
                userBalance += winAmount;
                alert(`🎉 Congratulations! You won ${winAmount} Coins!`);
            } else {
                alert(`😢 Better luck next time!`);
            }
            updateUI();
        }
    }
    requestAnimationFrame(animateWheel);
}

function watchVideoForSpin() {
    show_11260099().then((result) => {
        availableSpins += 1;
        alert("Ad Finished! You earned +1 Spin.");
        updateUI();
    }).catch((error) => {
        console.error("Ad failed, rejected, or timed out", error);
        alert("❌ Ad failed to load. Please try again.");
    });
}

function watchTaskVideo() {
    show_11260099().then((result) => {
        // বিজ্ঞাপন সফলভাবে দেখা হলে এই অংশটি রান করবে
        completedVideos += 1;
        userBalance += 25;
        alert("✔️ Video task complete! +25 Coins added.");
        updateUI();
    }).catch((error) => {
        // বিজ্ঞাপন ফেইল হলে, রিজেক্ট হলে বা টাইম-আউট হলে এখানে আসবে
        console.error("Ad failed, rejected, or timed out", error);
        alert("❌ Ad failed to load. Please try again.");
    });
}

function openWithdrawForm(gateway) {
    let minAmount = gateway === 'FaucetPay' ? 2000 : 5000;
    if (userBalance < minAmount) {
        alert(`❌ Minimum limit for ${gateway} is ${minAmount} Coins.`);
        return;
    }
    let userAddress = prompt(`Enter your ${gateway} Email or Pay ID:`);
    if (userAddress) {
        userBalance -= minAmount;
        alert(`🚀 Payout Request Submitted!\nStatus: Processing (3-6 Hours)`);
        updateUI();
    }
}

function copyRefLink() {
    const copyText = document.getElementById("ref-link");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
    alert("📋 Referral link copied!");
}
