import axios from 'axios';
import React, { useState } from 'react';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';

export default function SearchView() {
    const [name, setName] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            // Asegúrate de tener REACT_APP_API_URL correctamente configurada en tus variables de entorno
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/search/${name}`);
            setResults(response.data);  // axios automáticamente maneja la respuesta como JSON
        } catch (error) {
            console.error('Error fetching data:', error);
            alert(`Error fetching data: ${error.message}`);
            // Podrías decidir manejar diferentes tipos de errores de forma diferente aquí
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <h1>Buscar consentimiento informado</h1>
                    <Form className="d-flex mb-4">
                        <Form.Control
                            type="text"
                            placeholder="Ingrese el nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Button variant="primary" onClick={handleSearch}>Buscar</Button>
                    </Form>
                    {results.map((result, index) => (
                        <Card key={index} className="mb-3">
                            <Card.Body>
                                <Card.Title>{result.firstName} {result.lastName}</Card.Title>
                                <Card.Text>
                                    <strong>Fecha y Hora: </strong>{result.timestamp}<br />
                                    <strong>Hash del Directorio: </strong>{result.directoryHash}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
        </Container>
    );
}
