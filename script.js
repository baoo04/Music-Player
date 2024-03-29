const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $(".playlist");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const preBtn = $(".btn-prev");
const randomBtn = $(".fa-solid.fa-shuffle");
const repeatBtn = $(".fa-solid.fa-repeat");
const curTime = $(".time");
const total = $(".total");

progress.value = 0;

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Ánh nắng của anh",
            singer: "Đức Phúc",
            path: "./assets/music/ANCA.mp3",
            image: "./assets/img/ANCA.jpg",
        },
        {
            name: "Chuyến đi của năm",
            singer: "Soobin Hoàng Sơn",
            path: "./assets/music/CDCN.mp3",
            image: "./assets/img/didetrove2.jpg",
        },
        {
            name: "Có hẹn với thanh xuân",
            singer: "Moonstar",
            path: "./assets/music/CHVTX.mp3",
            image: "./assets/img/CoHenVoiThanhXuan.jpg",
        },
        {
            name: "Đi để trở về",
            singer: "Soobin Hoàng Sơn",
            path: "./assets/music/DDTV.mp3",
            image: "./assets/img/DiDetrove.jpg",
        },
        {
            name: "Đi về nhà",
            singer: "Đen - JustaTee",
            path: "./assets/music/DVN.mp3",
            image: "./assets/img/DiVeNha.jpg",
        },
        {
            name: "Những gì anh nói",
            singer: "Bozit",
            path: "./assets/music/NGAN.mp3",
            image: "./assets/img/nhungGiAnhNoi.jpg",
        },
        {
            name: "Orange 7",
            singer: "Miyazono Kaori",
            path: "./assets/music/ORANGE7.mp3",
            image: "./assets/img/orange7.jpg",
        },
        {
            name: "Răng Khôn",
            singer: "Phí Phương Anh",
            path: "./assets/music/RK.mp3",
            image: "./assets/img/rangkhonreal.jpg",
        },
        {
            name: "Sóng gió",
            singer: "Jack - KICM",
            path: "./assets/music/SG.mp3",
            image: "./assets/img/SongGio.jpg",
        },
    ],

    render: function () {
        const htmls = this.songs.map(function (song, index) {
            return `
            <div class="song d-flex align-items-center ${
                index == app.currentIndex ? "active-song" : ""
            }" data-index="${index}">
                <div class="group d-flex align-items-center py-10">
                    <div class="icon" style="background-image: url('${
                        song.image
                    }')"></div>
                    <div class="content">
                        <h3 style="font-size: 25px; font-weight: 700">${
                            song.name
                        }</h3>
                        <p style="font-size: 20px">${song.singer}</p>
                    </div>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        });
        playlist.innerHTML = htmls.join("\n");
    },

    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    loadCurrentSong: function () {
        const audio = $("#audio");
        const name = $("header h2");
        const cdImage = $(".cd");

        name.textContent = this.currentSong.name;
        audio.src = this.currentSong.path;
        cdImage.src = `${this.currentSong.image}`;
    },

    playSong: function () {
        const pause = $(".fa-solid.fa-circle-pause");
        const playing = $(".fa-solid.fa-circle-play");
        pause.style.display = "none";
        const playBtn = $(".btn.btn-toggle");
        const CD = $(".cd");

        const CDanimation = CD.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000,
            iterations: Infinity,
        });

        CDanimation.pause();

        playBtn.onclick = function () {
            if (!app.isPlaying) {
                CDanimation.play();
                app.isPlaying = true;
                audio.play();
                playing.style.display = "none";
                pause.style.display = "block";
            } else {
                app.isPlaying = false;
                CDanimation.pause();
                audio.pause();
                playing.style.display = "block";
                pause.style.display = "none";
            }
        };

        audio.ontimeupdate = function () {
            progress.value = audio.duration
                ? (audio.currentTime / audio.duration) * 100
                : 0;
            app.updateSongTime();
        };

        progress.onchange = function (e) {
            const timeChange = (e.target.value / 100) * audio.duration;
            audio.currentTime = timeChange;
        };

        nextBtn.onclick = function () {
            app.scrollToActiveSong();
            CDanimation.play();
            if (app.isRandom) {
                app.randomSong();
                audio.play();
                app.render();
                playing.style.display = "none";
                pause.style.display = "block";
                app.isPlaying = true;
            } else {
                app.nextSong();
                audio.play();
                app.render();
                playing.style.display = "none";
                pause.style.display = "block";
                app.isPlaying = true;
            }
        };

        preBtn.onclick = function () {
            app.scrollToActiveSong();
            CDanimation.play();
            if (app.isRandom) {
                app.randomSong();
                audio.play();
                app.render();
                playing.style.display = "none";
                pause.style.display = "block";
                app.isPlaying = true;
            } else {
                app.prevSong();
                audio.play();
                app.render();
                playing.style.display = "none";
                pause.style.display = "block";
                app.isPlaying = true;
            }
        };

        randomBtn.onclick = function () {
            if (!app.isRandom) {
                randomBtn.classList.add("active");
                app.isRandom = true;
            } else {
                randomBtn.classList.remove("active");
                app.isRandom = false;
            }
        };

        audio.onended = function () {
            if (!app.isRandom && !app.isRepeat) {
                app.endSong();
            } else if (app.isRandom && !app.isRepeat) {
                app.randomSong();
                audio.play();
            } else if (!app.isRandom && app.isRepeat) {
                audio.play();
            } else {
                audio.play();
            }
        };

        repeatBtn.onclick = function () {
            if (!app.isRepeat) {
                app.isRepeat = true;
                repeatBtn.classList.add("active");
            } else {
                app.isRepeat = false;
                repeatBtn.classList.remove("active");
            }
        };

        playlist.onclick = function (e) {
            const songElement = e.target.closest(".song:not(.active-song)");
            if (songElement) {
                console.log("dcm");
                app.currentIndex = songElement.dataset.index;
                app.loadCurrentSong();
                audio.play();
                app.render();
            }
        };
    },

    nextSong: function () {
        app.currentIndex++;
        if (app.currentIndex >= app.songs.length) {
            app.currentIndex = 0;
        }
        app.loadCurrentSong();
    },

    prevSong: function () {
        if (app.currentIndex == 1) {
            app.currentIndex = 0;
        } else if (app.currentIndex == 0) {
            app.currentIndex = app.songs.length - 1;
        } else {
            app.currentIndex--;
        }
        app.loadCurrentSong();
    },

    randomSong: function () {
        let index = 0;
        do {
            index = Math.floor(Math.random() * app.songs.length);
        } while (index === app.currentIndex);

        app.currentIndex = index;
        this.loadCurrentSong();
    },

    endSong: function () {
        if (app.currentIndex != app.songs.length - 1) {
            app.currentIndex += 1;
        } else {
            app.currentIndex = 0;
        }
        this.loadCurrentSong();
        audio.play();
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".active-song").scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 300);
    },

    handleEvents: function () {
        const cd = $(".cd");
        const cdWidth = cd.offsetWidth;

        document.onscroll = function () {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };
    },

    updateSongTime: function () {
        if (audio.duration) {
            const totalTIme = audio.duration;
            const x = audio.currentTime;
            let totalMinutes = Math.floor(totalTIme / 60);
            let totalSeconds = Math.floor(totalTIme % 60);
            let currentMinutes = Math.floor(x / 60);
            let currentSeconds = Math.floor(x % 60);
            curTime.textContent = `${currentMinutes}:${currentSeconds}`;
            total.textContent = `${totalMinutes}:${totalSeconds}`;
        }
    },

    start: function () {
        this.defineProperties();

        // this.handleEvents()   không gọi hàm này để cho giao diện nhìn trực quan hơn;
        this.loadCurrentSong();
        this.playSong();
        this.nextSong();
        this.prevSong();
        this.randomSong();

        this.render();
    },
};

app.start();
