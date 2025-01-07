import { Box, Flex, Spacer, Button, Heading } from "@chakra-ui/react";

function PreviewNavbar({ onNavigate }) {
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
          <Flex alignItems="center" justifyContent="space-between" width="100%">
              <Heading as="h1" size="lg">
                  Portfolio Maker
              </Heading>
              <Spacer />
              <Flex alignItems="center" gap={4}>
                  <Button onClick={() => onNavigate("about")}>About</Button>
                  <Button onClick={() => onNavigate("projects")}>Projects</Button>
                  <Button onClick={() => onNavigate("contact")}>Contact</Button>
              </Flex>
          </Flex>
      </Box>
  );
}

export default PreviewNavbar;