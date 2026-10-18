import { useState, useEffect } from 'react';
import styles from "./ChallengeModal.module.css";
import { check_answer } from '../api/firebase_manager';
import { Download } from 'lucide-react';
import Hint from "./Hint"
import StickyNote from "../assets/sticky_note.png";

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
        <div id="challenge-modal" className={`absolute w-2/3 z-1000 top-0 left-1/6 h-full text-center text-black font-eater'`} >
            {/* sticky note background */}
            <img src={StickyNote} className='absolute z-998' style={{width: "100%", height:"100%", objectFit: "contain"}} />
            
            <div className='relative z-999 p-6 px-10 flex flex-col gap-4 w-5/8 top-1/7 mx-auto h-3/4 overflow-y-scroll'
                style={{scrollbarColor: "#4A807B #ffffff00", }}>
                <div className='flex justify-end flex-wrap-reverse text-wrap'>
                    <div className='font-eater text-right text-xl self-end justify-self-end'>
                        <p className='font-bold'>{challenge.name.toUpperCase()}</p>
                        <p className='font-eater text-[#1D4440]'>{challenge.points} || {challenge.category} points</p>
                    </div>
                    
                    <button onClick={()=>{callback(false)}}>
                        <p className='absolute top-4 right-4 text-3xl cursor-pointer hover:scale-105 text-[#4A807B]' style={{lineHeight: '0.5'}}>x</p>
                    </button>
                </div>

                <hr />

                {/* dynamically grab prompt and its tags */}
                <div className="text-base font-doppio mt-8" dangerouslySetInnerHTML={{ __html: challenge.prompt }} />

                {/* files */}
                { challenge.files && challenge.files.length !== 0 && 
                    <div>
                        <p className='text-left underline text-lg text-[#1D4440]'>Files:</p>
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
                    <div className="py-4"> 
                        <p className='text-left underline text-lg text-[#1D4440]'>Hints:</p>
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
                        <button onClick={handle_answer_check} className='bg-[#1D4440] text-[#CFB25A] px-8 border-solid border-2 rounded-sm border-black cursor-pointer hover:scale-105'>
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
        </div>
    );
}