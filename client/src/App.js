import './App.css';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';
import Header from './Header'
import { Heading, Box, Center, Text, Modal, ModalContent, ModalOverlay, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, useToast, Image } from "@chakra-ui/react"
import PeerAvatar from './PeerAvatar';
import ShareRequest from './ShareRequest';

function App() {
  const [requested, setRequested] = useState(false);
  const [sentRequest, setSentRequest] = useState(false);
  const [sending, setSending] = useState(false);
  const [receiving, setReceiving] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myUsername, setMyUsername] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [peerUsername, setPeerUsername] = useState("");
  const [peerSignal, setPeerSignal] = useState("");
  const [file, setFile] = useState(null);
  const [receivedFilePreview, setReceivedFilePreview] = useState("");
  const socket = useRef();
  const { isOpen, onOpen, onClose} = useDisclosure()
  const toast = useToast();

  const peerInstance = useRef();

  const SOCKET_EVENT = {
    CONNECTED: "connected",
    DISCONNECTED: "disconnect",
    USERS_LIST: "users_list",
    REQUEST_SENT: "request_sent",
    REQUEST_ACCEPTED: "request_accepted",
    REQUEST_REJECTED: "request_rejected",
    SEND_REQUEST: "send_request",
    ACCEPT_REQUEST: "accept_request",
    REJECT_REQUEST: "reject_request"
  };

  const peerConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:19302" }
    ]
  }
  const SERVER_URL = "https://fierce-plains-31659.herokuapp.com/";
  useEffect(() => {
    socket.current = io.connect(SERVER_URL);

    socket.current.on(SOCKET_EVENT.CONNECTED, username => {
      setMyUsername(username);
    });

    socket.current.on(SOCKET_EVENT.USERS_LIST, users => {
      setUsersList(users);
    });

    socket.current.on(SOCKET_EVENT.REQUEST_SENT, ({signal, username}) => {
      setPeerUsername(username);
      setPeerSignal(signal);
      setRequested(true);
    });

    socket.current.on(SOCKET_EVENT.REQUEST_ACCEPTED, ({signal}) => {
      peerInstance.current.signal(signal);
    });

    socket.current.on(SOCKET_EVENT.REQUEST_REJECTED, () => {
      setSentRequest(false);
      setRejected(true);
    });

  }, [])

  const acceptRequest = () => {
    setRequested(false);
    const peer = new Peer({
      initiator: false,
      trickle: false
    });
    peer.on("signal", data => {
      socket.current.emit(SOCKET_EVENT.ACCEPT_REQUEST, {
        signal: data,
        to: peerUsername
      });
    });
    peer.on("connect", () => {
      setReceiving(true);
    });
    const fileChunks = [];
    peer.on("data", data => {
      if (data.toString() === "EOF") {
        const file = new Blob(fileChunks);
        setReceivedFilePreview(URL.createObjectURL(file));
        setReceiving(false);
      } else {
        fileChunks.push(data);
      }
    });
    peer.signal(peerSignal);
    peerInstance.current = peer;
  };

  const rejectRequest = () => {
    socket.current.emit(SOCKET_EVENT.REJECT_REQUEST, {to: peerUsername});
    setRequested(false);
  };

  const sendRequest = username => {
    setLoading(true);
    setPeerUsername(username);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: peerConfig
    });
    peer.on("signal", data => {
      socket.current.emit(SOCKET_EVENT.SEND_REQUEST, {
        to: username,
        signal: data,
        username: myUsername
      });
      setSentRequest(true);
      setLoading(false);
    });
    peer.on("connect", async () => {
      setSending(true);
      setSentRequest(false);
      let buffer = await file.arrayBuffer();
      const chunkSize = 16 * 1024;
      while (buffer.byteLength) {
        const chunk = buffer.slice(0, chunkSize);
        buffer = buffer.slice(chunkSize, buffer.byteLength);

        peer.send(chunk);
      }
      peer.send("EOF");
      setSending(false);
    });
    peerInstance.current = peer;
  };
  useEffect(() => () => {
      URL.revokeObjectURL(receivedFilePreview);
    },[receivedFilePreview]);
  
  return (
    <div className="App">
      <Header />
      <Heading className="username-header" p={20}>
        <Center className="username-div">
          Others will see you as: <span style={{color: "#6A4DF4", fontWeight: "bolder"}}>{myUsername}</span>
        </Center>
      </Heading>
      <Box>
        <Center>
          <Heading size="lg" style={{opacity: 0.5}}>Drag and drop or click on a user to send a file</Heading>
        </Center>
        {usersList.length > 1 ? usersList.map(({username, timestamp}) => username !== myUsername &&
          <PeerAvatar key={username} myUsername={username} timestamp={timestamp} sendRequest={sendRequest} disabled={!file || loading} setFile={setFile}/>
          ) :
          <Text>
            <Center>
              Open PairDrop on another device to send files!
            </Center>
          </Text>
        }
      </Box>
      <Modal isOpen={isOpen} onOpen={receivedFilePreview !== "" || sending || receiving || sentRequest || rejected || requested} 
        onClose={() => {
          if (!sending || !receiving || !sentRequest || !requested)
            setReceivedFilePreview("");
          setRejected(false);
        }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Request sent</ModalHeader>
            {requested &&
            <ShareRequest acceptRequest={acceptRequest} rejectRequest={rejectRequest} peerUsername={peerUsername} />
            }
            {rejected &&
            <ModalBody>{`${peerUsername} rejected your request, sorry!`}</ModalBody>
            }
            {receivedFilePreview &&
              toast({
                title: "Successfully received",
                description: `${peerUsername} sent you a file`,
                status: "success",
                duration: 6000,
                isClosable: true,
              }),
              <Box>
                <Image src={receivedFilePreview} />
              </Box>
            }
          </ModalContent>
      </Modal>
    </div>
  );
}

export default App;