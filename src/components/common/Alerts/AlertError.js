import React from 'react';
import Alert from '@mui/material/Alert';
import './Alerts.css';

const AlertError = ({mensaje, tamaño}) => {

    return (
        <div>
            <Alert className={`${tamaño} text-danger alert-error`} severity="error">{mensaje}.</Alert>
        </div>
    );
};

export default AlertError;