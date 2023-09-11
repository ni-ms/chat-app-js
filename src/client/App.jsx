import React, {useState} from 'react';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/CreateAccount';
import ConnectFB from './Pages/ConnectFB';
import AgentScreen from "./Pages/AgentScreen";
import Nopage from "./Pages/404page";
// import Dashboard from './Pages/Dashboard'; // Example of another private route
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await fetch('/authstatus');
            if (response.status === 200) {
                setIsAuthenticated(true);
                // const data = await response.json();
                // if(data.isAuthenticated){
                //    setIsAuthenticated(true);
                // }
            } else {
                window.alert('Login failed' + response);
            }
        } catch (error) {
            window.alert('Login failed' + error);
        }
    };

    const handleLogout = async () => {
        // Implement your logout logic here and set isAuthenticated to false.
        try {
            const response = await fetch('/logout');
            if (response.status === 200) {
                setIsAuthenticated(false);
                // const data = await response.json();
            } else {
                window.alert('Logout failed')
            }

        } catch (error) {
            window.alert('Logout failed' + error);
        }
        setIsAuthenticated(false);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignupPage/>}/>
                {/*<Route path="/connectfb" element={<ConnectFB/>} />*/}
                <Route path="/agentscreen" element={<AgentScreen/>}/>
                <Route path="*" element={<Nopage/>}/>

            </Routes>
        </BrowserRouter>
    );
};

// A custom PrivateRoute component to protect private routes
const PrivateRoute = ({element, isAuthenticated, onLogout}) => {
    return isAuthenticated ? (element) : (<Navigate to="/" state={{from: window.location.pathname}}/>);
};

export default App;
