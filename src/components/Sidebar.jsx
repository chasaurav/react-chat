import Chats from "./Chats";
import Navbar from "./Navbar";
import Search from "./Search";
import { useChatContext } from "../context/ChatContext";

const Sidebar = () => {
    const { data } = useChatContext();

    return (
        <div className={`sidebar ${!data.showSidebar && "hide-mobile-tablet"}`}>
            <Navbar />
            <Search />
            <Chats />
        </div>
    )
}

export default Sidebar;