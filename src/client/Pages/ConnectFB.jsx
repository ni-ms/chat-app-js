import React, { useState } from 'react';
import { Button } from "react-bootstrap";
import axios from 'axios';
import {redirect} from "react-router";

const ConnectFB = () => {
    const [connected, setConnected] = useState(false);

    const handleFacebookLogin = async () => {
        try {
            window.location.href ='/agentscreen';
            // Send a request to your server to initiate Facebook authentication
            const response = await axios.get('/auth/facebook');

            // If the server responds successfully, you can set the connected state
            if (response.data.success) {
                setConnected(true);
            } else {
                console.log('Login failed.');
            }
        } catch (error) {
            console.error('Error while logging in:', error);
        }
    };

    const handleDisconnect = () => {
        // Implement logic to disconnect the Facebook Page
        setConnected(false);
    };

    return (
        <div>
            <Button onClick={handleFacebookLogin}>
                Connect with Facebook
            </Button>
            {connected && (
                <Button onClick={handleDisconnect}>Disconnect</Button>
            )}
        </div>
    );
};

export default ConnectFB;
