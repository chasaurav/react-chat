import Cam from '../img/cam.png';
import Add from '../img/add.png';
import More from '../img/more.png';
import Messages from './Messages';
import Input from './Input';
import { useChatContext } from "../context/ChatContext";

const Chat = () => {
    const { data, dispatch } = useChatContext();
    
    return (
        <div className="chat">
            <div className="chatInfo">
                <span>{data.user?.displayName}</span>
                <div className="chatIcons">
                    <img src={Cam} alt="cam.png" />
                    <img src={Add} alt="add.png" />
                    <img src={More} alt="more.png" />
                </div>
            </div>

            <Messages />
            <Input />
        </div>
    )
}

export default Chat;