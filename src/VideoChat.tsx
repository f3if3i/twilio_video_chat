import React, { useState, useCallback } from 'react';
import Lobby from './Lobby';
import { Room } from './Room';

export const VideoChat = () => {
    const [username, setUsername] = useState('');
    const [roomName, setRoomName] = useState('');
    const [token, setToken] = useState<string | null>(null);

    const handleUsernameChange = useCallback((event: { target: { value: React.SetStateAction<string>; }; }) => {
        setUsername(event.target.value);
    }, []);

    const handleRoomNameChange = useCallback((event: { target: { value: React.SetStateAction<string>; }; }) => {
        setRoomName(event.target.value);
    }, []);

    const handleSubmit = useCallback(async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        // replace the api end point later
        // const data = await fetch('/video/token', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         identity: username,
        //         room: roomName
        //     }),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }).then(res => res.json());
        // setToken(data.token);
        const sampleToken = ""
        setToken(sampleToken);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username, roomName]);

    const handleLogout = useCallback((event: any) => {
        setToken(null);
    }, []);
    let render;
    if (token) {
        render = (
            <Room roomName={roomName} token={token} handleLogout={handleLogout} />
        );
    } else {
        render = (
            <Lobby
                username={username}
                roomName={roomName}
                handleUsernameChange={handleUsernameChange}
                handleRoomNameChange={handleRoomNameChange}
                handleSubmit={handleSubmit}
            />
        );
    }
    return render;
}
