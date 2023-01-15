import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Preloader from '../img/preloader.gif';

const Login = () => {
    const [error, setError] = useState(false);
    const [dataMissing, setDataMissing] = useState(false);
    const [apiCallOngoing, setApiCallOngoing] = useState(false);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setDataMissing(false);

        const email = e.target[0].value;
        const password = e.target[1].value;

        if (email.trim() == '' || password.trim() == '') {
            setDataMissing(true);
            return;
        }

        setApiCallOngoing(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setApiCallOngoing(false);
            setError(true);
        }
    }
    
    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">React Chat</span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    {dataMissing && <span style={{ textAlign: 'center', fontSize: '12px', color: 'orangered' }}>Please fill all the above fields.</span>}
                    { apiCallOngoing ? <img src={Preloader} alt="preloader.gif" style={{ width: "24px", margin: "0 auto" }} /> : <button type="submit">Sign in</button>}
                    {error && <span style={{ textAlign: 'center', fontSize: '12px', color: 'orangered' }}>Something went wrong...</span>}
                </form>
                <p>You don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    )
}

export default Login;