if (location.pathname.endsWith("index.html") || location.pathname.endsWith("/")) {

    window.addEventListener("scroll", function() {
        sessionStorage.setItem("homeScroll", window.scrollY);
    });

}



const isReturningHome = sessionStorage.getItem("returnHome");

const wasRouteSectionVisible =
    sessionStorage.getItem("routeSectionVisible") === "true";

if (isReturningHome) {

    document.querySelector(".slideshow")?.classList.add("home-return");
    document.querySelector(".gallery-title")?.classList.add("home-return");
    document.querySelector(".top-slider")?.classList.add("home-return");
    document.querySelector(".bottom-slider")?.classList.add("home-return");

    const routeSection = document.querySelector(".route-section");

    if (routeSection && wasRouteSectionVisible) {
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                routeSection.classList.add("route-home-return");
            });
        });
    }

    const homeScroll = sessionStorage.getItem("homeScroll");

    if (homeScroll !== null) {
        setTimeout(function() {
            window.scrollTo(0, Number(homeScroll));
        }, 50);
    }

    sessionStorage.removeItem("returnHome");
    sessionStorage.removeItem("routeSectionVisible");
}

const slide1 = document.getElementById("slide1");
const slide2 = document.getElementById("slide2");

const photos = [
    "images/slide/DSC_0601.jpg",
    "images/slide/DSC_0780.jpg",
    "images/slide/DSC_1362.jpg",
    "images/slide/DSC_2281.jpg",
    "images/slide/DSC00279.jpg",
    "images/slide/DSC02025.jpg",
    "images/slide/DSC04310.jpg",
    "images/slide/DSC04609.jpg",
    "images/slide/DSC05366.jpg",
    "images/slide/DSC05666.jpg"
];

let current = slide1;
let next = slide2;

let number = 0;
let lastPhoto = "";

function shuffle() {
    shuffledPhotos = [...photos];

    for (let i = shuffledPhotos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffledPhotos[i], shuffledPhotos[j]] =
        [shuffledPhotos[j], shuffledPhotos[i]];
    }

    
    if (
        shuffledPhotos.length > 1 &&
        shuffledPhotos[0] === lastPhoto
    ) {
        [shuffledPhotos[0], shuffledPhotos[1]] =
        [shuffledPhotos[1], shuffledPhotos[0]];
    }
}

shuffle();

current.src = shuffledPhotos[number];

setInterval(function() {

    number++;

    
    if (number >= shuffledPhotos.length) {
        shuffle();
        number = 0;
    }

    next.src = shuffledPhotos[number];

    
    next.style.opacity = 1;
    current.style.opacity = 0;

    
    let temp = current;
    current = next;
    next = temp;

}, 4500);











// ==============================
// 上段 top-slider
// ==============================

const topSlider = document.querySelector(".top-slider");
const topTrack = document.querySelector(".top-track");

