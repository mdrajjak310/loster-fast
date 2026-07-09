const tg = window.Telegram.WebApp;
tg.expand();

let userBalance = 0;
let availableSpins = 3;
let completedVideos = 0;

// Ads setup
const AdController = window.Adsgram.init({ blockId: "37806" });

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

function updateUI() {
    document.getElementById('user-balance').innerText = userBalance;
    document.getElementById('spin-count').innerText = availableSpins;
    document.getElementById('video-count').innerText = completedVideos;
}

function watchVideoForSpin() {
    AdController.show().then(() => {
        availableSpins += 1;
        updateUI();
    });
}

function watchTaskVideo() {
    AdController.show().then(() => {
        userBalance += 15;
        completedVideos += 1;
        updateUI();
    });
}

function triggerSpin() {
    if (typeof show_11260099 !== 'undefined') show_11260099();
    alert("Spinning...");
}

updateUI();
