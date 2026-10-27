import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from "./Scoreboard.module.css";
import { fetch_scoreboard } from '../api/firebase_manager';
import corpseBrideJumpscare from '../assets/corpse_bride_jumpscare.gif';
import corpseBrideWind from '../assets/corpse_bride_wind.wav';
import Cookies from 'universal-cookie';

export default function Scoreboard({}) {
    const [scores, setScore] = useState([])
    const [showJumpscare, setShowJumpscare] = useState(false);
    const audioRef = useRef(null);
    const [name, setName] = useState("")

    const cookies = new Cookies(null, { path: '/' });
    // fetch data
    useEffect(() => {
        // fetch scoreboard
        // const fetch_scores = async () => {
        //     var data = await fetch_scoreboard();
        //     if (data != null && data.length > 0)
        //     {
        //         // update
        //         setScore(data);
        //     }
        // };

        fetch_scores();
    }, []);

    // jumpscare on page load
    useEffect(() => {
        if (cookies.get("jumpscares_cookie") == true) {
            setShowJumpscare(true);
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => {});
            }
            const timer = setTimeout(() => setShowJumpscare(false), 700);
            return () => clearTimeout(timer);
        }
    }, []);

    // attempting live scoreboard TODO later
    // useEffect(() => {
    //     var source = new EventSource(`http://localhost:5000/api/scoreboard`);
    //     source.addEventListener(
    //     "customer",
    //     function(event) {
    //         var data = JSON.parse(event.data);
    //         setName(data[0].name);
    //     },
    //     false
    //     );
    //     source.addEventListener(
    //     "error",
    //     function(event) {
    //         console.log(event);
    //     },
    //     false
    //     );
    // }, []);
    
    const fetch_scores = async (e) => {
        // e.preventDefault()
        // localhost:5000 is where backend is running concurrently
        try {
            // use this one for deployment
            const response = await fetch(`${window.location.origin}/api/scoreboard`, {
            // const response = await fetch(`http://localhost:5000/api/scoreboard`, {
                method : 'GET'
            })
            if (!response.ok) {
                throw new Error('Error in fetching scoreboard')
            }
            const res = await response.json()
            setScore(res)
            // console.log(res)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <section style={{height: "75vh"}}>
            { cookies.get("jumpscares_cookie") == true &&
                <audio ref={audioRef} src={corpseBrideWind} />
            }
            {showJumpscare && (
                <img src={corpseBrideJumpscare} className={styles.jumpscare} alt="" />
            )}

            <h1 className={styles.title}>Scoreboard</h1>

            <div className={styles.leaderboard}>
                {scores && scores.map((entry, index) => (
                    <div key={index} className={styles.scoreEntry}>
                        <span className={styles.username}>{entry.id}</span>
                        <span className={styles.points}>{entry.score}</span>
                    </div>
                ))}
            </div>

            {scores.length === 0 && (
                <p className={styles.noScores}>No scores yet. Complete challenges to appear on the leaderboard!</p>
            )}

        </section>
    );
}