if (topSlider && topTrack) {

    // 元の5枚をコピーして、3セットにする
    const originalItems = Array.from(
        topTrack.querySelectorAll(".top-item")
    );

    originalItems.forEach(item => {
        topTrack.appendChild(item.cloneNode(true));
    });

    originalItems.forEach(item => {
        topTrack.appendChild(item.cloneNode(true));
    });


    let topPosition = 0;

    // 自動スクロール速度
    const topSpeed = 0.5;

    // スワイプ関連
    let isDragging = false;
    let startX = 0;
    let startPosition = 0;

    // 慣性
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;

    // 自動スクロール再開タイマー
    let restartTimer;

    // 1.2秒待っているか
    let waitingToRestart = false;


    // 5枚分の横幅
    function getSetWidth() {
        return topTrack.scrollWidth / 3;
    }


    // 位置を設定
    function updatePosition() {
        topTrack.style.transform =
            `translateX(${topPosition}px)`;
    }


    // ==============================
    // 無限ループ
    // ==============================

    function checkLoop() {

        const setWidth = getSetWidth();

        // 左へ行きすぎたら1セット右へ
        if (topPosition <= -setWidth * 2) {
            topPosition += setWidth;
        }

        // 右へ行きすぎたら1セット左へ
        if (topPosition >= 0) {
            topPosition -= setWidth;
        }
    }


    // ==============================
    // 自動スクロール
    // 左方向
    // ==============================

    function autoScroll() {

        if (
            !isDragging &&
            velocity === 0 &&
            !waitingToRestart
        ) {

            topPosition -= topSpeed;

            checkLoop();
            updatePosition();
        }

        requestAnimationFrame(autoScroll);
    }


    // 最初は真ん中のセットから開始
    topPosition = -getSetWidth();

    updatePosition();

    autoScroll();


    // ==============================
    // 指で触った
    // ==============================

    topSlider.addEventListener("touchstart", function(e) {

        isDragging = true;

        velocity = 0;

        waitingToRestart = false;

        clearTimeout(restartTimer);

        startX = e.touches[0].clientX;
        lastX = startX;

        startPosition = topPosition;

        lastTime = performance.now();
    });


    // ==============================
    // 指を動かす
    // ==============================

    topSlider.addEventListener("touchmove", function(e) {

        if (!isDragging) return;

        const currentX = e.touches[0].clientX;
        const currentTime = performance.now();

        const difference =
            currentX - startX;

        topPosition =
            startPosition + difference;


        // 慣性用の速度を計算
        const dx =
            currentX - lastX;

        const dt =
            currentTime - lastTime;

        if (dt > 0) {
            velocity =
                dx / dt * 16;
        }

        lastX = currentX;
        lastTime = currentTime;


        checkLoop();
        updatePosition();
    });


    // ==============================
    // 指を離した
    // ==============================

    topSlider.addEventListener("touchend", function() {

        isDragging = false;


        // ==========================
        // 慣性スクロール
        // ==========================

        function inertia() {

            // 慣性がほぼなくなった
            if (Math.abs(velocity) < 0.05) {

                velocity = 0;

                // 1.2秒待機
                waitingToRestart = true;

                restartTimer = setTimeout(function() {

                    waitingToRestart = false;

                }, 100);

                return;
            }


            // 慣性で移動
            topPosition += velocity;


            // 少しずつ減速
            velocity *= 0.94;


            checkLoop();
            updatePosition();


            requestAnimationFrame(inertia);
        }


        inertia();

    });

}












// ==============================
// 下段 bottom-slider
// ==============================

const bottomSlider = document.querySelector(".bottom-slider");
const bottomTrack = document.querySelector(".bottom-track");

if (bottomSlider && bottomTrack) {

    const bottomOriginalItems =
        Array.from(bottomTrack.querySelectorAll(".bottom-item"));

    // 3セット作る
    bottomOriginalItems.forEach(item => {
        bottomTrack.appendChild(item.cloneNode(true));
    });

    bottomOriginalItems.forEach(item => {
        bottomTrack.appendChild(item.cloneNode(true));
    });

    let bottomPosition = 0;

    // 自動スクロール速度
    const bottomSpeed = 0.5;

    let bottomDragging = false;
    let bottomStartX = 0;
    let bottomStartPosition = 0;

    // 慣性
    let bottomVelocity = 0;
    let bottomLastX = 0;
    let bottomLastTime = 0;

    let bottomRestartTimer;


    // 1セット分の幅
    function getBottomSetWidth() {
        return bottomTrack.scrollWidth / 3;
    }


    function updateBottomPosition() {
        bottomTrack.style.transform =
            `translateX(${bottomPosition}px)`;
    }


    // 無限ループ
    function checkBottomLoop() {

        const setWidth = getBottomSetWidth();

        // 右へ行きすぎたら1セット左へ
        if (bottomPosition >= 0) {
            bottomPosition -= setWidth;
        }

        // 左へ行きすぎたら1セット右へ
        if (bottomPosition <= -setWidth * 2) {
            bottomPosition += setWidth;
        }
    }


    // ==============================
    // 自動スクロール
    // 右方向
    // ==============================

    function bottomAutoScroll() {

        if (!bottomDragging && bottomVelocity === 0) {

            bottomPosition += bottomSpeed;

            checkBottomLoop();
            updateBottomPosition();
        }

        requestAnimationFrame(bottomAutoScroll);
    }


    // 最初は真ん中のセット
    bottomPosition = -getBottomSetWidth();

    updateBottomPosition();

    bottomAutoScroll();


    // ==============================
    // 指で触った
    // ==============================

    bottomSlider.addEventListener("touchstart", function(e) {

        bottomDragging = true;

        bottomVelocity = 0;

        clearTimeout(bottomRestartTimer);

        bottomStartX = e.touches[0].clientX;
        bottomStartPosition = bottomPosition;

        bottomLastX = bottomStartX;
        bottomLastTime = performance.now();
    });


    // ==============================
    // 指を動かす
    // ==============================

    bottomSlider.addEventListener("touchmove", function(e) {

        if (!bottomDragging) return;

        const currentX = e.touches[0].clientX;
        const currentTime = performance.now();

        const difference = currentX - bottomStartX;

        bottomPosition =
            bottomStartPosition + difference;

        // 慣性用の速度
        const dx = currentX - bottomLastX;
        const dt = currentTime - bottomLastTime;

        if (dt > 0) {
            bottomVelocity = dx / dt * 16;
        }

        bottomLastX = currentX;
        bottomLastTime = currentTime;

        checkBottomLoop();
        updateBottomPosition();
    });


    // ==============================
    // 指を離した
    // ==============================

    bottomSlider.addEventListener("touchend", function() {

        bottomDragging = false;


        // 慣性スクロール
        function bottomInertia() {

            if (Math.abs(bottomVelocity) < 0.05) {
                bottomVelocity = 0;
                return;
            }

            bottomPosition += bottomVelocity;

            bottomVelocity *= 0.94;

            checkBottomLoop();
            updateBottomPosition();

            requestAnimationFrame(bottomInertia);
        }

        bottomInertia();


        // 1.2秒後に自動スクロール再開
        bottomRestartTimer = setTimeout(function() {

            bottomVelocity = 0;

        }, 100);

    });

}







