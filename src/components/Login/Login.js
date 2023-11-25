// Import necessary modules and components
import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import './Login.module.css';

// Define the Login component
function Login() {
    // Define state variables for email, password, error message, and submit button status
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [emailAuthSuccess, setEmailAuthSuccess] = useState(false);
    const [googleAuthSuccess, setGoogleAuthSuccess] = useState(false);
    // Define a navigate function using the useNavigate hook from react-router-dom
    const navigate = useNavigate();

    // Define a function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        // Check if email and password fields are filled out
        if (!email || !password) {
            setError('Please fill in all fields');
        } else {
            setError('');
            setSubmitButtonDisabled(true);

            // Use Firebase's signInWithEmailAndPassword function to sign in the user
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    console.log(user);
                    setEmailAuthSuccess(true);
                    if (googleAuthSuccess) {
                        navigate('/Resume-it');
                    }
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error('Error signing in:', error);
                    setError('Invalid email or password. Please try again.');
                    setSubmitButtonDisabled(false);
                });
        }
    };

    // Define a function to handle Google sign in
    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log(user);
                setGoogleAuthSuccess(true);
                if (emailAuthSuccess) {
                    navigate('/Resume-it');
                } else {
                    navigate('/Resume-it');
                }
            
            })
            .catch((error) => {
                console.error('Error signing in with Google:', error);
                setError('Error signing in with Google. Please try again.');
            });
    };

    // Define a function to handle forgot password link click
    const handleForgotPassword = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log('Password reset email sent');
                setForgotPassword(false);
                setError('Password reset email sent. Please check your inbox.');
            })
            .catch((error) => {
                console.error('Error sending password reset email:', error);
                setError('Error sending password reset email. Please try again.');
            });
    };

    return (
        
<>

            <form onSubmit={handleSubmit}>
            <h1>Log in</h1>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </label>
                <br />
                <button className='log-btn' type="submit" disabled={submitButtonDisabled}>Log in</button>
            </form>
            <p><Link to="/signup">Don't have an account? Sign up</Link></p>
            <p><button onClick={() => setForgotPassword(true)}>Forgot password?</button></p>
            {forgotPassword && (
                <div >
                    <p>Enter your email address to reset your password:</p>
                    <form onSubmit={handleForgotPassword} className='forgot' >
                        <label>
                            Email:
                            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                        </label>
                        <br />
                        <button type="submit">Reset password</button>
                    </form>
                </div>
            )}
            <button onClick={handleGoogleSignIn} style={{ display: 'block', margin: '0 auto' ,}}>Log in with Google</button>
            {error && <p>{error}</p>}
            </>
    ); 
    
};

export default Login;


