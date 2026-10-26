import { useState, useEffect } from 'react';
import styles from "./ChallengesOverview.module.css";
import ChallengeCard from "../components/ChallengeCard";
import ChallengeModal from "../components/ChallengeModal";
import { login, get_all_challenges } from "../api/firebase_manager";

export default function ChallengesOverview({session}) {
    const [challenges, setChallenges] = useState([]);
    
    const [completed, setCompleted] = useState([]);
    const [openModal, setModal] = useState(false); 
    const [selectedChallenge, setSelectedChallenge] = useState(null);

    // const fetch_challenges = async () => {
    //     var data = await get_all_challenges();
    //     if (data != null)
    //     {
    //         // update
    //         setChallenges(data);
    //     }
    // };

    useEffect(() => {    
        // check if session exists
        // fetch completed challenges
        fetch_challenges();
        setCompleted(session.completed);
    }, [session])

    const fetch_challenges = async (e) => {
        // e.preventDefault()
        // localhost:5000 is where I am running the backend concurrently
        try {
            // use this one for deployment
            // const response = await fetch(`${window.location.origin}/api/challenges`, {
            const response = await fetch(`http://localhost:5000/api/challenges`, {
                method : 'GET'
            })
            if (!response.ok) {
                throw new Error('Error in fetching challenges')
            }
            const res = await response.json()
            setChallenges(res)
            // console.log(res)
        } catch (err) {
            console.log(err)
        }
    }


    function handle_solved() {
        setModal(false);
        // refetch challenges
        fetch_challenges();
        window.location.reload(); 
    }
    

    return (
        <section className='font-eater text-white' style={{height: "75vh"}}>
            <div className={styles.header}> 
                <p className='text-left font-eater text-base'>Welcome, {session.id.toUpperCase()}</p>
                <h1 className={styles.title}>Challenges Overview</h1>
                <p className='text-right font-eater text-base'>Score: {session.score}</p>
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
                <ChallengeModal session={session} challenge={selectedChallenge} callback={handle_solved} />
            )}
        </section>
    );
}