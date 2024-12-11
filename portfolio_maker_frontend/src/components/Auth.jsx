import { useState } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [role] = useState('User');
    const [error, setError] = useState('');
    const [token, setToken] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        const payload = {
            email,
            password,
            firstName,
            lastName,
            dateOfBirth,
            profilePictureUrl,
            role
        };

        const url = isLogin ? 'api/auth/login' : 'api/auth/signup';

        try {
            const response = await axios.post(url, payload);
            if (response.data.token) {
                setToken(response.data.token);
                localStorage.setItem('authToken', response.data.token);
            }
        } catch (err) {
            if (err.response && err.response.data) {
                const errorMessage = err.response.data.message || 'Something went wrong';
                setError(errorMessage);
            } else {
                setError('Something went wrong');
            }
        }
    };

    const handleSwitch = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div>
            {!token ? (
                <div>
                    <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Email: </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Password: </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {!isLogin && (
                            <>
                                <div>
                                    <label>First Name: </label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label>Last Name: </label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label>Date of birth: </label>
                                    <input
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label>Profile Picture URL: </label>
                                    <input
                                        type="text"
                                        value={profilePictureUrl}
                                        onChange={(e) => setProfilePictureUrl(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
                        </div>
                    </form>
                    {error && <p style={{ color: 'red' }}>{JSON.stringify(error)}</p>}
                    <button onClick={handleSwitch}>
                        {isLogin ? 'Don\'t have an account? Sign up' : 'Already have an account? Login'}
                    </button>
                </div>
            ) : (
                <Dashboard token={token} />
            )}
        </div>
      );
}

export default Auth;