import React from 'react'
import {Heading, Box, Avatar, Center, Spacer, Button} from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import {useDropzone} from 'react-dropzone'

export default function PeerAvatar({myUsername, timestamp, sendRequest, disabled, setFile}) {
    const [filePreview, setFilePreview] = useState("");
    const {getRootProps, getInputProps} = useDropzone({
        multiple: true,
        accept: 'video/*, image/*, audio/*, .pdf, .doc, .docx',
        onDropAccepted: acceptedFiles => {
            setFile(acceptedFiles[0]);
            setFilePreview(URL.createObjectURL(acceptedFiles[0]));
        },
    });
    const handleSendRequest = (e) => {
        e.stopPropagation();
        sendRequest(myUsername);
        console.log("Request sent!");
    }
    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        URL.revokeObjectURL(filePreview)
    }, [filePreview]);
    return (
        <div>
            <Center>
                    <Box boxShadow="base" borderWidth={1} display={{ md: "flex" }} maxWidth="32rem" margin={2} p={4} borderRadius="30px" _hover={{backgroundColor: "#EDF2F7", cursor: "pointer"}}>
                        <div {...getRootProps({className: 'dropzone'})}>
                            <Avatar name={myUsername} />
                            <Spacer p={2}/>
                            <Heading>
                                {myUsername}
                            </Heading>
                            {typeof sendRequest === "function" &&
                            <Button disabled={disabled} id="send-button" variant="solid" size="lg" style={{backgroundColor: "#6A4DF4"}} onClick={handleSendRequest}>Send</Button>}
                            <input {...getInputProps()}/>
                        </div>
                    </Box>
            </Center>
        </div>
    )
}