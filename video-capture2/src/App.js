import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CameraCapture from './components/CameraCapture';
import TermsOfService from './components/ToS';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import UserContext from './components/UserContext';
import { useState } from 'react';

function App() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        underlyingCondition: '',
        estimatedWeight: '',
        height: '',
        email: '',
        timeStamp: ''
        // ... any other fields you need
    });

    return (
        <UserContext.Provider value={{formData, setFormData}}>
        <Router>
            <div>

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<TermsOfService />} />
                    <Route path="/camera-capture" element={<div><CameraCapture viewName="MoveUpDown" /><CameraCapture viewName="MoveSides" /></div>} />
                </Routes>
            </div>
        </Router>
        </UserContext.Provider>
    );
}

export default App;
