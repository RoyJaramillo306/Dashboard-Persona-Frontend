import React from 'react';

const EstadoStyle = ({row}) => {
    
    if(row.estado === 0) return <span className="badge bg-success"> Registrado </span>
    if(row.estado === 1) return <span className="badge bg-secondary"> Pendiente </span>
    if(row.estado === 2) return <span className="badge bg-primary"> Con Contrato </span>
    if(row.estado === 3) return <span className="badge bg-info "> Sin Caso </span>
    return <></>

};

export default EstadoStyle;