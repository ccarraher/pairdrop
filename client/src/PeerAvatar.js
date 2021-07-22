import React from 'react'
import {Heading, Box, Avatar, Center, HStack, Button, Spacer, useColorMode} from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react';
import {useDropzone} from 'react-dropzone'
import { RiLineChartLine } from 'react-icons/ri';

export default function PeerAvatar({myUsername, timestamp, sendRequest, disabled, setFile, setFileName}) {
    const [filePreview, setFilePreview] = useState("");
    const [fName, setFName] = useState("");
    const {getRootProps, getInputProps} = useDropzone({
        multiple: true,
        accept: 'video/*, image/*, audio/*, .pdf, .doc, .docx',
        onDropAccepted: acceptedFiles => {
            setFile(acceptedFiles[0]);
            setFilePreview(URL.createObjectURL(acceptedFiles[0]));
            setFName(acceptedFiles[0].name);
        },
    });
    const handleSendRequest = (e) => {
        e.stopPropagation();
        sendRequest(myUsername);
    }
    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        URL.revokeObjectURL(filePreview)
    }, [filePreview]);
    return (
        <div>
            <Center>
                    <Box boxShadow="base" borderWidth={1} display={{ md: "flex" }} maxWidth="32rem" margin={2} p={4} borderRadius="30px">
                        <div {...getRootProps({className: 'dropzone'})}>
                            <HStack _hover={{opacity: 0.5, cursor: "pointer"}}>
                                <Avatar name={myUsername} />
                                <Heading>
                                    {myUsername}
                                </Heading>
                            </HStack>
                            <Spacer p={2}/>
                            <HStack>
                                {typeof sendRequest === "function" &&
                                    <Button disabled={disabled} id="send-button" variant="solid" size="sm" width="inherit" style={{backgroundColor: "#6A4DF4"}} onClick={handleSendRequest}>Send</Button>}
                                <div>{fName}</div>
                            </HStack>
                            <input {...getInputProps()}/>
                        </div>
                    </Box>
            </Center>
        </div>
    )
}