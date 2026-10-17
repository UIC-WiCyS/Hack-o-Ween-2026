import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'universal-cookie';
import './App.css';
import { db } from "./api/firebase_config"
import { login } from "./api/firebase_manager"
import Header from './components/Header';
import Login from './pages/Login';
import About from './pages/About';
import ChallengesOverview from './pages/ChallengesOverview';
import Scoreboard from './pages/Scoreboard';
import NotFound from './pages/NotFound';



function App() {
    const [user, setUser] = useState(null);
    const cookies = new Cookies(null, { path: '/' });

    useEffect(() => {
        // setCookies(new Cookies(null, { path: '/' }));
        // console.log(cookies.get('user'));
        var username_check = cookies.get('user_cookie')
        if (username_check != undefined)
        {
            handle_login(username_check)
        }
        // console.log(user);
    }, []);
    
    async function handle_login(name) {
        var data = await login(name);
        setUser(data)
        cookies.set('user_cookie', name);
        // console.log(data)
    }

    async function handle_logout() {
        setUser(null);
        cookies.remove('user_cookie');
        // window.location.reload();
    }


    return (
        <BrowserRouter>
            { cookies.get('user_cookie')!=undefined && user &&
                <Header logout={handle_logout} />
            }

            <Routes>
                { (cookies.get('user_cookie')===undefined) &&
                <Route path="/" element={<Login callback={handle_login} />} />
                }
                { cookies.get('user_cookie')!=undefined && user && 
                <Route path="/" element={<ChallengesOverview session={user} />} />
                }
                { user && 
                <Route path="/about" element={<About />} />
                }
                { user && 
                <Route path="/scoreboard" element={<Scoreboard />} />
                }

                {/* 404 */}
                {   (cookies.get('user_cookie')===undefined) &&
                    <Route path="*" element={<NotFound />} />
                }
            </Routes>
        </BrowserRouter>
    )
}

export default App
