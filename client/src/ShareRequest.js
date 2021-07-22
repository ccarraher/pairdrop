import React from 'react'
import { Box, Avatar, ButtonGroup, Button, HStack, Spacer } from '@chakra-ui/react';

export default function ShareRequest({peerUsername, acceptRequest, rejectRequest}) {
    return (
        <Box borderRadius="lg" maxW="md">
            <HStack>
                <Avatar name={peerUsername} />
                <Box mt="1" fontWeight="semibold" as="h4">
                    {peerUsername} wants to send you a file
                </Box>
            </HStack>
            <Spacer p={2}/>
            <Box>
                <ButtonGroup variant="solid" spacing={6}>
                    <Button colorScheme="green" onClick={acceptRequest}>Accept</Button>
                    <Button colorScheme="red" onClick={rejectRequest}>Reject</Button>
                </ButtonGroup>
            </Box>
        </Box>
    )
}
