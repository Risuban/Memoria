// RecordingMenu.js

import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener esta importación si aún no la tienes

const RecordingMenu = () => {
    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Selecciona una acción para grabar</h5>
                    <div className="list-group">
                        <Link to="/capture/move-up-down" className="list-group-item list-group-item-action">Movimiento de Levantar Cejas</Link>
                        <Link to="/capture/open-close-mouth" className="list-group-item list-group-item-action">Abrir/Cerrar Boca</Link>
                        <Link to="/capture/lip-corner-movements" className="list-group-item list-group-item-action">Movimientos de Comisura Labial</Link>
                        <Link to="/capture/blinking" className="list-group-item list-group-item-action">Abrir y Cerrar Ojos (Pestañeo Prolongado)</Link>
                        <Link to="/capture/head-position" className="list-group-item list-group-item-action">Posición de la Cabeza (Perfil)</Link>
                        {/* ... otros enlaces según sea necesario */}
                    </div>
                </div>
            </div>
            <Link to="/final" className="btn btn-primary mt-3">Finalizar</Link>
        </div>
    );
};

export default RecordingMenu;