const slideshow = document.querySelector(".slideshow");

if (slideshow) {

    if (!sessionStorage.getItem("visited")) {

        
        slideshow.classList.add("first-visit");

        sessionStorage.setItem("visited", "true");

    } else {

        
        slideshow.classList.add("normal-visit");

    }

}


setTimeout(function() {

    const topSlider = document.querySelector(".top-slider");
    const bottomSlider = document.querySelector(".bottom-slider");

    if (topSlider) {
        topSlider.classList.add("slider-show");
    }

    if (bottomSlider) {
        bottomSlider.classList.add("slider-show");
    }

}, 2000);






setTimeout(function() {

    const galleryTitle = document.querySelector(".gallery-title");

    if (galleryTitle) {
        galleryTitle.classList.add("gallery-show");
    }

}, 1000);










const routeSection = document.querySelector(".route-section");

if (routeSection) {

    const observer = new IntersectionObserver(function(entries) {

        entries.forEach(function(entry) {

            if (entry.isIntersecting) {

                // HOME復帰時にすでに表示する場合は何もしない
                if (!routeSection.classList.contains("route-home-return")) {
                    routeSection.classList.add("show");
                }

                observer.unobserve(routeSection);
            }

        });

    }, {
        threshold: 0.2
    });

    observer.observe(routeSection);
}









const routeItems = document.querySelectorAll(".item");

if (routeItems.length > 0) {

    const pageKey = "visited-" + location.pathname;

    if (!sessionStorage.getItem(pageKey)) {

        routeItems.forEach(function(item) {
            item.classList.add("route-first");
        });

        sessionStorage.setItem(pageKey, "true");
    }
}





const sliderItems = document.querySelectorAll(".container .item");

if (sliderItems.length > 0) {

    const pageKey = "visited-slider-" + location.pathname;

    if (!sessionStorage.getItem(pageKey)) {

        sliderItems.forEach(function(item) {
            item.classList.add("slider-fade");
        });

        sessionStorage.setItem(pageKey, "true");
    }
}





function saveRouteSectionState() {

    const routeSection =
        document.querySelector(".route-section");

    if (routeSection &&
        routeSection.classList.contains("show")) {

        sessionStorage.setItem(
            "routeSectionVisible",
            "true"
        );

    } else {

        sessionStorage.setItem(
            "routeSectionVisible",
            "false"
        );

    }
}