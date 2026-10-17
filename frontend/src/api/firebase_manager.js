import { collection, doc, getDoc, setDoc, getDocs, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase_config";

// login
// @param: display_name -- String
// @return: {id: String, completed: [String], score: Int}
export async function login(display_name) {
    display_name = display_name.trimEnd().toLowerCase();
    try {
        // check if user exists 
        const snap = await getDoc( doc(db, "users", display_name) );
        // if so, login
        if (snap.exists()) {
            return {id: snap.id, ...snap.data()};
        }

        // create new item in users collection if not there
        // case doesn't matter
        else {
            await setDoc(doc(db, "users", display_name), {
                completed: [],
                score: 0
            });
            console.log("USER CREATED:", display_name);
            
            // login
            const snap = await getDoc(doc(db, "users", display_name));
            return {id: snap.id, ...snap.data()};
        }
    
    }
    catch (error) {
        console.error("Error creating logging in: ", error);
        return null;
    }
} 

// get all challenges
// @return: [{id: String, name: String, prompt: String, category: String, points: Int, files: [String], hints; [String]}, ...]
export async function get_all_challenges() {
    try {
        const snap = await getDocs( collection(db, "challenges") );
        const all_data = snap.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            prompt: doc.data().prompt,
            category: doc.data().category,
            points: doc.data().points,
            files: doc.data().files,
            hints: doc.data().hints,
        }));
        return all_data;
    }
    catch (error) {
        console.error("Error fetching all challenges: ", error);
        return null;
    }
} 

// fetch scoreboard
// @return: [{id: String, score: Int}, ...]
export async function fetch_scoreboard() {
    // order in decreasing order
    try {
        const q = query(collection(db, "users"), orderBy("score", "desc"));
        const snap = await getDocs(q);
        const all_data = snap.docs.map(doc => ({
            id: doc.id,
            score: doc.data().score
        }));
        return all_data;
    }
    catch (error) {
        console.error("Error fetching all users: ", error);
        return null;
    }
} 


// USER FUNCTIONS ====================================

// check answer
// @param: uuid -- String
// @param: challenge_id -- String
// @param: user_answer -- String
// @return: Boolean
export async function check_answer(uuid, challenge_id, user_answer) {
    try {
        // grab correct answer
        const user_ref = doc(db, 'users', uuid);
        const user_snap = await getDoc(user_ref);
        const chal_snap = await getDoc(doc(db, "challenges", challenge_id));

        // check if answers match
        if (user_answer == chal_snap.data().answer) {
            console.log("Answer was correct!");

            // only award points if not already completed
            if (!user_snap.data().completed.includes(challenge_id)) {
                await updateDoc(user_ref, {
                    // award points to user if so
                    score: (chal_snap.data().points + user_snap.data().score),
                    // add to user completed list
                    completed: [...user_snap.data().completed, challenge_id]
                });
            }

            return true 
        }
        // else 
        return false // incorrect answer
    }
    catch (error) {
        console.error("Error checking answer: ", error);
        return false;
    }
} 
