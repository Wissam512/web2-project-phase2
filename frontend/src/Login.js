import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Assets/ModernLogin.css';
import API_URL from './apiConfig';

function Login({ onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleMouseMove = (e) => {
        if (focusedInput === 'password') return; // Don't track if covering eyes

        // Calculate eye position based on mouse relative to window center
        // Range: -1 to 1
        const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

        setEyePosition({ x, y });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const endpoint = isRegistering ? `${API_URL}/api/auth/register` : `${API_URL}/api/auth/login`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            if (isRegistering) {
                setIsRegistering(false);
                setError('');
                alert('Registration successful! Please login.');
            } else {
                // Call the onLogin prop passed from App.js to update the global auth state
                onLogin(data);

                // Use navigate for client-side routing instead of window.location.href
                if (data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div
            className="modern-login-container"
            onMouseMove={handleMouseMove}
            style={{
                '--eye-x': eyePosition.x,
                '--eye-y': eyePosition.y
            }}
        >
            {/* Left Side - Animated Art */}
            <div className="login-left">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>

                <div className="hero-content">
                    <div className="character-group">
                        <div className="character-group">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <div key={num} className={`character char-${num} ${focusedInput === 'password' ? 'password-mode' : ''}`}>
                                    <div className="move-target">
                                        <div className="eye eye-left"></div>
                                        <div className="eye eye-right"></div>
                                    </div>
                                    <div className="character-smile"></div>
                                    <div className="hands">
                                        <div className="hand hand-left"></div>
                                        <div className="hand hand-right"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="welcome-text">
                        <h1>{isRegistering ? "Join Us!" : "Welcome Back"}</h1>
                        <p>{isRegistering ? "Start your journey with us today." : "We're so glad to see you again."}</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="login-right">
                <div className="login-form-wrapper">
                    <div className="login-header">
                        <h2>{isRegistering ? 'Create Account' : 'Sign In'}</h2>
                        <p style={{ color: '#64748b' }}>
                            {isRegistering ? 'Enter your details below to get started.' : 'Enter your details to access your account.'}
                        </p>
                    </div>

                    {error && <div className="error-toast">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Username</label>
                            <input
                                type="text"
                                className="modern-input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onFocus={() => setFocusedInput('username')}
                                onBlur={() => setFocusedInput(null)}
                                placeholder="e.g. wissam"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input
                                type="password"
                                className="modern-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput(null)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button type="submit" className="modern-btn">
                            {isRegistering ? 'Create Account' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-switch">
                        {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                        <span className="auth-link" onClick={() => setIsRegistering(!isRegistering)}>
                            {isRegistering ? 'Log in' : 'Sign up'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
