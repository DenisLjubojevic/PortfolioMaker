import * as PropTypes from 'prop-types';
import { useState } from 'react';

import {
    Box,
    Heading,
    Text,
    SimpleGrid,
    HStack,
    IconButton,
    Stack,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    useToast,
    Link as ChakraLink,
} from '@chakra-ui/react';

import { TbListDetails } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

import { Link as ReactRouterLink } from 'react-router-dom';

import { FaLink } from "react-icons/fa";

import apiClient from '../axiosConfig';

import MessageModel from './MessageModel';

function AdminPortfolioListComponent({ portfolios, onReportRemoved }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [selectedPortfolio, setSelectedPortfolio] = useState(null);

    const [selectedReport, setSelectedReport] = useState({
        id: '',
        portfolioId: '',
        comment: '',
    });

    const toast = useToast();

    const handleReportDeatils = async (portfolio) => {
        setSelectedPortfolio(portfolio);
        await fetchPortfolioReport(portfolio.id);
        onOpen();
    };

    const fetchPortfolioReport = async (portfolioId) => {
        try {
            const response = await apiClient.get(`https://localhost:7146/api/report/portfolio/${portfolioId}`);
            setSelectedReport(response.data);
        } catch (error) {
            console.error('Failed to fetch reported portfolio:', error);
        }
    }

    const handleDeletePortfolio = async (portfolio) => {
        console.log("DELETING...");
    }

    const handleRemoveReport = async (portfolio) => {
        try {
            await apiClient.delete(`https://localhost:7146/api/report/delete/${portfolio.id}`);
            toast({
                title: "Report",
                description: "Report has been removed from this portfolio!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            if (onReportRemoved) {
                onReportRemoved();
            }
        } catch (error) {
            console.error('Failed to remove report from portfolio, ', error);
        }
    }


    return (
        <div>
            {portfolios.length === 0 ? (
                <p>No portfolios found!</p>
            ) : (
                <Box p={8}>
                    <SimpleGrid columns={[1, 2, 3]} spacing={9}>
                        {portfolios.map((portfolio, index) => (
                            <Box
                                key={index}
                                p={5}
                                bg="brand.primary.800"
                                color="brand.secondary.800"
                                shadow="md"
                                borderRadius="md"
                                position="relative"
                                _hover={{ shadow: "lg" }}
                            >
                                <IconButton
                                    aria-label="Report"
                                    onClick={() => handleReportDeatils(portfolio)}
                                    icon={<TbListDetails />}
                                    size="sm"
                                    position="absolute"
                                    top="8px"
                                    right="8px"
                                    bg="transparent"
                                    _hover={{
                                        color: "brand.secondary.700",
                                        bg: "transparent",
                                        border: "none",
                                    }}
                                />
                                <Stack>

                                    <Heading as="h3" size="md">
                                        {portfolio.name}
                                    </Heading>

                                    <Text>{portfolio.description}</Text>
                                    <HStack
                                        fontStyle="italic"
                                        width="fit-content"
                                        margin="0 auto"
                                    >
                                        <FaLink />
                                        <ChakraLink
                                            as={ReactRouterLink}
                                            target="_blank"
                                            to={`/preview/${portfolio.id}`}
                                            _hover={{
                                                textDecoration: "none",
                                                color: "white"
                                            }}
                                        >
                                            Link
                                        </ChakraLink>
                                    </HStack>
                                    <HStack
                                    >
                                        <IconButton
                                            aria-label="Remove"
                                            onClick={() => handleRemoveReport(portfolio)}
                                            icon={<FaCheck />}
                                            size="sm"
                                            width="45%"
                                            bg="green"
                                            color="white"
                                            _hover={{
                                                color: "lightGray",
                                                bg: "darkGreen",
                                                border: "1px solid black",
                                            }}
                                        />

                                        <IconButton
                                            aria-label="Delete"
                                            onClick={() => handleDeletePortfolio(portfolio)}
                                            icon={<MdDeleteForever />}
                                            size="sm"
                                            width="45%"
                                            bg="red"
                                            color="white"
                                            _hover={{
                                                color: "lightGray",
                                                bg: "darkRed",
                                                border: "1px solid black",
                                            }}
                                        />
                                    </HStack>
                                </Stack>
                            </Box>
                        ))}
                    </SimpleGrid>

                    <Modal isOpen={isOpen} onClose={onClose} isCentered>
                        <ModalOverlay />
                        <ModalContent bg="brand.secondary.800" color="brand.primary.800">
                            <ModalHeader>
                                Report details
                            </ModalHeader>
                            <ModalBody>
                                    <Text> Comment: {selectedReport.comment} </Text>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    onClick={onClose}
                                    mr={3}
                                >
                                    Close
                                </Button>
                                <MessageModel
                                    portfolio={selectedPortfolio}
                                />
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Box>
            )}
        </div>
    );
}

AdminPortfolioListComponent.propTypes = {
    portfolios: PropTypes.array.isRequired,
    onReportRemoved: PropTypes.func.isRequired,
};

export default AdminPortfolioListComponent;