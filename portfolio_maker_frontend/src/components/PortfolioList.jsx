import * as PropTypes from 'prop-types';
import { useState } from 'react';

import {
    Box,
    Heading,
    Text,
    SimpleGrid,
    IconButton,
    Stack,
    HStack,
    Button,
    Checkbox,
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

import { FaLink } from "react-icons/fa";

import { FaEdit } from "react-icons/fa";

import { IoMdSettings } from "react-icons/io";

import { Link as ReactRouterLink } from 'react-router-dom'

import apiClient from '../axiosConfig';

import PortfolioAnalyticsPanel from './PreviewPortfolio/Analytics/PortfolioAnalyticsPanelComponent'

function PortfolioList({ portfolios, onEditPortfolio }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isPrivate, setIsPrivate] = useState(false);

    const [selectedPortfolio, setSelectedPortfolio] = useState(null);

    const bgColor = {
        reported: "brand.reported.700",
        default: "brand.primary.800",
    };

    const textColor = {
        reported: "brand.reported.600",
        default: "brand.secondary.900",
    };

    const toast = useToast();

    const handleSettingsClick = (portfolio) => {
        setSelectedPortfolio(portfolio);
        setIsPrivate(portfolio.isPublished);

        onOpen();
    };

    const handleChangedSettings = async () => {
        if (selectedPortfolio) {
            try {
                await apiClient.put(`https://localhost:7146/api/portfolio/changePrivacy/${selectedPortfolio.id}/${isPrivate}`);
                toast({
                    title: "Saving changes",
                    description: "Your portfolio specific setting has been saved!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                onClose();
            } catch (error) {
                toast({
                    title: "Error changing privacy",
                    description: error.message || "An unexpected error occurred.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }        
    }

    const handleModalClose = () => {
        setSelectedPortfolio(null);
        onClose();
    };

    const copyToClipboard = async (portfolio) => {
        try {
            await window.navigator.clipboard.writeText(`http://localhost:5173/preview/${portfolio.id}`);
            toast({
                title: "Copy",
                description: "Portfolio link has been saved to clipboard",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (err) {
            console.error(
                "Unable to copy to clipboard.",
                err
            );
            toast({
                title: "Error while copy to clipboard",
                description: err.message || "An unexpected error occurred.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }


    return (
        <div>
            {portfolios.length === 0 ? (
                <p>No portfolios found!</p>
            ) : (
                    <Box p={8}>
                        <SimpleGrid columns={[1, 2, 3]} spacing={8}>
                            {portfolios.map((portfolio, index) => (
                                <Box
                                    key={index}
                                    p={5}
                                    bg={portfolio.isReported ? bgColor.reported : bgColor.default}
                                    color={portfolio.isReported ? textColor.reported : textColor.default}
                                    shadow="md"
                                    borderRadius="md"
                                    position="relative"
                                    _hover={{ shadow: "lg" }}
                                >
                                    <IconButton
                                        aria-label="Settings"
                                        onClick={() => handleSettingsClick(portfolio)}
                                        color={portfolio.isReported ? "brand.reported.600" : "brand.secondary.900" }
                                        icon={<IoMdSettings />}
                                        size="sm"
                                        position="absolute"
                                        top="8px"
                                        right="8px"
                                        bg="transparent"
                                        _hover={{
                                            color: portfolio.isReported ? "yellow" : "brand.secondary.700",
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
                                                    color: portfolio.isReported ? "black" : "white",
                                                }}
                                            >
                                                Link
                                            </ChakraLink>
                                        </HStack>
                                        <Button
                                            bg={portfolio.isReported ? "yellow" : "brand.secondary.800"}
                                            color={portfolio.isReported ? "black" : "brand.primary.800"}
                                            onClick={() => onEditPortfolio(portfolio)}
                                            _hover={{
                                                bg: portfolio.isReported ? "black" : "brand.secondary.700",
                                                color: portfolio.isReported ? "yellow" : "brand.secondary.900",
                                            }}
                                        >
                                            <FaEdit /> Edit
                                        </Button>
                                    </Stack>
                                </Box>
                            ))}
                        </SimpleGrid>

                        <Modal isOpen={isOpen} onClose={onClose} isCentered overflow="overflow">
                            <ModalOverlay />
                            <ModalContent bg="brand.secondary.800" color="brand.primary.800" maxHeight="70vh" overflow="auto">
                                <ModalHeader>
                                    Specific settings for portfolio
                                </ModalHeader>
                                <ModalBody
                                    display="flex"
                                    flexDirection="column"
                                >
                                    <Checkbox
                                        isChecked={isPrivate}
                                        onChange={(e) => setIsPrivate(e.target.checked)}
                                        sx={{
                                            ".chakra-checkbox__control": {
                                                bg: "white",
                                                borderColor: "whiteAlpha.800",
                                                _checked: {
                                                    bg: "white",
                                                    borderColor: "white",
                                                    color: "black",
                                                },
                                                _hover: {
                                                    bg: "whiteAlpha.800",
                                                },
                                                _focus: {
                                                    boxShadow: "none",
                                                },
                                            },
                                        }}
                                    >
                                        Make portfolio private
                                    </Checkbox>
                                    <Button
                                        p={4}
                                        mt={3}
                                        width="fit-content"
                                        onClick={() => copyToClipboard(selectedPortfolio)}
                                    >
                                    Copy link
                                    </Button>
                                    {selectedPortfolio && selectedPortfolio.id && (
                                        <PortfolioAnalyticsPanel portfolioId={selectedPortfolio.id} />
                                    )}
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        onClick={handleModalClose}
                                        mr={3}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={() => handleChangedSettings()}>
                                        Save
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </Box>
            )}
        </div>
    );
}

PortfolioList.propTypes = {
    portfolios: PropTypes.array.isRequired,
    reportedPortfolios: PropTypes.array.isRequired,
    onEditPortfolio: PropTypes.func.isRequired,
};

export default PortfolioList;