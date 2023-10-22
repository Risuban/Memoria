import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function TermsOfService() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        // ... any other fields you need
    });

    const navigate = useNavigate(); // se utiliza aquí

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        console.log("Submit event triggered"); // Verificar si esto se muestra en la consola cuando haces clic en "Submit"
        event.preventDefault();
        // llamada a la API para crear el directorio
        axios.post('http://localhost:3001/create-user-directory', { 
            userName: formData.name 
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log(response.data.message);
            // Redirige al usuario a la página de grabación
            navigate('/camera-capture'); // redirige a la ruta de captura de cámara
        })
        .catch(error => {
            console.error("Error en la llamada a la API", error);
        });
    };

    return (
        <div className="container mt-5">
            <h2>Terms of Service</h2>
            {/* Display your terms of service content here */}
            <div className="mt-4">
                <h3>Enter your details:</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {/* Add other fields as needed */}
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default TermsOfService;
