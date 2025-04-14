import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Heading,
    VStack,
    Text,
    Flex,
    Stack,
    Avatar,
    InputLeftElement,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import { FaUserAlt, FaLock } from "react-icons/fa";

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

    const [showPassword, setShowPassword] = useState(false);

    const handleShowClick = () => setShowPassword(!showPassword);

    const navigate = useNavigate();

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

        const url = isLogin ? 'https://localhost:7146/api/auth/login' : 'https://localhost:7146/api/auth/signup';

        try {
            console.log('Login url:', url);
            const response = await axios.post(url, payload);
            if (response.data.token) {
                setToken(response.data.token);
                console.log(response.data);
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('userRole', response.data.role);
                localStorage.setItem('userId', response.data.userId);

                navigate("/dashboard");
            }
        } catch (err) {
            console.error('Login failed:', error.response);
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
        <Flex
            flexDirection="column"
            width="100wh"
            height="100vh"
            backgroundColor="login.primary.500"
            justifyContent="center"
            alignItems="center"
        >
            <Stack
                flexDir="column"
                mb="2"
                justifyContent="center"
                alignItems="center"
            >
                <Box minW={{ base: "90%", md: "468px" }} >
                    {!token ? (
                        <Box>
                            <Avatar bg="login.primary.900" />
                            <Heading
                                as="h1"
                                size="lg"
                                mb={4}
                                color="login.primary.900"
                            >
                                {isLogin ? 'Login' : 'Sign Up'}
                            </Heading>
                            <form onSubmit={handleSubmit}>
                                <VStack
                                    spacing={4}
                                    p="1rem"
                                    backgroundColor="login.primary.700"
                                    boxShadow="md"
                                >
                                    {isLogin && (
                                        <>
                                            <FormControl>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none" >
                                                        <FaUserAlt color="gray.300" />
                                                    </InputLeftElement>
                                                    <Input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        isRequired
                                                        placeholder="Enter your email"
                                                        bg="login.primary.600"
                                                        _placeholder={{
                                                            color: "login.primary.400"
                                                        }}
                                                        _focus={{
                                                            boxShadow: "none",
                                                            borderColor: "login.primary.900"
                                                        }}
                                                    />
                                                </InputGroup>
                                            </FormControl>

                                            <FormControl>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none" >
                                                        <FaLock color="gray.300" />
                                                    </InputLeftElement>
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        isRequired
                                                        placeholder="Enter your password"
                                                        bg="login.primary.600"
                                                        _placeholder={{
                                                            color: "login.primary.400"
                                                        }}
                                                        _focus={{
                                                            boxShadow: "none",
                                                            borderColor: "login.primary.900"
                                                        }}
                                                    />
                                                    <InputRightElement width="4.5rem">
                                                        <Button
                                                            h="1.75rem"
                                                            size="sm"
                                                            onClick={handleShowClick}
                                                            bg="login.primary.900"
                                                            color="login.primary.500"
                                                            _hover={{
                                                                transform: "scale(1.05)",
                                                                bg: "login.primary.600",
                                                                color: "login.primary.900",
                                                                borderColor: "login.primary.900",
                                                            }}
                                                            _focus={{
                                                                outline: "none",
                                                            }}
                                                        >
                                                            {showPassword ? "Hide" : "Show"}
                                                        </Button>
                                                    </InputRightElement>
                                                </InputGroup>
                                            </FormControl>
                                        </>
                                    )}

                                    {!isLogin && (
                                        <>
                                            <FormControl>
                                                <FormLabel color="login.primary.900">First Name</FormLabel>
                                                <Input
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    placeholder="Enter your first name"
                                                    bg="login.primary.600"
                                                    color="login.primary.900"
                                                    _placeholder={{
                                                        color: "login.primary.400"
                                                    }}
                                                    _focus={{
                                                        boxShadow: "none",
                                                        borderColor: "login.primary.900"
                                                    }}
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel color="login.primary.900">Last Name</FormLabel>
                                                <Input
                                                    type="text"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    placeholder="Enter your last name"
                                                    bg="login.primary.600"
                                                    color="login.primary.900"
                                                    _placeholder={{
                                                        color: "login.primary.400"
                                                    }}
                                                    _focus={{
                                                        boxShadow: "none",
                                                        borderColor: "login.primary.900"
                                                    }}
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel color="login.primary.900">Date of Birth</FormLabel>
                                                <Input
                                                    type="date"
                                                    value={dateOfBirth}
                                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                                    bg="login.primary.600"
                                                    color= "login.primary.900"
                                                    _focus={{
                                                        boxShadow: "none",
                                                        borderColor: "login.primary.900"
                                                    }}
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel color="login.primary.900">Profile Picture URL</FormLabel>
                                                <Input
                                                    type="text"
                                                    value={profilePictureUrl}
                                                    onChange={(e) => setProfilePictureUrl(e.target.value)}
                                                    placeholder="Enter your profile picture URL"
                                                    bg="login.primary.600"
                                                    color="login.primary.900"
                                                    _placeholder={{
                                                        color: "login.primary.400"
                                                    }}
                                                    _focus={{
                                                        boxShadow: "none",
                                                        borderColor: "login.primary.900"
                                                    }}
                                                />
                                            </FormControl>
                                        </>
                                    )}

                                    {error && (
                                        <Text color="red.500" textAlign="center" mb={4}>
                                            {error}
                                        </Text>
                                    )}

                                    <Button
                                        type="submit"
                                        bg="login.primary.900"
                                        color="login.primary.500"
                                        width="full"
                                        mb={2}
                                        _hover={{
                                            transform: "scale(1.05)",
                                            bg: "login.primary.600",
                                            color: "login.primary.900",
                                            borderColor: "login.primary.900",
                                        }}
                                        _focus={{
                                            outline: "none",
                                        }}
                                    >
                                        {isLogin ? 'Login' : 'Sign Up'}
                                    </Button>
                                </VStack>
                            </form>

                            <Button
                                variant="link"
                                color="login.primary.900"
                                onClick={handleSwitch}
                                marginTop="10px"
                                bg="none"
                                _hover={{
                                    bg: "none",
                                    border: "none",
                                    color: "white",
                                    transform: "scale(1.05)",
                                }}
                                _focus={{
                                    outline: "none",
                                }}
                            >
                                {isLogin
                                    ? "Don't have an account? Sign up"
                                    : 'Already have an account? Login'}
                            </Button>
                        </Box>
                    ) : (
                        <>
                        </>
                    )}
                </Box>

            </Stack>

        </Flex>
      );
}

export default Auth;