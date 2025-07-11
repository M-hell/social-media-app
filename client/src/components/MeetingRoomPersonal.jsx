import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

function MeetingRoomPersonal() {
  const { roomId } = useParams(); // ✅ Correct way to get roomId
  const userId = useSelector((state) => state?.user?._id);
  const name = useSelector((state) => state?.user?.name);
  const containerRef = useRef(null);

  const setupMeeting = async () => {
    if (containerRef.current && userId && name && roomId) {
      const appID = 2015637161;
      const serverSecret = 'd1526bf4083e6756136e958c1323caab';
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
      });
    }
  };

  useEffect(() => {
    setupMeeting();
  }, [roomId, userId, name]);

  return (
    <div
      className='meeting-room-overlay'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 1)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default MeetingRoomPersonal;
