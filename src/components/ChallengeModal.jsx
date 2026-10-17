import { useState, useEffect } from 'react';
import styles from "./ChallengeModal.module.css";
import { check_answer } from '../api/firebase_manager';
import { Download } from 'lucide-react';
import Hint from "./Hint"

export default function ChallengeModal({session, challenge, callback}) {
    const [userInput, setInput] = useState("");
    const [isCorrect, setModal] = useState("default");

    useEffect(() => {
        // handling esc key press
        const handleEsc = (event) => {
        if (event.key === 'Escape') {
            // close modal
            callback(false)
        }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);
    
    async function handle_answer_check(event) { 
        event.preventDefault(); 
        // if empty
        if (!userInput) {
            // console.log("User input is empty! Input something!")
            setModal("empty");
            return;
        }

        var success = await check_answer(session.id, challenge.id, userInput);
        if (success)
        {
            setModal("success")
            setTimeout(() => {
                setModal("")
                callback(false)
            }, 1500); 
        }
        else
        {
            setModal("fail")
            document.getElementById("challenge-modal").classList.add(styles.shakey);
            // shaking animation
            setTimeout(() => {
                document.getElementById("challenge-modal").classList.remove(styles.shakey);
                setModal("")
            }, 3000); 
        }
    }

    return (
        <div id="challenge-modal" className={`absolute w-3/4 z-1000 top-1/8 left-1/8 h-3/4 overflow-y-scroll text-center bg-[#EAD3FF] border-[#812990] border-4 text-[#812990] font-pixel p-6 px-10 flex flex-col gap-4'`} 
            style={{scrollbarColor: "#1B529B #ffffff00", }}>
            <div className='flex justify-between flex-wrap-reverse text-wrap'>
                <div className='font-sync text-left text-2xl'>
                    <p className='font-bold'>{challenge.name.toUpperCase()}</p>
                    <p className='font-pixel text-[#123B79]'>{challenge.category} || {challenge.points} points</p>
                </div>
                   
                <button onClick={()=>{callback(false)}}>
                    <p className='text-6xl cursor-pointer hover:scale-105' style={{lineHeight: '0.5'}}>x</p>
                </button>
            </div>

            <hr />

            {/* dynamically grab prompt and its tags */}
            <div className="text-xl" dangerouslySetInnerHTML={{ __html: challenge.prompt }} />

            {/* files */}
            { challenge.files && challenge.files.length !== 0 && 
                <div>
                    <p className='text-left underline text-xl text-[#1B529B]'>Files:</p>
                    <div id="files-list" className='flex gap-16'>
                    {
                        challenge.files.map((file_path, i)=>(
                            <a className={styles.files_download} key={i} href={import.meta.env.BASE_URL + "challenges/" + file_path} download={file_path}>
                                <Download size={20}/>
                                {file_path}
                            </a>
                        ))
                    }
                    </div>
                </div>
            }

                
            {/* buttons for hints */}
            {
                challenge.hints && challenge.hints.length !== 0 &&
                <div>   
                    <p className='text-left underline text-xl text-[#1B529B]'>Hints:</p>
                    <div className='flex flex-col gap-3'>
                    {
                        challenge.hints.map((hint, i)=>(
                            <Hint hint={hint} ind={i} key={`chal_${challenge.id}_${i}`} />
                        ))
                    }
                    </div>
                </div>
            }

            <form onSubmit={handle_answer_check}>
                <div className='flex gap-2 justify-center mt-4'>
                    <input id={styles.user_flame} onChange={e => setInput(e.target.value)} placeholder="flame{...}"/>
                    <button onClick={handle_answer_check} className='bg-[#812990] text-[#B1D34A] px-4 cursor-pointer hover:scale-105'>
                        SUBMIT
                    </button>
                </div>
                {
                    isCorrect=="empty" &&
                    <p className='text-red-600'>Find the flag!</p>
                }
                {
                    isCorrect=="success" &&
                    <p className='text-green-600'>Correct!</p>
                }
                {
                    isCorrect=="fail" &&
                    <p className='text-red-600'>Incorrect!</p>
                }
            </form>
        </div>
    );
}