import { useState } from "react";
import { doc, setDoc, collection, query, where, getDoc, getDocs, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuthContext } from "../context/AuthContext";
import { useChatContext } from "../context/ChatContext";

const Search = () => {
    const [username, setUsername] = useState('');
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const { currentUser } = useAuthContext();
    const { data, dispatch } = useChatContext();

    const handleSearch = async () => {
        const q = query(collection(db, 'users'), where("displayName", "==", username));

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        } catch (error) {
            setErr(true);
        }
    }

    const handleKey = e => e.code === "Enter" && handleSearch();

    const handleSelect = async () => {
        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

        try {
            const res = await getDoc(doc(db, "chats", combinedId));
            if (!res.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [`${combinedId}.userInfo`]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [`${combinedId}.date`]: serverTimestamp()
                });

                await updateDoc(doc(db, "userChats", user.uid), {
                    [`${combinedId}.userInfo`]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    [`${combinedId}.date`]: serverTimestamp()
                });
            }
        } catch (error) {}

        setUsername("");
        setUser(null);
        dispatch({ type: "CHANGE_USER", payload: user });
    }

    return (
        <div className="search">
            <div className="searchForm">
                <input type="text" placeholder="Find a user" onKeyDown={handleKey} value={username} onInput={e => setUsername(e.target.value)} />
            </div>
            {err && <p style={{
                color: "gray",
                textAlign: "center",
                fontSize: "15px",
                padding: "10px"
            }}>User not found!</p>}
            {user && (
                <div className="userChat" onClick={handleSelect}>
                    <img src={user.photoURL} alt={user.displayName} />
                    <div className="userChatInfo">
                        <span>{user.displayName}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Search;