import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CameraCapture from './components/CameraCapture';
import TermsOfService from './components/ToS';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

function App() {
    return (
        <Router>
            <div>
                {/* Navigation */}
                <nav>
                    <ul>
                        <li><Link to="/">Terms of Service</Link></li>
                        <li><Link to="/camera-capture">Camera Capture</Link></li>
                    </ul>
                </nav>

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<TermsOfService />} />
                    <Route path="/camera-capture" element={<div><CameraCapture viewName="MoveUpDown" /><CameraCapture viewName="MoveSides" /></div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
