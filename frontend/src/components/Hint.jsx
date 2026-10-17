import { useState, useEffect } from 'react';
import styles from "./ChallengeModal.module.css";
import { Search } from 'lucide-react';

export default function Hint({hint, ind}) {
    const [hintUsed, setInput] = useState("Hint #" + ind);

    function handle_hint() {
        setInput(hint);
    }

    return (
        <div>
            <button className={styles.files_download} onClick={handle_hint}>
                <Search size={20}/>
                {hintUsed}
            </button>
        </div>
    )
}