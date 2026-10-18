import { Link } from 'react-router-dom';
import heart from "../assets/heart.png";

export default function NotFound() {
    return (
        <section className="flex flex-col items-center justify-center h-[100vh] font-eater gap-3 text-white">
            <h1 className="text-8xl font-eater">404</h1>
            <h1 className="text-8xl font-eater">Not Found.</h1>
            <h3>You found a secret! Here, have a cookie 🍪</h3>
            <h3>Log in to view the challenges</h3>
            <h3>Head back to home: </h3>
            <div style={{height:'2rem'}}/>
            <Link to="/" className="relative w-3/4">
                <p className="z-100 underline absolute top-0 left-1/2 text-2xl" style={{transform: "translate(-50%, -50%)"}}>HOME</p>
                <img className="absolute top-3/4 left-1/2 z-0" style={{transform: "translate(-50%, -50%)", height: '12rem', width: 'auto', objectFit: "contain"}} src={heart} />
            </Link>

            {/* <3 */}
            <div className='absolute bottom-0 text-lg text-white text-center justify-self-center font-eater'>
                <p>Made with <a href="https://github.com/UIC-WiCyS/Hack-o-Ween-2026" target='_blank'>{'<3'}</a> by</p>
                <p>WiCyS & LUG</p>
            </div>
        </section>
    )
}