import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CameraCapture from './components/CameraCapture';
import TermsOfService from './components/ToS';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import UserContext from './components/UserContext';
import { useState } from 'react';
import RecordingMenu from './components/menu';

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
                        <Route path="/recording-menu" element={<RecordingMenu />} />
                        <Route path="/capture/move-up-down" element={<CameraCapture viewName="MoveUpDown" />} />
                        <Route path="/capture/move-sides" element={<CameraCapture viewName="MoveSides" />} />
                        <Route path="/capture/raise-eyebrows" element={<CameraCapture viewName="RaiseEyebrows" />} />
                        <Route path="/capture/open-close-mouth" element={<CameraCapture viewName="OpenCloseMouth" />} />
                        <Route path="/capture/lip-corner-movements" element={<CameraCapture viewName="LipCornerMovements" />} />
                        <Route path="/capture/blinking" element={<CameraCapture viewName="Blinking" />} />
                        <Route path="/capture/head-position" element={<CameraCapture viewName="HeadPosition" />} />
                        {/* Agrega más rutas según sea necesario */}
                    </Routes>
                </div>
            </Router>
        </UserContext.Provider>
    );
}

export default App;
