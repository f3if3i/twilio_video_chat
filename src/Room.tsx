import { Box, Button, Flex, Heading, Spacer, Stack } from '@chakra-ui/react';
import { css } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';
import './App.css';

type RoomProps = {
    roomName: string,
    token: string,
    handleLogout: (event: any) => void
}

export type ParticipantType = {
    sid: any,
    identity: any
}

type RoomType = {
    disconnect(): unknown;
    localParticipant: any
}
export const Room = ({ roomName, token, handleLogout }: RoomProps) => {
    const [room, setRoom] = useState<RoomType | null>(null);
    const [participants, setParticipants] = useState<ParticipantType[]>([])

    const remoteParticipants = participants.map(participant => (
        <Participant key={participant.sid} participant={participant} />
    ));

    useEffect(() => {
        const participantConnected = (participant: ParticipantType) => {
            setParticipants(prevParticipants => [...prevParticipants, participant]);
        };
        const participantDisconnected = (participant: ParticipantType) => {
            setParticipants(prevParticipants =>
                prevParticipants.filter(p => p !== participant)
            );
        };
        Video.connect(token, {
            name: roomName
        }).then(room => {
            setRoom(room);
            room.on('participantConnected', participantConnected);
            room.on('participantDisconnected', participantDisconnected);
            room.participants.forEach(participantConnected);
        });

        return () => {
            setRoom(currentRoom => {
                if (currentRoom && currentRoom.localParticipant.state === 'connected') {
                    currentRoom.localParticipant.tracks.forEach(function (trackPublication: { track: { stop: () => void; }; }) {
                        trackPublication.track.stop();
                    });
                    currentRoom.disconnect();
                    return null;
                } else {
                    return currentRoom;
                }
            });
        };
    }, [roomName, token]);

    return (
        <div className="room">
            <Flex
                align="center"
                pos="relative"
                justify="center"
                boxSize="full"
                // bg="blackAlpha.700"
                position="static"
            >
                <Flex>
                    <Box p="4" bg="red.400">
                        <Heading as="h3" size="3xl">Room: {roomName}</Heading>
                    </Box>
                    <Spacer />
                    <Box p="4" bg="green.400">
                        <Button onClick={handleLogout}>Log out</Button>
                    </Box>
                </Flex>
            </Flex>
            <Stack>
                <div className="local-participant">
                    {room ? (
                        <Participant
                            key={room.localParticipant.sid}
                            participant={room.localParticipant}
                        />
                    ) : (
                        ''
                    )}
                </div>
                <h3>Remote Participants</h3>
                <div className="remote-participants">{remoteParticipants}</div>
            </Stack>
        </div >
    );
};
