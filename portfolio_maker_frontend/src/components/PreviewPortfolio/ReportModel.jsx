import * as PropTypes from 'prop-types';
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
        var reportData = {
            id: "1",
            PortfolioId: id,
            comment: reportComment,
        }

        try {
            reportData = await apiClient.get(`https://localhost:7146/api/report/portfolio/${id}`);
        } catch (error) {
            console.error('Failed to fetch reported portfolio:', error);
        }

        if (reportData.id != "1") {
            toast({
                title: "Unable to send report",
                description: "Portfolio is currently being watched",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } else if (reportComment == "") {
            toast({
                title: "Insert a comment",
                description: "You need to add a comment",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } else {
            try {
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
        }
    }

    return (
        <Box>
            <IconButton
                aria-label="Report"
                onClick={() => onOpen()}
                icon={<MdOutlineReport />}
                size="lg"
                fontSize="1.5rem"
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
                        <Text mt={4}>
                            Plese do not report without a valid reason!!!
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

ReportModel.propTypes = {
    id: PropTypes.string.isRequired,
};

export default ReportModel;