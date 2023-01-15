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
        if (text.trim() == '' && !img) return;

        setText("");
        setImg(null);

        if (img) {
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on('state_changed', snapshot => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');

                switch (snapshot.state) {
                    case 'paused':
                    console.log('Upload is paused');
                    break;
                    case 'running':
                    console.log('Upload is running');
                    break;
                }
            }, error => {
                // handle unsuccessful uploads
                switch (error.code) {
                    case 'storage/unauthorized':
                      console.log("User doesn't have permission to access the object");
                      break;
                    case 'storage/canceled':
                      console.log("User canceled the upload");
                      break;              
                    case 'storage/unknown':
                      console.log("Unknown error occurred, inspect error.serverResponse");
                      break;
                }
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
    }

    const handleKey = e => e.code === "Enter" && handleSend();
    
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
            <input type="text" placeholder="Type something..." value={text} onKeyDown={handleKey} onInput={(e) => setText(e.target.value)} />
            <div className="send">
                <img src={Emoji} alt="emoji.png" onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{
                    filter: !showEmojiPicker ? 'contrast(0) opacity(0.7)' : 'none',
                    backgroundColor: showEmojiPicker ? '#82df89' : '',
                    borderRadius: '50%',
                }} />
                <input type="file" style={{ display: 'none' }} id="fileAttachment" accept="image/png, image/jpg, image/jpeg" onChange={e => setImg(e.target.files[0])} />
                <label htmlFor="fileAttachment">
                    <img src={Img} alt="img.png" style={{ backgroundColor: img ? '#82df89' : '' }} />
                </label>
                <img src={Attach} alt="attach.png" />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    )
}

export default Input;