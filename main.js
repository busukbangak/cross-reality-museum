const audio = ['intro-audio', 'bone1-audio', 'bone2-audio', 'bone3-audio', 'bone4-audio', 'bone-all-audio'];

let collectedBonesCounter = 0;

//memorize value from collectedBonesCounter
let previousBonesCounterValue;

//sound manager
let isAudioPlaying = false;

let speakInterval;

AFRAME.registerComponent("cursor-status", {
    init: function() {
        this.el.addEventListener("click", evt => {
            this.el.setAttribute("material", "color: coral");
        });

        this.el.addEventListener("fusing", evt => {
            this.el.setAttribute("material", "color: coral");
        });

        this.el.addEventListener("mouseleave", evt => {
            this.el.setAttribute("material", "color: slategrey");
        });
    }
});

AFRAME.registerComponent("waypoint", {
    init: function() {
        this.el.addEventListener("click", evt => {
            const { x, y, z } = evt.target.components.position.data;
            document.getElementById("player").setAttribute('animation', { property: 'position', to: `${x} 2.5 ${z}`, dur: '2500' });
        });
    }
});

AFRAME.registerComponent("start-quest", {
    init: function() {



        this.el.addEventListener("click", evt => {


            document.getElementById('listen-audio').components.sound.stopSound();
            document.getElementById('whale-chest-model').setAttribute('visible', true);
            document.getElementById('whale-chest-model').classList.add("clickable");
            document.getElementById('whale-backbone-model').setAttribute('visible', true);
            document.getElementById('whale-backbone-model').classList.add("clickable");
            document.getElementById('whale-left-fin-model').setAttribute('visible', true);
            document.getElementById('whale-left-fin-model').classList.add("clickable");
            document.getElementById('whale-right-fin-model').setAttribute('visible', true);
            document.getElementById('whale-right-fin-model').classList.add("clickable");
            document.getElementById('whale-flipper-model').setAttribute('visible', true);
            document.getElementById('whale-flipper-model').classList.add("clickable");

            document.getElementById('whale-head-model').classList.remove("clickable");
            document.getElementById('whale-upperjaw-model').classList.remove("clickable");
            document.getElementById('whale-underjaw-model').classList.remove("clickable");
        });
    }
});

AFRAME.registerComponent("whale", {
    init: function() {
        this.el.addEventListener("click", evt => {

            //only one audio is playing at the time
            if (!isAudioPlaying) {

                speakInterval = setInterval(function() {
                    document.getElementById('whale-underjaw-model').setAttribute('animation', { property: 'rotation', to: `${-Math.floor(Math.random() * 10)} ${0} ${0}`, dur: '500' });
                }, 500);

                isAudioPlaying = true;

                //memorize
                previousBonesCounterValue = collectedBonesCounter;
                // if finished next audio can play
                document.getElementById(audio[collectedBonesCounter]).addEventListener("sound-ended", evt => {
                    isAudioPlaying = false;
                    clearInterval(speakInterval);
                });

                // play audio
                document.getElementById(audio[collectedBonesCounter]).components.sound.playSound();

                //bone is getting replaced
                const kk = evt.target.getAttribute("xid");
                if (kk > 0) {
                    evt.target.setAttribute('animation', { property: 'position', to: `-2 7 2}`, dur: '2500' });
                }
                // don't talk or move twice
                evt.target.classList.remove("clickable");
                // add found bone
                collectedBonesCounter++;

            } else { // if audio is still playing and the next bone was already found
                document.getElementById(audio[previousBonesCounterValue]).addEventListener("sound-ended", evt => {
                    // recursive
                    this.el.click();
                });
            }

        });
    }
});