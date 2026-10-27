import { useState, useEffect } from 'react';
import styles from "./ChallengesOverview.module.css";
import ChallengeCard from "../components/ChallengeCard";
import ChallengeModal from "../components/ChallengeModal";
import { login, get_all_challenges } from "../api/firebase_manager";
export default function ChallengesOverview({session}) {
    const [challenges, setChallenges] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [jumpscares, setJumpscares] = useState(false)
    const [openModal, setModal] = useState(false); 
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const numChallenges = challenges.length;

    const fetch_challenges = async () => {
        var data = await get_all_challenges();
        if (data != null)
        {
            // update
            setChallenges(data);
        }
    };

    const totalPoints = challenges.reduce((sum, challenge) => {
    return sum + Number(challenge.points);
    }, 0);

    
    let status;  
    if (session.score <= totalPoints*0.10) {
        /* for <=10% */
        status = "Dead 👻";
    } else if (session.score <= totalPoints*0.30) {
         /* for  > 10% <=30% */
        status = "Fatal";
    } else if (session.score <= totalPoints*0.50) {
        /* for  > 30% <=50% */
        status = "Critical";
    } else if (session.score <= totalPoints*0.65) {
        /* for  > 50% <=65% */
        status = "Hurt";
    }else if (session.score <= totalPoints *.80) {
        /* for  > 65% <=80% */
        status = "Ouchie";
    }else { 
        /* for > 80% <=90%+ */
        status = "Alive";
    }

    useEffect(() => {    
        // check if session exists
        // fetch completed challenges
        fetch_challenges();
        setCompleted(session.completed);
    }, [session])

    function handle_solved() {
        setModal(false);
        // refetch challenges
        fetch_challenges();
        window.location.reload(); 
    }
    

    return (
        <section className='font-eater text-white' style={{height: "75vh"}}>
            {/*<h1 className={styles.title}>Challenges Overview</h1>*/}
            <div className={styles.header}> 
                <div className='text-left font-eater text-base'>
                    <p>Player: {session.id.toUpperCase()}</p>
                    <p>Sanity: {session.score}</p>
                </div>
                <div className='text-right font-eater text-base'>
                    <p>Status: {status}</p>
                    <button className={`${styles.toggle} ${jumpscares ? styles.toggleON:""}`} 
                    
                    onClick={()=> setJumpscares(!jumpscares)} >
                    
                    Jump Scares: {jumpscares ? "ON" : "OFF"}</button>
                </div>
            </div>
            
            <div className={styles.challengeMap}> 
                {challenges && completed && challenges.map((challenge, i) => (
                    <ChallengeCard key={challenge.id} name={challenge.name} points={challenge.points} category={challenge.category} 
                    solved={completed.some(id => String(id) === String(challenge.id))} solvedImg={`img${i}`}  
                    
                    onClick={() => {
                        setSelectedChallenge(challenge);
                        setModal(true);
                    }}
                
                    />
            
                ))}
            </div>
            
            {/*check the boolean state && check there is a selected challenge && get the challenge*/}
            {openModal && selectedChallenge && (
                <ChallengeModal session={session} challenge={selectedChallenge} callback={handle_solved} jumpscaresEnabled={jumpscares} />
            )}
        </section>
    );
}