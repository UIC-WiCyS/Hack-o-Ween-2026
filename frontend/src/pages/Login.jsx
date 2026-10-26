import { useState } from 'react';
import styles from "./Login.module.css";
import { login } from "../api/firebase_manager";
import Swirl from "../assets/login_swirl.png"
import StickyNote from "../assets/sticky_note.png"
import WICYSLogo from "../assets/wicys_logo.png"
import LUGLogo from "../assets/lug_logo.png"
import FazzBear from "../assets/fazzbear.gif"

export default function Login({callback}) {
    const [input, setInput] = useState("");
    const [jumpscares, setJumpscares] = useState(null);
    const [showNote, setShowNote] = useState(false);
    const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
    const [scaring, setScaring] = useState(false);

    function handle_login(event) {
        event.preventDefault();

        if (input.trim() !== "")
            setShowNote(true);
    }

    function handle_choice(choice) {
        setJumpscares(choice);

        if (!choice) {
            callback(input, choice);
            return;
        }

        setScaring(true);
        play_scream();
        setTimeout(() => callback(input, choice), 2000);
    }

    // Synthesized scare sound so no audio file is needed. Clicking Yes counts as the user gesture browsers require.
    function play_scream() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const now = ctx.currentTime;
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.6, now);
        master.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
        master.connect(ctx.destination);

        // Sudden noise burst for the jolt
        const noise = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
        const data = noise.getChannelData(0);
        for (let i = 0; i < data.length; i++)
            data[i] = Math.random() * 2 - 1;
        const burst = ctx.createBufferSource();
        burst.buffer = noise;
        burst.connect(master);
        burst.start(now);

        // Two detuned sawtooths sliding up and down, dissonant and wobbling
        // (a wobbling LFO on the pitch)
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 7;
        lfoGain.gain.value = 30;
        lfo.connect(lfoGain);
        lfo.start(now);
        lfo.stop(now + 2.5);

        [0, 13].forEach(detune => {
            const osc = ctx.createOscillator();
            osc.type = "sawtooth";
            osc.detune.value = detune * 10;
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(900, now + 0.6);
            osc.frequency.exponentialRampToValueAtTime(120, now + 2.5);
            lfoGain.connect(osc.frequency);
            osc.connect(master);
            osc.start(now);
            osc.stop(now + 2.5);
        });

        // Low sub-bass rumble underneath
        const sub = ctx.createOscillator();
        sub.type = "sine";
        sub.frequency.setValueAtTime(55, now);
        sub.frequency.exponentialRampToValueAtTime(35, now + 2.5);
        sub.connect(master);
        sub.start(now);
        sub.stop(now + 2.5);
    }

    // Only dodges for a mouse, so touch users can still tap it.
    function dodge_no(event) {
        if (event.pointerType !== "mouse")
            return;

        setNoOffset({
            x: Math.round((Math.random() * 2 - 1) * 120),
            y: Math.round((Math.random() * 2 - 1) * 50),
        });
    }

    return (
        <section className={`select-none font-eater ${styles.page}`}>
            <div className={styles.title}>
                <img src={Swirl} className={styles.swirl} alt="" />
                <h1>HACK-O-WEEN</h1>
                <p>By WiCyS x LUG</p>
                <img src={Swirl} className={styles.swirl} alt="" />
            </div>

            <form onSubmit={handle_login} className={styles.form}>
                <input
                    className={styles.username}
                    onChange={e => setInput(e.target.value)}
                    required
                    placeholder=">TYPE USERNAME<"
                />
                <button type="submit" className={styles.play}>
                    &gt;PLAY&lt;
                </button>
            </form>

            {showNote && (
                <div className={styles.overlay}>
                    <div className={styles.note}>
                        <img src={StickyNote} className={styles.noteImage} alt="" />
                        <div className={styles.noteContent}>
                            <h2 className={styles.warning}>WARNING!</h2>
                            <p className={styles.question}>Are you okay<br/>with jumpscares?</p>
                            <p className={styles.disclaimer}>
                                ** Selecting Yes enables jump scares, which may include sudden pop-ups, flashing visuals, and loud sounds.
                            </p>
                            <div className={styles.choices}>
                                <button type="button" onClick={() => handle_choice(false)}
                                    onPointerEnter={dodge_no}
                                    style={{ transform: `translate(${noOffset.x}px, ${noOffset.y}px)` }}
                                    className={`${styles.choice} ${styles.choiceNo} ${jumpscares === false ? styles.selected : ""}`}>
                                    No :(
                                </button>
                                <button type="button" onClick={() => handle_choice(true)}
                                    className={`${styles.choice} ${styles.choiceYes} ${jumpscares === true ? styles.selected : ""}`}>
                                    Yes :D
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {scaring && (
                <div className={styles.scare}>
                    <img src={FazzBear} alt="" />
                </div>
            )}

            <div className={styles.logos}>
                <img src={WICYSLogo} alt="WiCyS" />
                <img src={LUGLogo} className={styles.lugLogo} alt="LUG" />
            </div>
        </section>
    );
}
