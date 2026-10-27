import { useState, useEffect, useRef } from "react";
import styles from "./About.module.css";
import aboutCard from "../assets/about_card.png";
import chicaJumpscare from "../assets/chica_jumpscare.gif";
import chicaSound from "../assets/chica_sound.wav";
import Cookies from 'universal-cookie';

export default function About() {
    const [showJumpscare, setShowJumpscare] = useState(false);
    const audioRef = useRef(null);
    const cookies = new Cookies(null, { path: '/' });

    useEffect(() => {
        if (cookies.get("jumpscares_cookie") == false)
            return;

        // yes jumpscares!
        setShowJumpscare(true);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
        }
        const timer = setTimeout(() => setShowJumpscare(false), 700);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="about">
            <audio ref={audioRef} src={chicaSound} />

            {showJumpscare && (
                <img src={chicaJumpscare} className={styles.jumpscare} alt="" />
            )}

            <h1 className={styles.title}>About</h1>
            <section className={styles.aboutBody}>
                <img src={aboutCard} className={`${styles.aboutCard} hover:-rotate-5 hover:scale-105`} alt="About card" />
            </section>
        </div>
    );
}