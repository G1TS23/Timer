<template>
    <div class="timer">
        <div class="timer-view input-timer" v-show="isReset">
            <input type="text" class="hours" v-model="hours" @keyup.enter="startTimer()">:
            <input type="text" class="minutes" v-model="minutes" @input="maxOutMin()" @keyup.enter="startTimer()">:
            <input type="text" class="seconds" v-model="seconds" @input="maxOutSec()" @keyup.enter="startTimer()">
        </div>

        <div class="timer-view display-timer" v-show="!isReset">
            
            <div style=" display : inline-block">
                {{  returnTimerDisplay() }}
                </div>
            <span class="bell" v-show="!isPlaying">
                <i class="fa-solid fa-bell"></i>
                {{ returnEstimatedEndPause() }}
            </span>
            <span class="bell active" v-show="isPlaying">
                <i class="fa-solid fa-bell"></i> 
                {{ returnEstimatedEnd() }}
            </span>
        </div>
        
        
        <div class="timer-bar">
            <div class="shadow bar">
                <div class="bar" v-bind:style="{width: `${widthBar}%`}"></div>
            </div>
        </div>

        <div class="timer-buttons">
            <p class="cancel btn" @click="resetTimer()" :class="{ active : !isReset}">Annuler</p>
            <p v-show="!isPlaying && isReset" class="play btn" @click="newStartTimer()" :class="{ pointer : hours + minutes + seconds > 0 }">Démarrer</p>
            <p v-show="!isPlaying && !isReset" class="resume btn" @click="newStartTimer()">Reprendre</p>
            <p v-show="isPlaying" class="play btn pause" @click="pauseTimer()">Pause</p>

        </div>

        
    </div>
</template>



<script>
import moment from 'moment';

export default {
    data() {
        return{
            seconds: 0,
            minutes: 0,
            hours: 0,
            hoursNow: 0,
            minutesNow: 0,
            secondesNow: 0,
            milliNow: 0,
            totalSeconds: 0,
            totalTime: 0,
            widthBar: 100,
            intervalGap: 0,
            intervalId: 0,
            timerDisplay: String,
            isPlaying: false,
            isReset: true,
            startMilli: 0,
            newMilli: 0
        }
    },created(){
        this.totalTime = this.seconds + this.minutes * 60 + this.hours * 3600;
        this.totalSeconds = this.totalTime;
        const interval = setInterval(() => {
                const now = new Date();
                this.hoursNow = now.getHours();        
                this.minutesNow = now.getMinutes();
                this.secondesNow = now.getSeconds()
                this.milliNow = now.getMilliseconds();
            }, 1000);
    },
    methods: {
        startTimer(){
            if(this.seconds > 0 || this.minutes > 0 || this.hours > 0)
            {
            this.isPlaying = true;
            if(this.isReset){
                this.calculateIntervalGap();
            }
            this.intervalId = setInterval(() => {
                this.decrementWidthGap();
            },10);}
        },
        newStartTimer(){
            this.startMilli = new Date().getMilliseconds();

            if(this.seconds > 0 || this.minutes > 0 || this.hours > 0)
            {
            this.isPlaying = true;
            if(this.isReset){
                this.calculateIntervalGap();
            }

            this.intervalId = setInterval(() => {
                this.newDecrementWidthGap();
                this.startMilli = this.newMilli;
            },10);}

        },
        newDecrementWidthGap(){
            this.newMilli = new Date().getMilliseconds();
            let delta = this.newMilli - this.startMilli;
            if (delta < 0){
                delta = delta + 1000;
            }
            
            if(this.widthBar !== 0){
                if(this.widthBar - this.intervalGap < 0){
                    this.widthBar = 0;
                } else {
                    this.totalSeconds = this.totalSeconds - ((delta)/1000);
                    
                    this.widthBar = parseFloat(
                        (this.widthBar - 
                        ((this.intervalGap / 10) * (delta))).toFixed(2)
                    );
                }
            } else {
                this.resetTimer();
            };
        },
        decrementWidthGap(){
            this.totalSeconds = this.totalSeconds - .01;
                if(this.widthBar !== 0){
                    if(this.widthBar - this.intervalGap < 0){
                        this.widthBar = 0;
                        clearInterval(this.intervalId);
                    } else this.widthBar = parseFloat((this.widthBar - this.intervalGap).toFixed(2));
                } else {
                    this.resetTimer();
                };
        },
        calculateIntervalGap(){
            this.totalTime = this.seconds + this.minutes * 60 + this.hours * 3600;
            this.totalSeconds = this.totalTime;

            this.intervalGap = (this.widthBar / this.totalSeconds) / 100;
            this.isReset = false;
        },
        resetTimer(){
            if(!this.isReset){
            clearInterval(this.intervalId);
            this.isPlaying = false;
            this.isReset = true;
            this.widthBar = 100;
            }
        },
        pauseTimer(){
            clearInterval(this.intervalId);
            this.isPlaying = false; 
        },
        maxOutSec(){
            this.seconds = this.seconds % 60;
        },
        maxOutMin(){
            this.minutes = this.minutes % 60;
        },
        returnTimerDisplay(){
            const hours = Math.floor((this.totalSeconds / 3600));
            const minutes = Math.floor((this.totalSeconds / 60)) % 60;
            const seconds = Math.floor(this.totalSeconds % 60);

            let hoursString = `${hours}:`;
            let minutesString = `${minutes}:`;
            let secondsString = `${seconds}`;
            

            if (hours < 1){
                hoursString = '';
            }

            if (minutes < 10 && hours > 0){
                minutesString = `0${minutesString}`;
            }
                

            if (seconds < 10 ){
                secondsString = `0${secondsString}`;
            }

            return `${hoursString}${minutesString}${secondsString}`;
        },
        returnEstimatedEnd(){

            const totalSec = this.totalTime;
            
            let hours = new Date().getHours() + Math.floor(totalSec / 3600);     
            let minutes = new Date().getMinutes() + (Math.floor(totalSec/60) % 60);

            if (minutes > 60){
                hours += Math.floor(minutes/60);             
            }

            minutes = minutes % 60;
            hours = hours % 24;

            if (hours < 10){
                hours = `0${hours}`;
            }

            if (minutes < 10){
                minutes = `0${minutes}`;
            }
                

            return `${hours}:${minutes}`;
        },
        returnEstimatedEndPause(){

            const totalSec = this.totalSeconds;

            let hours = this.hoursNow + Math.floor(totalSec / 3600);        
            let minutes = this.minutesNow + (Math.floor(totalSec/60) % 60);
            let seconds = this.secondesNow + Math.floor(totalSec) % 60;

            if (seconds > 60){
                minutes += Math.floor(seconds/60);
            }

            if (minutes > 60){
                hours += Math.floor(minutes/60);             
            }

            minutes = minutes % 60;
            hours = hours % 24;

            if (hours < 10){
                hours = `0${hours}`;
            }

            if (minutes < 10){
                minutes = `0${minutes}`;
            }

            return `${hours}:${minutes}`;
        }
    }
}

