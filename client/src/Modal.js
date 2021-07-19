import React from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure, Button, IconButton, Heading } from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons'

export default function InfoModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <IconButton
                icon={<InfoOutlineIcon w={7} h={7}/>}
                size="lg"
                aria-label="info"
                variant="ghost" 
                onClick={onOpen}
            />
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>PairDrop</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Heading>
                        Free, easy file transfer across networks.
                    </Heading>
                    <br></br>
                    PairDrop uses WebRTC, which automatically encrypts your data, so your files are safe.
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Close</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}