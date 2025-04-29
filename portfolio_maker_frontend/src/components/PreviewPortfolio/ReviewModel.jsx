import * as PropTypes from 'prop-types';
import { useState } from 'react';

import {
    Box,
    Button,
    IconButton,
    Textarea,
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

import StarRating from './StarRating';

import { FaStar } from "react-icons/fa";

function ReviewModel({ portfolioId }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [reviewComment, setReviewComment] = useState("");
    const [mark, setMark] = useState(0);

    const toast = useToast();

    const review = async () => {
        var userId = localStorage.getItem("userId");
        var reviewData = {
            Id: "1",
            PortfolioId: portfolioId,
            UserId: userId,
            Mark: mark,
            Comment: reviewComment,
        }

        var userReviews = null;

        try {
            var result = await apiClient.get(`https://localhost:7146/api/review/user/${userId}/portfolio/${portfolioId}`);
            if (result.data.length > 0) userReviews = result;
        } catch (error) {
            console.error('Failed to fetch reported portfolio:', error);
        }

        if (userReviews != null) {
            toast({
                title: "Unable to add a review",
                description: "You have already made a review of this portfolio!",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        } else if (reviewComment == "") {
            toast({
                title: "Insert a comment",
                description: "You need to add a comment",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        } else if (!mark) {
            toast({
                title: "Select a star rating",
                description: "You need to select a star rating!",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        } else {
            try {
                await apiClient.post('https://localhost:7146/api/review/create', {
                    ...reviewData
                });
                toast({
                    title: "Review",
                    description: "Your review has been sent.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                toast({
                    title: "Error while sending a review",
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
                aria-label="Review"
                onClick={() => onOpen()}
                icon={<FaStar />}
                size="lg"
                fontSize="1.5rem"
                bg="#ffe333"
                color="#e69c24"
                _hover={{
                    color: "yellow",
                    bg: "#d5bd2b",
                    border: "1px solid yellow",
                }}
            />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg="brand.secondary.800" color="brand.primary.800">
                    <ModalHeader>
                        Leave your review here
                    </ModalHeader>
                    <ModalBody>
                        <StarRating
                            rating={mark}
                            onChange={setMark}
                        ></StarRating>
                        
                        <Textarea
                            width="220px"
                            name="comment"
                            placeholder="Type your comment here"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            mt={2}
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
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={onClose}
                            mr={3}
                        >
                            Cancel
                        </Button>
                        <Button onClick={() => review(reviewComment)}>
                            Confirm review
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

ReviewModel.propTypes = {
    portfolioId: PropTypes.string.isRequired,
};

export default ReviewModel;