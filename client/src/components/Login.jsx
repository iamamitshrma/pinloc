import { Cancel, Room } from '@material-ui/icons';
import { useRef, useState } from 'react';
import styles from './login.module.css';
import axios from 'axios';

const Login = ({setShowLogin, myStorage, setCurrentUser}) => {
    const [error, setError] = useState(false);
    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async(e) => {
        e.preventDefault();
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value,
        };
        try {
            const res = await axios.post("/users/login", user);
            myStorage.setItem("user", res.data.username);
            setCurrentUser(res.data.username);
            setShowLogin(false);
            setError(false);
        } catch (error) {
            setError(true);
        }
    }
    return (
        <div className={styles.loginContainer}>
            <div className={styles.logo}>
                <Room />
                PinLoc
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" ref={nameRef}/>
                <input type="password" placeholder="Password" ref={passwordRef}/>
                <button className={styles.loginBtn} type="submit">SignIn</button>
                {
                    error && <span className={styles.failure}>Something is Wrong.</span>
                }                
            </form>
            <Cancel className={styles.loginCancel} onClick={()=>setShowLogin(false)}/>            
        </div>
    )
}

export default Login;
