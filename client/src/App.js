import './App.css';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';
import Header from './Header'
import { Heading, Box, Center, Text, Modal, ModalContent, ModalOverlay, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Image, Spinner, Button, ButtonGroup } from "@chakra-ui/react"
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
  const [fileName, setFileName] = useState("");

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
      { urls: "turn:192.158.29.39:3478?transport=tcp",
        credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
        username: "28224511:1379330808"
      }
    ]
  }
  const SERVER_URL = "https://pairdrop.xyz";
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
      console.log(data.toString());
      if (data.toString() === "EOF") {
        const file_blob = new Blob(fileChunks);
        setReceivedFilePreview(URL.createObjectURL(file_blob));
        setReceiving(false);
      } else {
        fileChunks.push(data);
      }
      let lastItem = fileChunks[fileChunks.length - 1];
      let file_name = lastItem.toString();
      setFileName(file_name);
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
      let filename = file.name;
      while (buffer.byteLength) {
        const chunk = buffer.slice(0, chunkSize);
        buffer = buffer.slice(chunkSize, buffer.byteLength);

        peer.send(chunk);
      }
      peer.send("EOF");
      peer.send(filename);
      setSending(false);
    });
    peerInstance.current = peer;
  };
  useEffect(() => () => {
    URL.revokeObjectURL(receivedFilePreview);
  },[receivedFilePreview]);
  const downloadFile = () => {
    var anchor = document.createElement("a");
    anchor.setAttribute("href", receivedFilePreview);
    anchor.setAttribute("download", fileName);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
  const modalClose = () => {
    if (!sending || !receiving || !sentRequest || !requested)
      setReceivedFilePreview("");
    setRejected(false);
  }
  return (
    <div className="App">
      <Header />
      <Heading className="username-header">
        <Center className="username-div">
          Others will see you as:
        </Center>
      </Heading>
      <Heading style={{color: "#6A4DF4", fontWeight:"bolder"}} p={5}>
        <Center>
          {myUsername}
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
      <Modal isCentered isOpen={receivedFilePreview !== "" || sending || receiving || sentRequest || rejected || requested} onClose={modalClose}>
          <ModalOverlay />
          <ModalContent>
            {requested &&
            <>
              <ModalHeader>File Transfer Request</ModalHeader>
              <ModalBody>
                <ShareRequest acceptRequest={acceptRequest} rejectRequest={rejectRequest} peerUsername={peerUsername}/>
              </ModalBody>
            </>
            }
            {(sending || receiving || sentRequest) &&
              <ModalBody>
                <Spinner
                  thickness="4px"
                  speed="0.75s"
                  emptyColor="gray.200"
                  color="#6A4DF4"
                  size="xl"
                />
              </ModalBody>
            }
            {rejected &&
            <>
              <ModalBody>{`${peerUsername} rejected your request, sorry!`}</ModalBody>
              <ModalFooter>
                <Button onClick={modalClose}>Close</Button>
              </ModalFooter>
            </>
            }
            {receivedFilePreview &&
              <>
                <ModalHeader>{peerUsername} has sent you a file: {fileName}</ModalHeader>
                <ModalBody>
                  <Image maxWidth src={receivedFilePreview} />
                </ModalBody>
                <ModalFooter>
                  <ButtonGroup variant="solid" space={6}>
                    <Button onClick={modalClose}>Ignore</Button>
                    <Button onClick={downloadFile}>Download</Button>
                  </ButtonGroup>
                </ModalFooter>
              </>
            }
          </ModalContent>
      </Modal>
    </div>
  );
}

export default App;
