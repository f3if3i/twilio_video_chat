import { Box, Button, Flex, Heading, Spacer } from "@chakra-ui/react"
import React, { useState, useEffect } from "react"
import Video from "twilio-video"
import Participant from "./Participant"

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
    const [room, setRoom] = useState<RoomType | null>(null)
    const [participants, setParticipants] = useState<ParticipantType[]>([])

    const remoteParticipants = participants.map(participant => (
        <Participant key={participant.sid} participant={participant} />
    ))

    useEffect(() => {
        const participantConnected = (participant: ParticipantType) => {
            setParticipants(prevParticipants => [...prevParticipants, participant])
        }
        const participantDisconnected = (participant: ParticipantType) => {
            setParticipants(prevParticipants =>
                prevParticipants.filter(p => p !== participant)
            )
        }
        Video.connect(token, {
            name: roomName
        }).then(room => {
            setRoom(room)
            room.on("participantConnected", participantConnected)
            room.on("participantDisconnected", participantDisconnected)
            room.participants.forEach(participantConnected)
        })

        return () => {
            setRoom(currentRoom => {
                if (currentRoom && currentRoom.localParticipant.state === "connected") {
                    console.log("currentRoom.localParticipant", currentRoom.localParticipant)
                    currentRoom.localParticipant.tracks.forEach(function (trackPublication: { track: { stop: () => void; }; }) {
                        trackPublication.track.stop()
                    })
                    currentRoom.disconnect()
                    return null
                } else {
                    return currentRoom
                }
            })
        }
    }, [roomName, token])

    return (
        <Box h="100%" w="100%">
            <Flex>
                <Box p="4">
                    <Heading as="h3" size="xl">Room: {roomName}</Heading>
                </Box>
                <Spacer />
                <Box p="4">
                    <Button colorScheme="teal" onClick={handleLogout}>Log out</Button>
                </Box>
            </Flex>
            <Flex mt="10rem">
                <Box w="50%">
                    <div className="local-participant">
                        {room ? (
                            <Participant
                                key={room.localParticipant.sid}
                                participant={room.localParticipant}
                            />
                        ) : (
                            ""
                        )}
                    </div>
                </Box>
                <Box w="50%">
                    {remoteParticipants && remoteParticipants.length > 0 ?
                        <Flex align="center" justify="center">
                            <Heading as="h5" size="md">Remote Participants</Heading>
                            <div className="remote-participants">{remoteParticipants}</div>
                        </Flex>
                        :
                        <Flex align="center" justify="center">
                            <Heading as="h5" size="md">No remote participants yet...</Heading>
                        </Flex>
                    }
                </Box>
            </Flex>
        </Box>
    )
}
