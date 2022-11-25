import { AnalogClock } from "../../node_modules/analog-clock/clock.js";

export{
    analogClock,
    digitalClock
}


const analogClock = () => {
    let clock = new AnalogClock();
    clock.offset = 1;
    return clock;
}

const digitalClock = (digitalClock, freq) => {
    let hora = new Date()
    digitalClock.innerText = hora.toLocaleTimeString();;

    setInterval(() => {
        hora = new Date()
        digitalClock.innerText = hora.toLocaleTimeString();
    }, freq);
}