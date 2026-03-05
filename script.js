let explosionIcon = "💗";
let isGifting = false;
let giftInterval = null;
let isMessaging = false;
let messageInterval = null;

let messages = [
  "Anh yêu em",
  "I love you",
  "Em là duy nhất",
  "Thương em",
  "Always with you",
];

let customImages = [];

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("icon")) {
  explosionIcon = decodeURIComponent(urlParams.get("icon"));
}
if (urlParams.has("msgs")) {
  try {
    const msgsParam = decodeURIComponent(atob(urlParams.get("msgs")));
    if (msgsParam.trim() !== "") {
      messages = msgsParam
        .split("|")
        .map((msg) => msg.trim())
        .filter((msg) => msg !== "");
    }
  } catch (e) {
    console.error("Invalid string in msgs param", e);
  }
}
if (urlParams.has("imgs")) {
  try {
    const imgsParam = decodeURIComponent(atob(urlParams.get("imgs")));
    if (imgsParam.trim() !== "") {
      customImages = imgsParam.split("||");
    }
  } catch (e) {
    console.error("Invalid string in imgs param", e);
  }
}

const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const giftBtn = document.getElementById("giftBtn");
const messageBtn = document.getElementById("messageBtn");
const menuTrigger = document.getElementById("menuTrigger");
const menuOptions = document.getElementById("menuOptions");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const pinModal = document.getElementById("pinModal");
const closePinModalBtn = document.getElementById("closePinModal");
const pinInputs = document.querySelectorAll(".pin-box");
const pinError = document.getElementById("pinError");
const iconInput = document.getElementById("iconInput");
const messageInput = document.getElementById("messageInput");
const saveIconBtn = document.getElementById("saveIcon");
const closeModalBtn = document.getElementById("closeModal");
const copyLinkBtn = document.getElementById("copyLinkBtn");
const popSound = document.getElementById("popSound");
const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");
let tempCustomImages = [];

imageUpload.addEventListener("change", (e) => {
  const files = e.target.files;
  tempCustomImages = [];
  imagePreview.innerHTML = "";

  if (files.length > 2) {
    showToast("Bạn chỉ có thể chọn tối đa 2 ảnh.");
  }

  const filesToProcess = Array.from(files).slice(0, 2);

  filesToProcess.forEach((file) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxSize = 200;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

        tempCustomImages.push(dataUrl);

        const previewImg = document.createElement("img");
        previewImg.src = dataUrl;
        imagePreview.appendChild(previewImg);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
});

const introOverlay = document.getElementById("introOverlay");
const mainContent = document.getElementById("mainContent");

function playPopSound() {
  if (popSound) {
    popSound.currentTime = 0;
    popSound.play().catch((err) => console.log("Sound play blocked"));
  }
}

function showToast(message) {
  let toast = document.querySelector(".toast-notification");
  if (toast) toast.remove();

  toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 1500);
}

function startExperience() {
  playPopSound();
  introOverlay.classList.add("fade-out");
  mainContent.classList.remove("hidden");
  document.body.classList.remove("container");

  bgMusic
    .play()
    .then(() => {
      musicBtn.innerHTML = '<i class="fa-regular fa-circle-pause"></i>';
    })
    .catch((err) => console.log("Music play blocked"));

  setTimeout(() => {
    introOverlay.remove();
  }, 1000);
}

introOverlay.addEventListener("click", startExperience);
introOverlay.addEventListener("touchstart", (e) => {
  startExperience();
  if (e.cancelable) e.preventDefault();
});

function autoPlayMusic() {
  if (bgMusic.paused) {
    bgMusic
      .play()
      .then(() => {
        musicBtn.innerHTML = '<i class="fa-regular fa-circle-pause"></i>';
      })
      .catch((err) => {
        console.log("Browser blocked autoplay. Waiting for user interaction.");
      });
  }
}

function toggleMenu(e) {
  e.stopPropagation();
  playPopSound();
  menuOptions.classList.toggle("active");
  autoPlayMusic();
}

menuTrigger.addEventListener("click", toggleMenu);
menuTrigger.addEventListener("touchstart", (e) => {
  toggleMenu(e);
  if (e.cancelable) e.preventDefault();
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".menu-container")) {
    menuOptions.classList.remove("active");
  }
});

function toggleMusic(e) {
  e.stopPropagation();
  playPopSound();
  if (bgMusic.paused) {
    bgMusic
      .play()
      .catch((err) => console.log("Music play blocked by browser."));
    musicBtn.innerHTML = '<i class="fa-regular fa-circle-pause"></i>';
  } else {
    bgMusic.pause();
    musicBtn.innerHTML = '<i class="fa-regular fa-circle-play"></i>';
  }
}

