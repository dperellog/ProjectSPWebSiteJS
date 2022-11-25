'use strict';
//Mòdul del rellotge:

import { AnalogClock } from "../../node_modules/analog-clock/clock.js";

export {
    analogClock,
    digitalClock
}

//Reotrna un element amb el rellotge analògic.
const analogClock = () => {
    let clock = new AnalogClock();
    clock.offset = 1;
    return clock;
}

//Actualitza el rellotge digital cada X (freq) temps.
const digitalClock = (digitalClock, freq) => {
    let hora = new Date()
    digitalClock.innerText = hora.toLocaleTimeString();;

    setInterval(() => {
        hora = new Date()
        digitalClock.innerText = hora.toLocaleTimeString();
    }, freq);
}