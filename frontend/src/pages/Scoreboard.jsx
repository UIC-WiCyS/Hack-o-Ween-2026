import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from "./Scoreboard.module.css";
import { fetch_scoreboard } from '../api/firebase_manager';

export default function Scoreboard({}) {
    const [scores, setScore] = useState([])

    // fetch data
    useEffect(() => {
        // fetch scoreboard
        const fetch_scores = async () => {
            var data = await fetch_scoreboard();
            if (data != null && data.length > 0)
            {
                // update
                setScore(data);
            }
        };

        fetch_scores();
    }, []);

    return (
        <section style={{height: "75vh"}}>
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