musicBtn.addEventListener("click", toggleMusic);
musicBtn.addEventListener("touchstart", (e) => {
  toggleMusic(e);
  if (e.cancelable) e.preventDefault();
});

function toggleFallingImages(e) {
  e.stopPropagation();
  playPopSound();
  isGifting = !isGifting;

  if (isGifting) {
    giftBtn.classList.add("active");
    createFallingImage();
    giftInterval = setInterval(createFallingImage, 1000);
  } else {
    giftBtn.classList.remove("active");
    clearInterval(giftInterval);
  }

  menuOptions.classList.remove("active");
}

function createFallingImage() {
  if (!isGifting) return;

  const img = document.createElement("img");
  if (customImages.length > 0) {
    img.src = customImages[Math.floor(Math.random() * customImages.length)];
  } else {
    const randomNum = Math.floor(Math.random() * 20) + 1;
    img.src = `./style/img/Anh (${randomNum}).jpg`;
  }
  img.className = "falling-image";

  const width = window.innerWidth;
  const size = width < 600 ? Math.random() * 40 + 50 : Math.random() * 60 + 60;
  const startX = Math.random() * (width - size);
  const duration = Math.random() * 4 + 4;

  img.style.left = startX + "px";
  img.style.width = size + "px";
  img.style.height = "auto";
  img.style.animationDuration = duration + "s";

  document.body.appendChild(img);

  setTimeout(() => {
    img.remove();
  }, duration * 1000);
}

giftBtn.addEventListener("click", toggleFallingImages);
giftBtn.addEventListener("touchstart", (e) => {
  toggleFallingImages(e);
  if (e.cancelable) e.preventDefault();
});

function toggleFallingMessages(e) {
  e.stopPropagation();
  playPopSound();
  isMessaging = !isMessaging;

  if (isMessaging) {
    messageBtn.classList.add("active");
    createFallingMessage();
    messageInterval = setInterval(createFallingMessage, 1500);
  } else {
    messageBtn.classList.remove("active");
    clearInterval(messageInterval);
  }

  menuOptions.classList.remove("active");
}

function createFallingMessage() {
  if (!isMessaging) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = "falling-message";
  msgDiv.innerText = messages[Math.floor(Math.random() * messages.length)];

  // Cute color palette
  const colors = [
    { text: "#ff69b4", border: "#ffb6c1" }, // Pink
    { text: "#9370db", border: "#e6e6fa" }, // Purple
    { text: "#40e0d0", border: "#afeeee" }, // Turquoise
    { text: "#ff8c00", border: "#ffe4b5" }, // Orange
    { text: "#20b2aa", border: "#e0ffff" }, // Light Sea Green
    { text: "#ff1493", border: "#ffc0cb" }, // Deep Pink
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const width = window.innerWidth;
  const padding = 20;
  const startX = Math.random() * (width - 180 - padding * 2) + padding;
  const duration = Math.random() * 5 + 5; // 5s to 10s
  const fontSize =
    width < 600 ? Math.random() * 4 + 14 : Math.random() * 6 + 16;

  msgDiv.style.left = Math.max(padding, startX) + "px";
  msgDiv.style.fontSize = fontSize + "px";
  msgDiv.style.color = randomColor.text;
  msgDiv.style.borderColor = randomColor.border;
  msgDiv.style.animationDuration = duration + "s";

  document.body.appendChild(msgDiv);

  setTimeout(() => {
    msgDiv.remove();
  }, duration * 1000);
}

messageBtn.addEventListener("click", toggleFallingMessages);
messageBtn.addEventListener("touchstart", (e) => {
  toggleFallingMessages(e);
  if (e.cancelable) e.preventDefault();
});

function openPinModal(e) {
  e.stopPropagation();
  playPopSound();
  pinModal.classList.add("active");
  pinInputs.forEach((input) => (input.value = ""));
  pinError.style.display = "none";
  menuOptions.classList.remove("active");
  setTimeout(() => pinInputs[0].focus(), 100);
}

settingsBtn.addEventListener("click", openPinModal);
settingsBtn.addEventListener("touchstart", (e) => {
  openPinModal(e);
  if (e.cancelable) e.preventDefault();
});

closePinModalBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  playPopSound();
  pinModal.classList.remove("active");
});

pinModal.addEventListener("click", (e) => {
  if (e.target === pinModal) {
    pinModal.classList.remove("active");
  }
});

pinInputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    if (e.target.value.length === 1) {
      if (index < pinInputs.length - 1) {
        pinInputs[index + 1].focus();
      } else {
        checkPin();
      }
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      pinInputs[index - 1].focus();
    }
  });
});

