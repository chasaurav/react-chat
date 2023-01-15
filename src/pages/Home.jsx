import { Sidebar, Search, Navbar, Messages, Input, Chats, Chat } from '../components'

const Home = () => {
    return (
        <div className='home'>
            <div className="container">
                <Sidebar />
                <Chat />
                {/* <Search />
                <Navbar />
                <Messages />
                <Input />
                <Chats /> */}
            </div>
        </div>
    )
}

export default Home;