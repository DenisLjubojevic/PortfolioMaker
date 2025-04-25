import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    Flex,
    Icon,
} from "@chakra-ui/react";

import { IoIosInformationCircleOutline } from "react-icons/io";

import { IoWarningOutline } from "react-icons/io5";

export function ConfirmationModal({ 
    isOpen,
    onClose,
    title,
    description,
    onConfirm,
    isWarning = false,
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
            <ModalOverlay />
            <ModalContent bg={isWarning ? "red.700" : "blue.700"} color="white">
                <ModalHeader>
                    <Flex align="center">
                        {isWarning ? (
                            <Icon
                                as={IoWarningOutline}
                                boxSize={6}
                                mr={2}
                            />
                        ) : (
                            <Icon
                                as={IoIosInformationCircleOutline}
                                boxSize={6}
                                mr={2}
                            />
                        )}
                        {title}
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Text>{description}</Text>
                </ModalBody>

                <ModalFooter>
                    <Button
                        onClick={onClose}
                        mr={3}
                        variant="ghost"
                        colorScheme="whiteAlpha"
                        _hover={{
                            color: "gray.200",
                            border: "none",
                        } }
                    >
                        Cancel
                    </Button>
                    <Button
                        bg="transparent"
                        color="white"
                        _hover={{
                            color: "gray.200",
                            border: "none",
                        }}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Yes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ConfirmationModal;