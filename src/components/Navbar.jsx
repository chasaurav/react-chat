import { signOut } from 'firebase/auth';
import { useAuthContext } from '../context/AuthContext';
import { auth } from '../firebase';

const Navbar = () => {
    const { currentUser } = useAuthContext();

    return (
        <div className="navbar">
            <span className="logo">React Chat</span>
            <div className="user">
                <img src={currentUser.photoURL} alt={currentUser.displayName} />
                <span>{currentUser.displayName}</span>
                <button onClick={() => signOut(auth)}>Logout</button>
            </div>
        </div>
    )
}

export default Navbar;