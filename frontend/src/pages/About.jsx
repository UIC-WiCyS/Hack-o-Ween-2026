import { useState, useEffect } from "react";
import styles from "./About.module.css";
import aboutCard from "../assets/about_card.png";
import chicaJumpscare from "../assets/chica_jumpscare.gif";

export default function About() {
    const [showJumpscare, setShowJumpscare] = useState(false);

    useEffect(() => {
        setShowJumpscare(true);
        const timer = setTimeout(() => setShowJumpscare(false), 700);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="about">
            {showJumpscare && (
                <img src={chicaJumpscare} className={styles.jumpscare} alt="" />
            )}

            <h1 className={styles.title}>About</h1>
            <section className={styles.aboutBody}>
                <img src={aboutCard} className={styles.aboutCard} alt="About card" />
            </section>
        </div>
    );
}