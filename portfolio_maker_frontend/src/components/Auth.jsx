import { useState } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import Navbar from './Navbar';
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack, Text } from '@chakra-ui/react';

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

    const handleLogout = async () => {
        try {
            await axios.post(
                'api/auth/logout',
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                });
        } catch (error) {
            console.log('Error during logout', error);
        } finally {
            setToken(null);
            localStorage.removeItem('authToken');
        }
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            bg="gray.100"
            flexDirection="column"
        >
            {!token ? (
                <Box
                    p={6}
                    width="100%"
                    bg="white"
                    boxShadow="md"
                    borderRadius="md"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <Heading as="h1" size="lg" mb={4}>
                        {isLogin ? 'Login' : 'Sign Up'}
                    </Heading>
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4} align="stretch" width="100%">
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    isRequired
                                    placeholder="Enter your email"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    isRequired
                                    placeholder="Enter your password"
                                />
                            </FormControl>

                            {!isLogin && (
                                <>
                                    <FormControl>
                                        <FormLabel>First Name</FormLabel>
                                        <Input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="Enter your first name"
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Last Name</FormLabel>
                                        <Input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Enter your last name"
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Date of Birth</FormLabel>
                                        <Input
                                            type="date"
                                            value={dateOfBirth}
                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Profile Picture URL</FormLabel>
                                        <Input
                                            type="text"
                                            value={profilePictureUrl}
                                            onChange={(e) => setProfilePictureUrl(e.target.value)}
                                            placeholder="Enter your profile picture URL"
                                        />
                                    </FormControl>
                                </>
                            )}

                            {error && (
                                <Text color="red.500" textAlign="center" mb={4}>
                                    {error}
                                </Text>
                            )}

                            <Button type="submit" colorScheme="teal" width="full" mb={2}>
                                {isLogin ? 'Login' : 'Sign Up'}
                            </Button>
                        </VStack>
                    </form>

                    <Button variant="link" onClick={handleSwitch}>
                        {isLogin
                            ? "Don't have an account? Sign up"
                            : 'Already have an account? Login'}
                    </Button>
                </Box>
            ) : (
                <>
                    <Navbar onLogout={handleLogout} />
                    <Dashboard token={token} />
                </>
            )}
        </Box>

        /*
        <div >
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
                <>
                    <Navbar onLogout={handleLogout} />
                    <Dashboard token={token} />
                </>
            )}
        </div>
        */
      );
}

export default Auth;