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
  IconButton,
  Link
} from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import ThemeToggle from "./ThemeToggle";
import { RiGithubFill } from 'react-icons/ri'
import InfoModal from "./Modal"
import {RiMoneyDollarCircleLine} from "react-icons/ri"


const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex>
        <HStack spacing="1px" p={2}>
            <Box>
                <LinkIcon w={10} h={10}/>
            </Box>
            <Box>
                <Heading size="lg">Pair<span style={{color: "#6A4DF4"}}>Drop</span></Heading>
            </Box>
        </HStack>
        <Spacer />
        <Box>
            <ThemeToggle/>
            <Link href="https://github.com/ccarraher/pairdrop/">
              <IconButton
                icon={<Icon w={8} h={8} as={RiGithubFill} />}
                size="lg"
                aria-label="github"
                variant="ghost"
              />
            </Link>
            <InfoModal />
            <Link href="https://www.paypal.com/donate?business=QRR8PJ3CZ2TXE&no_recurring=0&item_name=Help+pay+server+costs+and+development+time&currency_code=USD">
              <IconButton 
                icon={<Icon w={9} h={9} as={RiMoneyDollarCircleLine} />}
                aria-label="Donate"
                name="Help with server costs!"
                variant="ghost"
                size="lg"                        
              />
            </Link>
        </Box>
    </Flex>
  );
};

export default Header;