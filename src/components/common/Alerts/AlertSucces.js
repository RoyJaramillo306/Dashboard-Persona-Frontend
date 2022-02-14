import React from 'react';
import Alert from '@mui/material/Alert';
import './Alerts.css';

const AlertSucces = ({mensaje, tamaño}) => {
    return (
        <Alert className={`${tamaño} text-success alert-success`} severity="success"> {`Persona ${mensaje} exitosamente!`} </Alert>
    );
};

export default AlertSucces;