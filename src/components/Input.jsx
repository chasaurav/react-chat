import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';
import { v4 as uuid } from 'uuid';
import { db, storage } from '../firebase';
import { updateDoc, doc, arrayUnion, Timestamp, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import EmojiPicker from 'emoji-picker-react';
import Img from '../img/img.png';
import Emoji from '../img/emoji.png';
import Attach from '../img/attach.png';

const Input = () => {
    const { currentUser } = useAuthContext();
    const { data, dispatch } = useChatContext();
    const [text, setText] = useState('');
    const [img, setImg] = useState(null);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const handleEmojiClick = emojiData => setText(prevText => `${prevText} ${emojiData.emoji}`);

    const handleSend = async () => {
        if (img) {
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on(err => {
                // handle unsuccessful uploads
            }, () => {
                // handle successful uploads
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    await updateDoc(doc(db, "chats", data.chatId), {
                        messages: arrayUnion({
                            id: uuid(),
                            text,
                            senderId: currentUser.uid,
                            date: Timestamp.now(),
                            img: downloadURL
                        })
                    });
                });
            });
        } else {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now()
                })
            });
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [`${data.chatId}.lastMessage`]: { text },
            [`${data.chatId}.date`]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [`${data.chatId}.lastMessage`]: { text },
            [`${data.chatId}.date`]: serverTimestamp(),
        });

        setText("");
        setImg(null);
    }
    
    return (
        <div className="input">
            {showEmojiPicker && <EmojiPicker
                onEmojiClick={handleEmojiClick}
                lazyLoadEmojis={true}
                searchDisabled={false}
                autoFocusSearch={false}
                emojiStyle="google"
                previewConfig={{
                    showPreview: false
                }}
                width="100%"
                height="280px"
            />}
            <input type="text" placeholder="Type something..." value={text} onInput={(e) => setText(e.target.value)} />
            <div className="send">
                <img src={Emoji} alt="emoji.png" onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ filter: 'contrast(0) opacity(0.7)' }} />
                <img src={Img} alt="img.png" />
                <input type="file" style={{ display: 'none' }} id="fileAttachment" accept="image/png, image/jpg, image/jpeg" onChange={e => setImg(e.target.files[0])} />
                <label htmlFor="fileAttachment">
                    <img src={Attach} alt="attach.png" />
                </label>
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    )
}

export default Input;