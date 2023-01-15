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
                <div className="name-section">
                    <span className="hamburger-menu show-mobile-tablet" onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                    <span>{data.user?.displayName}</span>
                </div>
                <div className="chatIcons">
                    <img src={Cam} alt="cam.png" />
                    <img src={Add} alt="add.png" />
                    <img src={More} alt="more.png" />
                </div>
            </div>

            <Messages />
            {data.chatId != 'null' ? <Input /> : <div style={{ height: '50px', padding: '10px', background: '#fff', textAlign: 'center' }}>
                <p>
                    <strong>This is the Beta version of the App</strong>, <br />
                    <small>Click the Menu icon. Search by username to start chatting.</small> <br />
                    <small>New Feature updates & bug fixes comming soon.</small>
                </p>
            </div>}
        </div>
    )
}

export default Chat;