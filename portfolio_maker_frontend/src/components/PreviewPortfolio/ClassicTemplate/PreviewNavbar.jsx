import { Box, Flex, HStack, Button, Heading } from "@chakra-ui/react";

function PreviewNavbar({ activeSection, onNavigate }) {
  return (
      <Box
          as="nav"
          bg="brand.secondary.800"
          color="brand.primary.800"
          px={4}
          py={2}
          boxShadow="md"
          position="sticky"
          top="0"
          zIndex="1000"
          width="100%"
      >
          <Flex
              as="nav"
              position="sticky"
              top="0"
              boxShadow="sm"
              zIndex="1000"
              p={{ base: 4, md: 6 }}
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              fontFamily="'Playfair Display', serif"
          >
              <Heading
                  fontSize={{ base: "lg", md: "3xl" }}
                  fontFamily="'Playfair Display', serif"
              >
                  Portfolio Maker
              </Heading>
              <HStack spacing={4}>
                  {["about", "experience", "projects", "contact"].map((section) => (
                      <Button
                          key={section}
                          variant={activeSection === section ? "solid" : "ghost"}
                          onClick={() => onNavigate(section)}
                          _hover={
                              activeSection === section
                                  ? { bg: "brand.secondary.800", color: "brand.primary.700", border: "1px solid", borderColor: "brand.primary.700" }
                                  : { bg: "transparent", color: "brand.primary.700", border: "1px solid", borderColor: "brand.primary.700" }
                          }
                      >
                          {section.charAt(0).toUpperCase() + section.slice(1)}
                      </Button>
                  ))}
              </HStack>
          </Flex>
      </Box>
  );
}

export default PreviewNavbar;