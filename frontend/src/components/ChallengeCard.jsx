import styles from "./ChallengeCard.module.css";
import X from "../assets/solved.png"

export default function ChallengeCard({ onClick, name, points, category, solved, solvedImg }) {
    return (
        <div onClick={() => {onClick();}} className={styles.singleChallenge}>

            {solved ? ( 
                <div>
                    <img
                        src={X}
                        className={styles.img}
                    />
                </div>

            ) : (
                <>
                    <h1 className={styles.name}>{name}</h1>
                    <h1 className={styles.points}>{points} points</h1>
                    <h1 className={styles.category}>{category}</h1>
                </>
            )}
        </div>
    )
}