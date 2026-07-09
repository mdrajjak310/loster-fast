const AdController = window.Adsgram.init({ blockId: "37806" });
let userBalance = 0;
let availableSpins = 0;

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

function updateUI() {
    document.getElementById('user-balance').innerText = userBalance;
    document.getElementById('spin-count').innerText = availableSpins;
}

function watchVideoForSpin() {
    AdController.show().then(() => { availableSpins++; updateUI(); });
}

function watchTaskVideo() {
    AdController.show().then(() => { userBalance += 15; updateUI(); });
}

function triggerSpin() {
    if (typeof show_11260099 !== 'undefined') show_11260099();
}
