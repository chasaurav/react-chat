import { useState, useRef } from 'react';
import Add from '../img/addAvatar.png';
import Preloader from '../img/preloader.gif';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [error, setError] = useState(false);
    const [apiCallOngoing, setApiCallOngoing] = useState(false);
    const [dataMissing, setDataMissing] = useState(false);
    const [profilePicMissing, setProfilePicMissing] = useState(false);
    const [profilePicName, setProfilePicName] = useState('');
    const profilePicInput = useRef();
    const navigate = useNavigate();

    const handleImgClear = () => {
        profilePicInput.current.value = null;
        setProfilePicName('');
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setDataMissing(false);
        setProfilePicMissing(false);

        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        if (!file || displayName.trim() == '' || email.trim() == '' || password.trim() == '') {
            setDataMissing(true);

            if (!file) {
                setProfilePicMissing(true);
                return;
            }

            return;
        }

        setApiCallOngoing(true);

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const storageRef = ref(storage, displayName);
            const uploadTask = uploadBytesResumable(storageRef, file);

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

                setError(true);
                setApiCallOngoing(false);
            }, () => {
                // handle successful uploads
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    await updateProfile(res.user, {
                        displayName,
                        photoURL: downloadURL
                    });

                    await setDoc(doc(db, "users", res.user.uid), {
                        uid: res.user.uid,
                        email,
                        displayName,
                        photoURL: downloadURL
                    });

                    await setDoc(doc(db, "userChats", res.user.uid), {});

                    navigate('/');
                });
            });
        } catch (err) {
            setError(true);
            setApiCallOngoing(false);
        }
    }

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">React Chat</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Display Name" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <input type="file" id="file" ref={profilePicInput} accept="image/png, image/jpg, image/jpeg" style={{ display: 'none' }} onChange={e => setProfilePicName(e.target.files[0].name)} />
                    {profilePicName == '' ? (
                        <label htmlFor="file">
                            <img src={Add} alt="addAvatar.png" />
                            <span>Add Profile Image</span>
                        </label>
                    ) : (
                        <div onClick={handleImgClear}>
                            <img src={Add} alt="addAvatar.png" />
                            <span className="text-overflow">{profilePicName}</span>
                            <span>&times;</span>
                        </div>
                    )}
                    {dataMissing && <span style={{ textAlign: 'center', fontSize: '12px', color: 'orangered' }}>Please fill all the above fields.</span>}
                    {profilePicMissing && <span style={{ textAlign: 'center', fontSize: '12px', color: 'orangered' }}>Please select a profile image.</span>}
                    { apiCallOngoing ? <img src={Preloader} alt="preloader.gif" style={{ width: "24px", margin: "0 auto" }} /> : <button type="submit">Sign up</button>}
                    {error && <span style={{ textAlign: 'center', fontSize: '12px', color: 'orangered' }}>Something went wrong...</span>}
                </form>
                <p>You already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}

export default Register;