function checkPin() {
  const enteredPin = Array.from(pinInputs)
    .map((i) => i.value)
    .join("");
  if (enteredPin === "0803") {
    pinModal.classList.remove("active");
    settingsModal.classList.add("active");
    iconInput.value = explosionIcon;
    messageInput.value = messages.join(", ");
  } else {
    pinError.style.display = "block";
    pinInputs.forEach((input) => {
      input.value = "";
      input.style.borderColor = "red";
    });
    setTimeout(() => {
      pinInputs.forEach(
        (input) => (input.style.borderColor = "rgba(255, 255, 255, 0.2)"),
      );
      pinInputs[0].focus();
    }, 1000);
  }
}

function program(delay = 200) {
  (function () {
    const _b = (s) => decodeURIComponent(escape(atob(s)));
    const _d = [
      "QuG6o24gcXV54buBbiB0aHXhu5ljIHbhu4IgRHIuR2lmdGVy",
      "VGlrdG9rOiBodHRwczovL3d3dy50aWt0b2suY29tL0Bkci5naWZ0ZXIzMDY=",
      "R2l0aHViOiBodHRwczovL2dpdGh1Yi5jb20vRHJHaWZ0ZXI=",
    ];

    setTimeout(() => {
      _d.forEach((x) => console.log(_b(x)));
    }, delay);
  })();
}

closeModalBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  playPopSound();
  settingsModal.classList.remove("active");
});

saveIconBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  playPopSound();
  if (iconInput.value.trim() !== "") {
    explosionIcon = iconInput.value.trim();
  }
  if (messageInput.value.trim() !== "") {
    messages = messageInput.value
      .split(",")
      .map((msg) => msg.trim())
      .filter((msg) => msg !== "");
  }
  if (tempCustomImages.length > 0) {
    customImages = [...tempCustomImages];
  } else if (imageUpload.files.length === 0 && customImages.length === 0) {
    customImages = [];
  }
  settingsModal.classList.remove("active");
});

copyLinkBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  playPopSound();

  if (iconInput.value.trim() !== "") {
    explosionIcon = iconInput.value.trim();
  }
  if (messageInput.value.trim() !== "") {
    messages = messageInput.value
      .split(",")
      .map((msg) => msg.trim())
      .filter((msg) => msg !== "");
  }
  if (tempCustomImages.length > 0) {
    customImages = [...tempCustomImages];
  }

  const currentUrl = window.location.href.split("?")[0];
  const base64Msgs = btoa(encodeURIComponent(messages.join("|")));
  let newUrl = `${currentUrl}?icon=${encodeURIComponent(explosionIcon)}&msgs=${encodeURIComponent(base64Msgs)}`;

  if (customImages.length > 0) {
    const base64Imgs = btoa(encodeURIComponent(customImages.join("||")));
    newUrl += `&imgs=${encodeURIComponent(base64Imgs)}`;
  }

  if (newUrl.length > 8000) {
    showToast(`⚠️ Rất tiếc, ảnh bạn chọn có dung lượng quá lớn`);
    playPopSound();
    return;
  }

  navigator.clipboard
    .writeText(newUrl)
    .then(() => {
      showToast("Copy link thành công");
    })
    .catch((err) => {
      console.error("Failed to copy link: ", err);
      showToast("Có lỗi xảy ra khi copy link!");
    });

  settingsModal.classList.remove("active");
});

settingsModal.addEventListener("click", (e) => {
  if (e.target === settingsModal) {
    settingsModal.classList.remove("active");
  }
});

document.querySelectorAll(".modal-content").forEach((content) => {
  content.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

document.addEventListener("click", (e) => {
  autoPlayMusic();
  playPopSound();

  if (e.target.closest(".menu-container") || e.target.closest(".modal-content"))
    return;
  if (settingsModal.classList.contains("active")) return;

  createHearts(e.clientX, e.clientY);
});

document.addEventListener("touchstart", (e) => {
  autoPlayMusic();
  playPopSound();

  if (e.target.closest(".menu-container") || e.target.closest(".modal-content"))
    return;
  if (settingsModal.classList.contains("active")) return;

  createHearts(e.touches[0].clientX, e.touches[0].clientY);
});

function createHearts(x, y) {
  const numHearts = 15;
  const icons = Array.from(explosionIcon).filter((char) => char.trim() !== "");

  for (let i = 0; i < numHearts; i++) {
    const heart = document.createElement("div");
    heart.innerHTML = icons[Math.floor(Math.random() * icons.length)] || "💗";
    heart.className = "heart";

    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 150;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    heart.style.setProperty("--x", dx);
    heart.style.setProperty("--y", dy);
    heart.style.left = x + "px";
    heart.style.top = y + "px";
    heart.style.fontSize = Math.random() * 20 + 10 + "px";
    heart.style.setProperty("--r", Math.random() * 360 - 180 + "deg");

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1000);
  }
}

program();
