import styles from "./About.module.css";
import aboutCard from "../assets/about_card.png";

export default function About() {

    return (
        <div className="about">
            <h1 className={styles.title}>About</h1>    
            <section className={styles.aboutBody}>

                <img src={aboutCard} className={styles.aboutCard} alt="About card" />
                
            </section>   

        </div>
        
    );
}