import React from 'react'
import Emoji from './Emoji'
import {Heading} from '@chakra-ui/react'

export default function PeerAvatar({myUsername, timestamp, sendRequest, disabled}) {
    return (
        <div>
            <Emoji />
            <Heading>
                {myUsername}
            </Heading>
        </div>
    )
}