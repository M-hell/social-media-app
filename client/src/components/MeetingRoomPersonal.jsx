import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import logo from '../assets/logo.png';

function MeetingRoomPersonal() {
  const { roomId } = useParams();
  const userId = useSelector((state) => state?.user?._id);
  const name = useSelector((state) => state?.user?.name);
  const containerRef = useRef(null);

  const setupMeeting = async () => {
    if (containerRef.current && userId && name && roomId) {
      const appID = 490540697;
      const serverSecret = '7f48666ec7aae92c009c6a8c7681b446';
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        userId,
        name
      );

      const zc = ZegoUIKitPrebuilt.create(kitToken);

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
      });
    }
  };

  useEffect(() => {
    setupMeeting();
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
