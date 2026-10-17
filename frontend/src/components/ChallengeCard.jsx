import styles from "./ChallengeCard.module.css";

export default function ChallengeCard({ onClick, name, points, category, solved, solvedImg }) {
    return (
        <div onClick={onClick} className={styles.singleChallenge}>
            {solved ? ( 
                <div>
                    <img 
                        src={import.meta.env.BASE_URL + "animalsChallenges/" + solvedImg + ".png"} 
                        className={styles.img} 
                    />
                    <p className="text-[#1B529B]">✔️COMPLETED</p>
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