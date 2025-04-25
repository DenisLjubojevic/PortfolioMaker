import { useState } from 'react';

import {
    Box,
    Button,
    Select,
    Textarea,
    Text,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@chakra-ui/react";

import apiClient from '../../axiosConfig';

import { ConfirmationModal } from "../DialogModel/ConfirmationModal";

function MessageModel({ portfolio }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [context, setContext] = useState("");
    const [status, setStatus] = useState("Information");

    const toast = useToast();

    const handleStatusChange = (status) => {
        setStatus(status);
    }



    const sendMessage = async () => {
        const userId = localStorage.getItem("userId");
        const recieverId = portfolio.userId;

        var message = {
            senderId: userId,
            recieverId: recieverId,
            context: context,
            status: status,
        }

        if (message.context == "") {
            toast({
                title: "Unable to send message",
                description: "You need to add a content to message",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } else {
            try {
                await apiClient.post('https://localhost:7146/api/message/send', {
                    ...message
                });
                toast({
                    title: "Message",
                    description: "Your message has been sent.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                toast({
                    title: "Error while sending this message",
                    description: error.message || "An unexpected error occurred.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
            onClose();
        }
    }

    return (
        <Box>
            <Button onClick={() => onOpen()}>
                Send Message
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg="brand.secondary.800" color="brand.primary.800">
                    <ModalHeader>
                        Send message
                    </ModalHeader>
                    <ModalBody>
                        <Text>
                            Your Message:
                        </Text>
                        <Textarea
                            width="220px"
                            name="context"
                            placeholder="Type your message here"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            borderColor="brand.primary.900"
                            bg='brand.primary.800'
                            color="brand.secondary.900"
                            _placeholder={{
                                color: "brand.secondary.900",

                            }}
                            _focus={{
                                boxShadow: "none",
                                border: "2px solid",
                                borderColor: "brand.secondary.900",
                            }}
                        />
                        <Text>
                            Status:
                        </Text>
                        <Select name="status" value={status} onChange={event => handleStatusChange(event.target.value)} bg="brand.primary.800" color="brand.secondary.900">
                            <option id="0" defaultChecked>Information</option>
                            <option id="1" >Warning</option>
                        </Select >
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={onClose}
                            mr={3}
                        >
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            onClose();
                            setConfirmOpen(true);
                        }}>
                            Send message
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <ConfirmationModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Confirm Send"
                description="Are you sure you want to send this message?"
                isWarning={false}
                onConfirm={sendMessage}
            />
        </Box>
    );
}

export default MessageModel;