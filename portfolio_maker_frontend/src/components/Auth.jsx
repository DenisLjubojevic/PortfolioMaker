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
    HStack,
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
    const [confirmPassword, setConfirmPassword] = useState('');
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

        if (isLogin) {
            try {
                const response = await axios.post(url, payload);
                if (response.data.token) {
                    setToken(response.data.token);
                    localStorage.setItem('authToken', response.data.token);
                    localStorage.setItem('userRole', response.data.role);
                    localStorage.setItem('userId', response.data.userId);

                    navigate("/dashboard");
                }
            } catch (err) {
                console.error('Login failed:', error.response);
                if (err.response && err.response.data) {
                    const errorMessage = err.response.data.description || 'Something went wrong';
                    setError(errorMessage);
                } else {
                    setError('Something went wrong');
                }
            }
        } else {
            setProfilePictureUrl("https://example.com/picture.jpg");

            if (password != confirmPassword) {
                setError("Both passwords must be same!");
            } else {
                try {
                    await axios.post(url, payload);
                    setIsLogin(true);
                } catch (err) {
                    console.error('Sign Up failed:', error.response);
                    if (err.response && err.response.data) {
                        const errorMessage = err.response.data.message || 'Something went wrong';
                        setError(errorMessage);
                    } else {
                        setError('Something went wrong');
                    }
                }
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
                                                    <InputLeftElement pointerEvents="none" color="login.primary.900">
                                                        <FaUserAlt />
                                                    </InputLeftElement>
                                                    <Input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        isRequired
                                                        placeholder="Enter your email"
                                                        bg="login.primary.600"
                                                        color="login.primary.900"
                                                        _placeholder={{
                                                            color: "login.primary.900",
                                                        }}
                                                        _focus={{
                                                            boxShadow: "none",
                                                            borderColor: "login.primary.900",
                                                        }}
                                                    />
                                                </InputGroup>
                                            </FormControl>

                                            <FormControl>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none" color="login.primary.900">
                                                        <FaLock />
                                                    </InputLeftElement>
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        isRequired
                                                        placeholder="Enter your password"
                                                        bg="login.primary.600"
                                                        color="login.primary.900"
                                                        _placeholder={{
                                                            color: "login.primary.900"
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
                                                                bg: "login.primary.800",
                                                                color: "login.primary.400",
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
                                            <HStack p={4}>
                                                <VStack>
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
                                                                color: "login.primary.900",
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
                                                                color: "login.primary.900"
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
                                                            color="login.primary.900"
                                                            _focus={{
                                                                boxShadow: "none",
                                                                borderColor: "login.primary.900"
                                                            }}
                                                        />
                                                    </FormControl>
                                                </VStack>
                                                <VStack ml={10}>
                                                    <FormControl>
                                                        <FormLabel color="login.primary.900">Email</FormLabel>
                                                        <Input
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            placeholder="Enter your email"
                                                            bg="login.primary.600"
                                                            color="login.primary.900"
                                                            _placeholder={{
                                                                color: "login.primary.900"
                                                            }}
                                                            _focus={{
                                                                boxShadow: "none",
                                                                borderColor: "login.primary.900"
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel color="login.primary.900">Password</FormLabel>
                                                        <Input
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            placeholder="Enter your password"
                                                            bg="login.primary.600"
                                                            color="login.primary.900"
                                                            _placeholder={{
                                                                color: "login.primary.900"
                                                            }}
                                                            _focus={{
                                                                boxShadow: "none",
                                                                borderColor: "login.primary.900"
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel color="login.primary.900">Confirm Password</FormLabel>
                                                        <Input
                                                            type="password"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            placeholder="Enter your password again"
                                                            bg="login.primary.600"
                                                            color="login.primary.900"
                                                            _placeholder={{
                                                                color: "login.primary.900"
                                                            }}
                                                            _focus={{
                                                                boxShadow: "none",
                                                                borderColor: "login.primary.900"
                                                            }}
                                                        />
                                                    </FormControl>
                                                </VStack>
                                            </HStack>
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
                                            bg: "login.primary.800",
                                            color: "login.primary.400",
                                            borderColor: "login.primary.700",
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
                                    color: "login.primary.800",
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