import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { config, baseUrl } from "../config";
import { useHistory, useParams } from "react-router-dom";

import "./styles.scss";
const Monitoring = () => {
  const params = useParams();
  const socketRef = useRef();
  const peerConnections = {};
  const [openVideo, setOpenVideo] = useState(false);
  const history = useHistory();
  const connectionHandler = async () => {
    socketRef.current = await io.connect(baseUrl);

    socketRef.current.on("answer", (id, description) => {
      peerConnections[id].setRemoteDescription(description);
    });

    socketRef.current.on("watcher", (id) => {
      const peerConnection = new RTCPeerConnection(config);
      peerConnections[id] = peerConnection;

      let stream = videoElement.srcObject;
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit("candidate", id, event.candidate);
        }
      };

      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socketRef.current.emit("offer", id, peerConnection.localDescription);
        });
    });

    socketRef.current.on("candidate", (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });
    console.log(peerConnections);

    socketRef.current.on("disconnectPeer", (id) => {
      peerConnections[id].close();
      delete peerConnections[id];
    });

    window.onunload = window.onbeforeunload = () => {
      socketRef.current.close();
    };

    // Get camera and microphone
    const videoElement = document.querySelector("video");
    const videoSelect = document.querySelector("select#videoSource");

    videoSelect.onchange = getStream;

    getStream().then(getDevices).then(gotDevices);

    function getDevices() {
      return navigator.mediaDevices.enumerateDevices();
    }

    function gotDevices(deviceInfos) {
      window.deviceInfos = deviceInfos;
      for (const deviceInfo of deviceInfos) {
        const option = document.createElement("option");
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === "videoinput") {
          option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
          videoSelect.appendChild(option);
        }
      }
    }

    function getStream() {
      if (window.stream) {
        window.stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      const videoSource = videoSelect.value;
      const constraints = {
        video: { deviceId: videoSource ? { exact: videoSource } : undefined },
      };
      return navigator.mediaDevices
        .getUserMedia(constraints)
        .then(gotStream)
        .catch(handleError);
    }

    function gotStream(stream) {
      window.stream = stream;

      videoSelect.selectedIndex = [...videoSelect.options].findIndex(
        (option) => option.text === stream.getVideoTracks()[0].label
      );
      videoElement.srcObject = stream;
      socketRef.current.emit("broadcaster");
    }

    function handleError(error) {
      console.error("Error: ", error);
    }
  };
  useEffect(() => {
    connectionHandler();
  });

  const openVideoHandler = () => {
    setOpenVideo(!openVideo);
  };

  return (
    <div className="monitoring-container">
      <section className="select">
        <label for="videoSource">Video source: </label>
        <select id="videoSource"></select>
      </section>
      <div className="video-container">
        <video
          playsInline
          autoPlay
          muted
          className={`video-monitoring ${openVideo && "open-video"}`}
        ></video>
        <div
          className={`button-container__monitoring ${
            !openVideo && "button-container__monitoring-static"
          }`}
        >
          <div className="hide-button">
            {openVideo ? (
              <i class="fas fa-minus" onClick={openVideoHandler}></i>
            ) : (
              <i class="fas fa-video" onClick={openVideoHandler}></i>
            )}
          </div>
          <div className="close-button">
            <i
              class="fas fa-times"
              onClick={() => history.push("/appointment")}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
