import { createContext, useContext, useReducer, useState } from "react";
import { useAuthContext } from "./AuthContext";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const { currentUser } = useAuthContext();

    const INITIAL_STATE = {
        chatId: "null",
        user: {},
        showSidebar: false,
    };

    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId: currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + currentUser.uid,
                    showSidebar: false,
                }
            case "TOGGLE_SIDEBAR":
                return {
                    user: state.user,
                    chatId: state.chatId,
                    showSidebar: !state.showSidebar,
                };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return <ChatContext.Provider value={{ data: state, dispatch }}>{children}</ChatContext.Provider>
}

export const useChatContext = () => useContext(ChatContext);