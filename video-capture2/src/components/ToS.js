import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import consentimientoPDF from '../assets/Consentimiento_informado.pdf';
import { useUser } from './UserContext';

function TermsOfService() {
    const [hasReadDocument, setHasReadDocument] = useState(false);

    const { formData, setFormData } = useUser();
    const navigate = useNavigate(); // se utiliza aquí
    const lastName = formData.lastName
    const apellido = lastName.split(` `).join(`-`)
    


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const updatedTimestamp = Date.now();
        setFormData(prevState => ({ ...prevState, [name]: value, timeStamp: updatedTimestamp }));
        console.log(formData);
        
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!hasReadDocument) {
            alert("Por favor, lee y acepta el consentimiento informado.");
            return;
        }

        console.log("Enviando datos al servidor...");
        
        axios.post('http://localhost:3001/create-user-directory', {
            ...formData, 
            userName: formData.firstName + "-" + apellido
        })
        .then(response => {
            console.log("Respuesta del servidor:", response.data);
            // Redirige al usuario a la página de grabación
            navigate('/camera-capture');
        })
        .catch(error => {
            console.error("Error al comunicarse con el servidor:", error);
        });
        
    };

    return (
        <div className="container mt-5">
            <h2>Terms of Service</h2>
            <div className="mt-4">
                <h3>Enter your details:</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">Nombre:</label>
                        <input type="text" id="firstName" name="firstName" className="form-control" value={formData.firstName} onChange={handleInputChange} placeholder="Nombre"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Apellido:</label>
                        <input type="text" id="lastName" name="lastName" className="form-control" value={formData.lastName} onChange={handleInputChange} placeholder="Apellido"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="age" className="form-label">Edad:</label>
                        <input type="number" id="age" name="age" className="form-control" value={formData.age} onChange={handleInputChange} placeholder="Edad"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gender" className="form-label">Sexo:</label>
                        <select id="gender" name="gender" className="form-control" value={formData.gender} onChange={handleInputChange}>
                            <option value="" disabled>Seleccione una opción</option>
                            <option value="male">Masculino</option>
                            <option value="female">Femenino</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="underlyingCondition" className="form-label">Enfermedad de base:</label>
                        <input type="text" id="underlyingCondition" name="underlyingCondition" className="form-control" value={formData.underlyingCondition} onChange={handleInputChange} placeholder="Diabetes, Hipertensión, etc. o 'No aplica'"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="estimatedWeight" className="form-label">Peso estimado (kg):</label>
                        <input type="number" id="estimatedWeight" name="estimatedWeight" className="form-control" value={formData.estimatedWeight} onChange={handleInputChange} placeholder="Peso en kg"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="height" className="form-label">Altura (cm):</label>
                        <input type="number" id="height" name="height" className="form-control" value={formData.height} onChange={handleInputChange} placeholder="Altura en cm"/>
                    </div>
                    {/* ... tus otros campos ... */}
                                     {/* Visualizador de PDF */}
            <iframe src={consentimientoPDF} width="100%" height="1000px"></iframe>
            {/* Checkbox de consentimiento */}
            <div className="form-check mt-4">
                <input 
                    className="form-check-input" 
                    type="checkbox" 
                    value={hasReadDocument} 
                    onChange={() => setHasReadDocument(!hasReadDocument)} 
                    id="consentCheck"
                />
                <label className="form-check-label" htmlFor="consentCheck">
                    He leído el documento y doy mi consentimiento.
                </label>
            </div>
            <button type="submit" className="btn btn-primary mt-3" disabled={!hasReadDocument}>Submit</button>

                </form>

            </div>
        </div>
    );
}

export default TermsOfService;
