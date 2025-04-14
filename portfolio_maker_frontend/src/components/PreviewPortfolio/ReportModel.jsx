import { useState } from 'react';

import {
    Box,
    Button,
    IconButton,
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

import { MdOutlineReport } from "react-icons/md";

import apiClient from '../../axiosConfig';

function ReportModel({ id }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [reportComment, setReportComment] = useState("");


    const toast = useToast();

    const report = async (reportComment) => {
        if (reportComment != "") {
            var reportData = {
                id: "1",
                PortfolioId: id,
                comment: reportComment,
            }

            try {
                console.log(reportData);
                await apiClient.post('https://localhost:7146/api/report/create', {
                    ...reportData
                });
                toast({
                    title: "Report",
                    description: "Your report has been sent.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                toast({
                    title: "Error while reporting this portfolio",
                    description: error.message || "An unexpected error occurred.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
            onClose();
        } else {
            toast({
                title: "Insert a comment",
                description:"You need to add a comment",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    return (
        <Box>
            <IconButton
                aria-label="Report"
                onClick={() => onOpen()}
                icon={<MdOutlineReport />}
                size="lg"
                bg="red"
                color="white"
                _hover={{
                    color: "lightGray",
                    bg: "darkRed",
                    border: "1px solid red",
                }}
            />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg="brand.secondary.800" color="brand.primary.800">
                    <ModalHeader>
                        Comment your issues with this portfolio
                    </ModalHeader>
                    <ModalBody>
                        <Textarea
                            width="220px"
                            name="comment"
                            placeholder="Type your comment here"
                            value={reportComment}
                            onChange={(e) => setReportComment(e.target.value)}
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
                            Plese do not report something !!!
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={onClose}
                            mr={3}
                        >
                            Cancel
                        </Button>
                        <Button onClick={() => report(reportComment)}>
                            Send report
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default ReportModel;