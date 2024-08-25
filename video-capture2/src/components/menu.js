// RecordingMenu.js

import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener esta importación si aún no la tienes

const RecordingMenu = () => {
    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                <h4 className="card-title">Selecciona una acción para grabar</h4>
                <br></br>
                    <p className="card-title">Al seleccionar una de las acciones serás llevado a una página en donde se tomarán los videos. Una vez dentro puedes ver el video de ejemplo para saber que hacer, luego podrás grabar el video. Durante la grabación del video no podrás ver la cámara pero si después. Para iniciar y detener la granación debes presioanr el botón correspondiente. Una vez terminada la grabación podrás ver el video recién tomado, si no te gusta podrás tomar otro, y si estás conforme puedes volver al menú para el siguiente gesto. Una vez que todos los gestos sean grabados, puedes presionar el botón de finalizar.</p>
                    <br></br>
                    <div className="list-group">
                    <Link to="/capture/move-up-down" className="list-group-item list-group-item-action">Movimiento Arriba/Abajo</Link>
                        <Link to="/capture/move-sides" className="list-group-item list-group-item-action">Movimiento Lateral</Link>
                        <Link to="/capture/raise-eyebrows" className="list-group-item list-group-item-action">Levantar Cejas</Link>
                        <Link to="/capture/open-close-mouth" className="list-group-item list-group-item-action">Abrir/Cerrar Boca</Link>
                        <Link to="/capture/lip-corner-movements" className="list-group-item list-group-item-action">Movimientos de Comisura Labial</Link>
                        <Link to="/capture/blinking" className="list-group-item list-group-item-action">Pestañeo</Link>
                        <Link to="/capture/head-position" className="list-group-item list-group-item-action">Posición de la Cabeza</Link>
                        {/* Añadir otros enlaces según sea necesario */}
                    </div>
                </div>
            </div>
            <Link to="/final" className="btn btn-primary mt-3">Finalizar</Link>
        </div>
    );
};

export default RecordingMenu;
