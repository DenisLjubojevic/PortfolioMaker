import * as PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Navbar from '../Navbar';

import {
    Box,
    Flex,
    Text,
    SimpleGrid,
    Stack,
    Heading,
    Button,
    IconButton,
    useToast,
} from "@chakra-ui/react";

import apiClient from '../../axiosConfig';
import { useTheme } from "../../context/ThemeContext";

import { FaTrashAlt } from "react-icons/fa";

function MessagesComponent() {
    const [messages, setMessages] = useState([]);

    const { theme } = useTheme();

    const token = localStorage.getItem('authToken');

    const toast = useToast();

    const fetchUserMessages = async (userId) => {
        try {
            const response = await apiClient.get(`https://localhost:7146/api/message/reciever/${userId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    }

    const handleDeleteAllMessages = async () => {
        const userId = localStorage.getItem("userId");
        try {
            await apiClient.delete(`https://localhost:7146/api/message/delete/reciever/${userId}`);
            fetchUserMessages();
            toast({
                title: "Messages",
                description: "All your messages have been deleted!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Error while deleting all your messages!",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const handleDeleteMessage = async (message) => {
        try {
            await apiClient.delete(`https://localhost:7146/api/message/delete/${message.id}`);
            fetchUserMessages();
            toast({
                title: "Message",
                description: "Message has been deleted!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Error while deleting your message!",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (userId) fetchUserMessages(userId);
    }, []);

    return (
        <Flex
            flexDirection="column"
            width="100vw"
            height="100vh"
            justifyContent="flex-start"
            alignItems="center"
            bg="brand.primary.800"
        >
            <Navbar token={token} />
            {messages.length === 0 ? (
                <Text
                    p={4}
                    color={theme === "dark" ? "lightGray" : "black"}
                    fontSize="2rem"
                >
                    You do not have any messages!
                </Text>
            ) : (
                <Flex
                    p={4}
                    flexDirection="column"
                    width="80vw"
                    height="90vh"
                >
                        <Button
                            width="fit-content"
                            onClick={() => handleDeleteAllMessages()}
                            bg="brand.secondary.900"
                            color="brand.primary.700"
                    >
                        Delete all messages
                    </Button>
                    <SimpleGrid
                        marginTop="20px"
                        columns={[1, 2, 3]}
                        spacing={8}
                        alignItems="center"
                    >
                        {messages.map((message, index) => (
                            <Box
                                key={index}
                                p={5}
                                height="120px"
                                bg={message.status == "Information" ? "#d9ce8f" : "#c94e40" }
                                color={message.status == "Information" ? "black" : "black"}
                                shadow="md"
                                borderRadius="md"
                                position="relative"
                                _hover={{ shadow: "lg" }}
                            >
                                <IconButton
                                    aria-label="Delete"
                                    onClick={() => handleDeleteMessage(message)}
                                    icon={<FaTrashAlt />}
                                    size="sm"
                                    position="absolute"
                                    top="8px"
                                    right="8px"
                                    bg="transparent"
                                    color="black"
                                    _hover={{
                                        color: "white",
                                        bg: "transparent",
                                        border: "none",
                                    }}
                                />
                                <Stack>
                                    <Heading as="h3" size="md">
                                        {message.status}
                                    </Heading>

                                    <Text>{message.context}</Text>                                        
                                </Stack>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Flex>
            )}
        </Flex>
    );
}

MessagesComponent.propTypes = {
    messages: PropTypes.array.isRequired,
}

export default MessagesComponent;