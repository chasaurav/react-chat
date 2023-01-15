import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuthContext } from "../context/AuthContext";
import { useChatContext } from "../context/ChatContext";

const Chats = () => {
    const [chats, setChats] = useState([]);
    const { currentUser } = useAuthContext();
    const { data, dispatch } = useChatContext();

    useEffect(() => {
        const getChats = () => {
            const unSub = onSnapshot(doc(db, "userChats", currentUser.uid), doc => {
                setChats(doc.data());
            });
    
            return () => unSub();
        }

        currentUser.uid && getChats();
    }, [currentUser.uid]);

    const handleSelect = userInfo => {
        dispatch({ type: "CHANGE_USER", payload: userInfo });
    }
    
    return (
        <div className="chats">
            {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map(ch => (
                <div className="userChat" key={ch[0]} onClick={() => handleSelect(ch[1].userInfo)}>
                    <img src={ch[1].userInfo.photoURL} alt={ch[1].userInfo.displayName} />
                    <div className="userChatInfo">
                        <span>{ch[1].userInfo.displayName}</span>
                        <p>{ch[1].lastMessage?.text}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Chats;