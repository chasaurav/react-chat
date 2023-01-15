import { Sidebar, Chat } from '../components'
import { useChatContext } from "../context/ChatContext";

const Home = () => {
    const { data } = useChatContext();

    return (
        <div className='home'>
            <div className="container">
                <Sidebar />
                {!data.showSidebar && <Chat />}
            </div>
        </div>
    )
}

export default Home;