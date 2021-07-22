# PairDrop
Fast, easy file transfer with the click of a button! No unnecessary downloads or fees.

## Table of Contents
1. [Introduction](#Intro)
2. [Q/A](#QA)
3. [Technologies Used](#Tech)
4. [Future Work](#Future)

## <a name="Intro">Introduction</a>
PairDrop was made in order to solve the problem of having to email or text message files to myself in order to get files from one device to the other. The other source of inspiration for making this project was to build my portfolio and show what I can do, meaning that at the moment there are no special features that set it apart from any other WebRTC P2P File Transfer Web Apps.

## <a name="QA">Q/A:</a>

Q: Are my files safe? </br>
A: PairDrop uses WebRTC which automatically encrypts your files. WebRTC allows for P2P file transfer, meaning your files are NEVER uploaded to a server or database.

Q: How does PairDrop work? </br>
A: Each user that connects to PairDrop is connected to a signaling, or STUN, server with WebSockets. WebSockets allow for bidirectional communication between the client and the server. STUN servers live on the public internet are used to check the IP Address of an incoming request and send that address back as a response. This process enables a WebRTC peer to get a publicly accessible address for itself and then pass it to another peer through a signaling mechanism in order to set up a direct link. Once a direct link is established, the files are sent from one peer to the other.

Q: How do I use PairDrop to send files to **others**? </br>
A: 
1. Go to PairDrop.
2. Have the person you want to send files to go to PairDrop and tell you their automatically generated username.
3. Look on your device for that username and drag and drop your files, or click on their name and upload the files that way.
4. Click send.
5. Your peer will receive a request that they can accept or decline. If they click Accept they can choose to download the files or ignore them.
6. Done!

Q: How do I use PairDrop to send files to **myself**? </br>
A: 
1. Go to PairDrop on device you want to **send** from.
2. Go to PairDrop on device you want to **receive** from.
3. Click on receiving devices automatically generated username on the sending device and upload files (or drag and drop on their username).
4. Hit send.
5. Click accept on receiving device.
6. Click download.
7. Congrats you are done!

Q: Does this work across devices? </br>
A: PairDrop has been tested to send files from Windows PC to IOS and Android devices, and vice versa, however it should work on any device that can run JavaScript in browser and supports WebRTC.

Q: Which browsers support PairDrop? </br>
A: Tests have been made in Chrome, FireFox and Safari.

## <a name="Tech">Technologies Used</a>
1. React frontend
2. NodeJS backend
3. Socket.io for WebSocket connections
4. simple-peer for WebRTC handling
5. Chakra UI for styling and UI

## <a name="Future">Future Work</a>
Perhaps make PairDrop into a PWA? </br>
Send messages </br>
Send links with auto copy to clipboard
