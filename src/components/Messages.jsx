import Message from './Message';
import { useChatContext } from "../context/ChatContext";
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from "firebase/firestore";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const { data, dispatch } = useChatContext();

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", data.chatId), doc => {
            doc.exists() && setMessages(doc.data().messages);
        });

        return () => unSub();
    }, [data.chatId]);

    return (
        <div className="messages">
            {messages.map(msg => <Message msg={msg} key={msg.id} /> )}
        </div>
    )
}

export default Messages;