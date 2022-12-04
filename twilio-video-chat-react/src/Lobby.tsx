import { Stack, Input, FormControl, FormLabel, Button, Box, Heading, Flex, Center } from '@chakra-ui/react';
import React from 'react';
import './App.css';

type LobbyProps = {
    username: string,
    handleUsernameChange: any,
    roomName: string,
    handleRoomNameChange: any,
    handleSubmit: any
}

const Lobby = ({
    username,
    handleUsernameChange,
    roomName,
    handleRoomNameChange,
    handleSubmit
}: LobbyProps) => {
    return (
        <div className='lobby'>

            <Flex
                direction="column"
                align="center"
                justify="center"
            >
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Heading as="h2" size={"2xl"}>Enter a room</Heading>
                        <FormControl id='name'>
                            <FormLabel>Name</FormLabel>
                            <Input type='text' id='field'
                                value={username}
                                onChange={handleUsernameChange}
                                required />
                        </FormControl>
                        <FormControl id='room'>
                            <FormLabel>Room</FormLabel>
                            <Input type='text' id='field'
                                value={roomName}
                                onChange={handleRoomNameChange}
                                required />
                        </FormControl>
                        <Box pt="30px">
                            <Button colorScheme='teal' type='submit'>Submit</Button>
                        </Box>
                    </Stack>
                </form>
            </Flex>

        </div>
    );
};

export default Lobby;