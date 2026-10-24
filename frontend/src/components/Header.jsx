import { Link } from 'react-router-dom';
import styles from "./Header.module.css";

export default function Header({logout}) {
    return (
        <nav className='flex gap-4 fixed top-0 left-0 w-full font-eater text-lg justify-around px-8 pt-4 mb-8 select-none flex-wrap bg-[#001E1E]'>
            <Link className={styles.nav_link} to="/about">About</Link>
            <Link className={styles.nav_link} to="/">Challenges</Link>
            
            {/* title */}
            <div className='text-[#82AFAB] text-3xl'>
                <p>Hack-o-Ween 2026</p>
            {/* <3 */}
            <div className='text-xs my-1 text-[#CFB25A] text-center justify-self-center font-eater'>
                <p>Made with <a href="https://github.com/UIC-WiCyS/Hack-o-Ween-2026" target='_blank'>{'<3'}</a> by WiCyS & LUG</p>
            </div>
            </div>

            <Link className={styles.nav_link} to="/scoreboard">Scoreboard</Link>
            <Link className={styles.nav_link} to="/" onClick={logout}>Logout</Link>
        </nav>
    );
}