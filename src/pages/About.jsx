import styles from "./About.module.css";
import heart from "../assets/heart.png";
import wicysLogo from "../assets/wicys_logo.webp";
import wicsLogo from "../assets/wics_logo.png";

export default function About() {

    return (
        <div className="about">
            <h1 className={styles.title}>About</h1>    
            <section className={styles.aboutBody}>



                <div className={styles.wicysHeart}>
                    <img src={wicysLogo} className={styles.wicys}/>
                    <img src={heart} className={styles.heart}/>
                </div>

                <div className={styles.wicsHeart}>
                    <img src={wicsLogo} className={styles.wics}/>
                    <img src={heart} className={styles.heart}/>
                </div>


                

                <h1 className={styles.question}>About</h1>
                <p className={styles.answer}>
                  Hello world!
                </p> 
                <br />
                <a className={styles.cyberpackLink} href="" target="_blank">💜Cyberpack🩶</a>
            </section>
        
            

        </div>
        
    );
}