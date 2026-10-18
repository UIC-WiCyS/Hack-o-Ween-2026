import { Link } from 'react-router-dom';
import styles from "./Header.module.css";

export default function Header({logout}) {
    return (
        <nav className='flex gap-4 font-eater text-lg justify-around mx-8 my-8 select-none flex-wrap'>
            <Link className={styles.nav_link} to="/about">About</Link>
            <Link className={styles.nav_link} to="/">Challenges</Link>
            
            {/* title */}
            <div className='text-[#EAD3FF] text-3xl'>
                <p>Hack-o-Ween 2026</p>
            {/* <3 */}
            <div className='text-sm text-white text-center justify-self-center font-eater'>
                <p>Made with <a href="https://github.com/UIC-WiCyS/Hack-o-Ween-2026" target='_blank'>{'<3'}</a> by</p>
                <p>WiCyS & LUG</p>
            </div>
            </div>

            <Link className={styles.nav_link} to="/scoreboard">Scoreboard</Link>
            <Link className={styles.nav_link} to="/" onClick={logout}>Logout</Link>
        </nav>
    );
}