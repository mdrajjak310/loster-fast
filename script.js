// Adsgram ইনিশিয়ালাইজেশন
const AdController = window.Adsgram.init({ blockId: "37806" });

let spins = 3;
let coins = 5;

// বিজ্ঞাপন দেখানোর ফাংশন (পুরো কোড একসাথে)
function showAd() {
    console.log("বিজ্ঞাপন লোড হচ্ছে...");
    AdController.show().then((result) => {
        // বিজ্ঞাপন দেখা শেষ হলে স্পিন যোগ হবে
        spins += 1;
        document.getElementById('spins').innerText = spins;
        alert("অভিনন্দন! আপনি বিজ্ঞাপন দেখে ১টি স্পিন পেয়েছেন।");
    }).catch((error) => {
        // কোনো সমস্যা হলে
        console.error("বিজ্ঞাপন দেখাতে সমস্যা হয়েছে:", error);
        alert("দুঃখিত, বিজ্ঞাপনটি এই মুহূর্তে লোড হচ্ছে না।");
    });
}

// বাটন ক্লিক ইভেন্ট
document.getElementById('ad-btn').addEventListener('click', showAd);

document.getElementById('spin-btn').addEventListener('click', () => {
    if (spins > 0) {
        spins--;
        coins += Math.floor(Math.random() * 50);
        document.getElementById('spins').innerText = spins;
        document.getElementById('coins').innerText = coins;
    } else {
        alert("স্পিন শেষ! অনুগ্রহ করে ভিডিও দেখুন।");
    }
});
