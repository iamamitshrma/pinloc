import { Cancel, Room } from '@material-ui/icons';
import axios from 'axios';
import { useRef, useState } from 'react';
import styles from './register.module.css';

const Register = ({setShowRegister}) => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async(e) => {
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        try {
            await axios.post("/users/register", newUser);
            setError(false);
            setSuccess(true);
        } catch (error) {
            setError(true);
        }
    }
    return (
        <div className={styles.registerContainer}>
            <div className={styles.logo}>
                <Room />
                PinLoc
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" ref={nameRef}/>
                <input type="email" placeholder="Email" ref={emailRef}/>
                <input type="password" placeholder="Password" ref={passwordRef}/>
                <button className={styles.registerBtn} type="submit">Register</button>
                {
                    success && <span className={styles.success}>Successfull. Now You Can Login.</span>
                }
                {
                    error && <span className={styles.failure}>Something is Wrong.</span>
                }                
            </form>
            <Cancel className={styles.registerCancel} onClick={()=>setShowRegister(false)}/>            
        </div>
    )
}

export default Register;
