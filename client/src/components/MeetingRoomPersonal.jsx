import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function MeetingRoomPersonal() {
  const { roomId } = useParams();
  const userId = useSelector((state) => state?.user?._id);
  const name = useSelector((state) => state?.user?.name);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const zcInstanceRef = useRef(null);

  const setupMeeting = async () => {
    if (containerRef.current && userId && name && roomId) {
      // Clear any existing instance first to prevent blank screen
      if (zcInstanceRef.current) {
        try {
          zcInstanceRef.current.destroy();
        } catch (error) {
          console.log('Previous instance cleanup:', error);
        }
        zcInstanceRef.current = null;
      }

      // Clear the container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      const appID = parseInt(import.meta.env.VITE_REACT_APP_ZEGO_APPID);
      const serverSecret = import.meta.env.VITE_REACT_APP_ZEGO_SECRET;
      console.log('App ID:', appID, 'Server Secret:', serverSecret, 'Room ID:', roomId, 'User ID:', userId, 'Name:', name);
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        userId,
        name
      );

      const zc = ZegoUIKitPrebuilt.create(kitToken);
      zcInstanceRef.current = zc;

      zc.joinRoom({
        container: containerRef.current,
        sharedLinks: [
          {
            name: 'Copy Room Id',
            url: `${roomId}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        showScreenSharingButton: true,
        // Enhanced UI settings for premium look
        turnOnCameraWhenJoining: true,
        turnOnMicrophoneWhenJoining: true,
        showUserList: true,
        showPreJoinView: false,
        branding: {
          logoURL: logo,
          logoClickable: false,
        },
        layout: "Auto",
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showTextChat: true,
        showLayoutButton: true,
        // Dark mode glassmorphism overlay
        theme: 'dark',
        onLeaveRoom: () => {
          navigate('/');
        },
      });
    }
  };

  useEffect(() => {
    setupMeeting();
    
    // Cleanup function to prevent memory leaks
    return () => {
      if (zcInstanceRef.current) {
        try {
          zcInstanceRef.current.destroy();
        } catch (error) {
          console.log('Cleanup error:', error);
        }
        zcInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [roomId, userId, name]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-[1001] bg-gradient-to-br from-[#171325] via-[#191a30] to-black"
      style={{
        background:
          'radial-gradient(at 22% 18%,rgba(91,64,186,0.16) 0,transparent 72%), ' +
          'radial-gradient(at 80% 26%,rgba(255,156,92,0.10) 0,transparent 68%), ' +
          'radial-gradient(at 50% 108%,rgba(232,197,255,0.08) 0,transparent 60%), ' +
          'radial-gradient(at 90% 95%,rgba(56,179,247,0.12) 0,transparent 55%), ' +
          'linear-gradient(135deg,#161537 0%,#181a28 100%)',
      }}
    >
      <div
        ref={containerRef}
        className="w-full h-full shadow-2xl rounded-xl ring-1 ring-white/10 overflow-hidden"
        style={{
          background: 'transparent',
          minHeight: '100vh',
          minWidth: '100vw',
        }}
      />
    </div>
  );
}

export default MeetingRoomPersonal;