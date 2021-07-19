import React from "react";
import {
  Box,
  HStack,
  Heading,
  Flex,
  Icon,
  Button,
  useDisclosure,
  Spacer,
  IconButton
} from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import ThemeToggle from "./ThemeToggle";
import { RiGithubFill } from 'react-icons/ri'
import InfoModal from "./Modal"


const Header = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  

  return (
    <Flex>
        <HStack spacing="1px" p={2}>
            <Box>
                <LinkIcon w={10} h={10}/>
            </Box>
            <Box>
                <Heading size="lg">PairDrop</Heading>
            </Box>
        </HStack>
        <Spacer />
        <Box>
            <ThemeToggle />
            <IconButton
            icon={<Icon w={8} h={8} as={RiGithubFill} />}
            size="lg"
            aria-label="github"
            variant="ghost"
            />
            <InfoModal />
        </Box>
    </Flex>
  );
};

export default Header;