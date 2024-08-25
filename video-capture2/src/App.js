import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CameraCapture from './components/CameraCapture';
import TermsOfService from './components/ToS';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import UserContext from './components/UserContext';
import { useState } from 'react';
import RecordingMenu from './components/menu';
import ThankYou from './components/ThankYou';
import SearchView from './components/SearchView';

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
                        <Route path="/capture/move-up-down" element={<CameraCapture viewName="MovimientoVertical" />} />
                        <Route path="/capture/move-sides" element={<CameraCapture viewName="MovimientoLateral" />} />
                        <Route path="/capture/raise-eyebrows" element={<CameraCapture viewName="LevantarCejas" />} />
                        <Route path="/capture/open-close-mouth" element={<CameraCapture viewName="AbrirYCerrarBoca" />} />
                        <Route path="/capture/lip-corner-movements" element={<CameraCapture viewName="ComisuraLabial" />} />
                        <Route path="/capture/blinking" element={<CameraCapture viewName="Pestañeo" />} />
                        <Route path="/capture/head-position" element={<CameraCapture viewName="PosiciónCabeza" />} />
                        <Route path="/search-consent" element={<SearchView />} />
                        {/* ejemplo de como agregar una nueva vista */}
                        {/* <Route path="/capture/look-aroubd" element={<CameraCapture viewName="LookAround" />} /> */}
                        {/* Agrega más rutas según sea necesario */}
                        <Route path="/final" element={<ThankYou />} />
                    </Routes>
                </div>
            </Router>
        </UserContext.Provider>
    );
}

export default App;
