/* WebChucK Lite Demo Code */
global int MY_INT;
global float MY_FLOAT;

SinOsc osc => ADSR e => Pan2 p => dac;
440 => osc.freq;

// adsr envelope
e.set(10::ms, 8::ms, .5, 500::ms);

while (true) {
    // Pan the sound using global float
    (MY_FLOAT * 2) - 2 => p.pan;
    // Change oscillator frequency using glaob int
    Math.random2(0, 11) => MY_INT;

    <<< "WebChucK INT:", MY_INT >>>;
    <<< "WebChucK FLOAT:", MY_FLOAT >>>;

    Std.mtof(60 + MY_INT) => osc.freq;

    e.keyOn();
    100::ms => now;
    e.keyOff();
    400::ms => now;
}
