import { useState } from 'react';
import styles from "./Login.module.css";
import { login } from "../api/firebase_manager";
import StartButton from "../assets/start_button.png"
import WICYSLogo from "../assets/wicys_logo.webp"
import WICSLogo from "../assets/wics_logo.png"
import Hearts from "../assets/hearts.png"

export default function Login({callback}) {
    const [input, setInput] = useState("");

    async function handle_login(event) {
        event.preventDefault();

        if (event != "")
            callback(input);
    }

    return (
        <section className="select-none font-pixel text-6xl text-center flex flex-col justify-center items-center">
            <div className='flex fixed left-8 top-8'>
                <img src={Hearts} style={{height: '3rem', width: 'auto', objectFit: "contain"}}/>
            </div>
            
            <div className='text-[#EAD3FF] text-7xl'>
                <h1 className={styles.glitch} data-text="WITW">WITW</h1>
                <h1 className={styles.glitch} data-text="CTF">CTF</h1>
            </div>
            
            <div className='mt-8 bg-[#EAD3FF] border-[#812990] border-6 p-8 px-24 text-[#812990] text-center'>
                <p className='text-center text-3xl'>
                    Hack-o-Ween
                </p>

                <form onSubmit={handle_login} className="font-pixel text-[#812990] bg-[#CFEFEF] border-6 p-2 text-3xl text-center">
                    <input id={styles.login} onChange={e => setInput(e.target.value)} required placeholder="Enter Your Username"/>
                </form>

                <p className='absolute justify-self-center my-8'>&</p>
                    
                {/* logos */}
                <div className='flex gap-16 justify-around mt-8'>
                    <img src={WICYSLogo} style={{height: '6rem', width: 'auto', objectFit: "contain"}} />
                    <img src={WICSLogo}  style={{height: '6rem', width: 'auto', objectFit: "contain"}} className='mx-4 justify-self-end' />

                </div>

            </div>
            
            <button className='cursor-pointer' onClick={handle_login}>
                <img src={StartButton} style={{maxWidth: '150px'}}/>
            </button>

            {/* <3 */}
            <div className='absolute text-lg text-white justify-self-end bottom-0'>
                <p>Made with <a href="https://github.com/UIC-WiCyS/Hack-o-Ween-2026" target='_blank'>{'<3'}</a> by</p>
                <p>WiCyS & WiCS</p>
            </div>
        </section>
    );
}