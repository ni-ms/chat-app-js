import { useEffect, useRef, useState } from 'react';
import type Peer from 'peerjs';

function VideoChat() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string>('');
  const [isWaiting, setIsWaiting] = useState(true);
  const [error, setError] = useState<string>('');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const loadPeerJS = async () => {
      try {
        const { default: PeerJS } = await import('peerjs');
        const newPeer = new PeerJS();
        setPeer(newPeer);
        setIsLoaded(true);
      } catch (err) {
        console.error('Failed to load PeerJS:', err);
        setError('Failed to initialize video chat');
      }
    };

    loadPeerJS();
  }, []);

  const setupLocalStream = async () => {
    if (!isLoaded) return null;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      setError('Failed to access camera and microphone');
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    if (!peer || !isLoaded) return;

    peer.on('open', (id) => {
      setPeerId(id);
    });

    peer.on('call', async (call) => {
      const stream = localStreamRef.current || await setupLocalStream();
      if (!stream) return;
      
      call.answer(stream);
      call.on('stream', (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          setIsWaiting(false);
        }
      });

      call.on('close', () => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
        setIsWaiting(true);
      });
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
      setError('Connection error occurred');
    });

    return () => {
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peer.destroy();
    };
  }, [peer, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setupLocalStream();
    }
  }, [isLoaded]);

  const handleNext = async () => {
    setIsWaiting(true);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    // Implement peer finding logic here
  };

  if (!isLoaded) {
    return <div>Loading video chat...</div>;
  }

  return (
    <div className="video-chat">
      {error && <div className="error-message">{error}</div>}
      <div className="videos">
        <div className="video-container">
          <video ref={localVideoRef} autoPlay playsInline muted />
          <span>You</span>
        </div>
        <div className="video-container">
          <video ref={remoteVideoRef} autoPlay playsInline />
          <span>{isWaiting ? 'Waiting for partner...' : 'Stranger'}</span>
        </div>
      </div>
      <button onClick={handleNext} className="next-button">
        Next
      </button>

      <style>{`
        .video-chat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 20px;
        }

        .videos {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .video-container {
          position: relative;
          width: 400px;
          max-width: 100%;
        }

        video {
          width: 100%;
          border-radius: 8px;
          background: #1a1a1a;
        }

        span {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .next-button {
          padding: 10px 20px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.3s;
        }

        .next-button:hover {
          background: #45a049;
        }

        .error-message {
          background: #ff5252;
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}

export default VideoChat;