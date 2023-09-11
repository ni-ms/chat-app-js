import React, {useState} from 'react';
import {Container, Form, Button, Col, Row, Alert} from 'react-bootstrap';
import './Css/LoginPage.css';
import axios from "axios"; // Import your custom CSS file


const LoginPage = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email && password) {
            try {
                const response = await axios.post('/loginapi', {
                    email: email, password: password,
                });
                console.log(response);
                if (response.status === 200) {
                    // window.location.href = '/connectfb';
                    window.location.href = '/agentscreen';
                } else {
                    // alert registration failed
                    window.alert('Login failed' + response);
                }

            } catch (error) {
                window.alert('Login failed' + error);
            }
        } else {
            setShowAlert(true);
        }
    };

    return (<Container className="login-container">
        <div className="login-box">
            <h2>Login</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group as={Row}>
                    <Col>
                        <Form.Check
                            type="checkbox"
                            label="Remember me"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                    </Col>
                    <Col>
                        <a href="/signup">Don't have an account, create a new one</a>
                    </Col>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
            {showAlert && (<Alert variant="danger" className="mt-3">
                Please enter both email and password.
            </Alert>)}
        </div>
    </Container>);
};

export default LoginPage;