</script>

<style scoped>

.timer{
    --bright-color: rgb(0, 238, 255);
    --bgColor: rgb(81, 77, 129);
    --shadowColor: rgb(42, 39, 78);
    font-family: Inter, monospace, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 300px;
    height: 300px;
    background-color: var(--bgColor);
    border-radius: 10px;
    box-shadow: 0 0 .7rem rgb(0, 0, 0, .3);
    overflow: hidden;
}

.timer-view{
    padding-top: 2rem;
    font-family: Roboto Mono, monospace;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40%;
    gap: .5rem;
    color: white;
}

.display-timer{
    flex-direction: column;
    gap: .1rem;
    font-size: 3.2rem;
    font-weight: 200;
}

.bell{
    font-size: 1rem;
    padding-top: .2rem;
    opacity: .4;
}

.hours, .minutes, .seconds{
    border: 1px solid white;
    background-color: var(--shadowColor);
    border-radius: 4px;
    width: 15%;
    aspect-ratio: 1;
    text-align: center;
    font-size: 1.5rem;
    color: white;
}


.timer-buttons{
    display: flex;
    align-items: start;
    justify-content: space-around;
    width: 100%;
    height: 35%;
}

.btn{
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    height: 50%;
    aspect-ratio: 1.5;
    border-radius: .5rem;
    font-size: 1rem;
    padding: 0;
}

.cancel{
    background-color: grey;
    font-size: .8rem;
    opacity: .8;
    cursor: initial;
}

.play{
    color: var(--bgColor);
    background-color: rgb(173, 255, 47);
    font-size: .8rem;
}

.pointer{
    cursor: pointer;
}

.resume{
    color: var(--bgColor);
    background-color: rgba(173, 255, 47, 0.3);
    color: rgb(173, 255, 47);
    font-size: .8rem;
    cursor: pointer;
}

.pause{
    background-color: var(--bright-color);
    cursor: pointer;
}

.active{
    color: white;
    opacity: 1;
    cursor: pointer;
}

.timer-bar{
    display: flex;
    align-items: center;
    justify-content: left;
    width: 100%;
    height: 25%;
}

.bar{
    margin: 0;
    width: 100%;
    height: .3rem;
    border-radius: 5rem;
    background-color: var(--bright-color);
}

.shadow{
    width: 100%;
    margin: 0 2rem;
    background-color: black;
}


</style>