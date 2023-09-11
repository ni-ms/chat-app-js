import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Navbar, Nav, ListGroup, Button, Form} from 'react-bootstrap';
import {FiUsers, FiMessageSquare} from 'react-icons/fi'; // Import icons
import {io} from 'socket.io-client';



const AgentScreen = () => {
    const [activeChat, setActiveChat] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [peopleMenuOpen, setPeopleMenuOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({});

    const [message, setMessage] = useState('');
    const [ioClient, setIoClient] = useState(null);
    const sendMessage = (e, message, userInfo, io) => {
        e.preventDefault();
        if (message) {
            io.emit('chat message', {sender: userInfo.name, text: message});
            setMessage('');
        }
    };

    const [isConnected, setIsConnected] = useState(io.connected);

    useEffect(() => {
        const ioConnection = io('http://localhost:3000', {
            transports: ['websocket'], autoConnect: true
        });

        ioConnection.on('connect', () => {
            setIsConnected(true);
        });

        ioConnection.on('disconnect', () => {
            setIsConnected(false);
        });

        setIoClient(ioConnection);

        return () => {
            ioConnection.disconnect();
        };
    }, []);


    const togglePeopleMenu = () => {
        setPeopleMenuOpen(!peopleMenuOpen);
    };

    return (<Container fluid style={{height: '100vh'}}>
        <Row style={{height: '100%'}}>
            {/* Navbar */}
            <Col md={2} className="bg-primary">
                <Navbar className="flex-column">
                    <Navbar.Brand className="text-white">Chat App</Navbar.Brand>
                    <Nav.Link className="text-white" onClick={togglePeopleMenu}>
                        <FiUsers/> People
                    </Nav.Link>
                    <Nav.Link className="text-white" href="#">
                        <FiMessageSquare/> Chat
                    </Nav.Link>
                    <Button variant="danger" className="mt-auto mb-3">
                        Logout
                    </Button>
                </Navbar>
            </Col>

            {/* People List (conditionally rendered) */}
            {peopleMenuOpen && (<Col md={3} className="people-list open">
                <ListGroup>
                    {/* List of people to message */}
                    <ListGroup.Item action active>
                        Shivam
                    </ListGroup.Item>
                    <ListGroup.Item action> Nikhil </ListGroup.Item>
                    {/* Add more people here */}
                </ListGroup>
            </Col>)}

            {/* Chat Window */}
            <Col md={6}>
                <div className="d-flex flex-column h-100">
                    {/* Chat messages go here */}
                    <div className="flex-grow-1 overflow-auto">
                        {chatHistory.map((message, index) => (<div key={index} className="my-2">
                            {message.sender}: {message.text}
                        </div>))}
                    </div>
                    {/* Text input box */}
                    <Form onSubmit={(e) => sendMessage(e, message, userInfo, ioClient)}>
                        <Row className="align-items-center">
                            <Col xs={9} sm={10}>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Type your message here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </Col>
                            <Col xs={3} sm={2}>
                                <Button variant="primary" type="submit" className="w-100">
                                    Send
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Col>

            {/* User Info */}
            <Col md={1} className="bg-light">
                <div className="p-3 sticky-top">
                    <h6>User Info</h6>
                    {/* Display user info here */}
                    <p>User Name: {userInfo.name}</p>
                    <p>Email: {userInfo.email}</p>
                    <p>Role: Student</p>
                </div>
            </Col>
        </Row>
    </Container>);
};

export default AgentScreen;
