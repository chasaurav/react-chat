import { useEffect, useRef } from 'react';
import { useAuthContext } from "../context/AuthContext";
import { useChatContext } from "../context/ChatContext";

const Message = ({ msg }) => {
    const { currentUser } = useAuthContext();
    const { data, dispatch } = useChatContext();
    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, [msg]);

    return (
        <div ref={ref} className={`message ${msg.senderId === currentUser.uid && 'owner'}`}>
            <div className="messageInfo">
                <img src={msg.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="profile_pic" />
                <span>Just now</span>
            </div>
            <div className="messageContent">
                <p>{msg.text}</p>
                {msg.img && <img src={msg.img} alt="attachment" />}
            </div>
        </div>
    )
}

export default Message;