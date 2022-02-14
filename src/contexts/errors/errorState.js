import React, { useReducer } from 'react';
import errorReducer from './errorReducer';
import errorContext from './errorContext';
import { MOSTRAR_ERROR, OCULTAR_ERROR } from '..';

const ErrorState = props => {
    
    const initialState = { error: null }

    const [state, dispatch] = useReducer(errorReducer, initialState);

    const mostrarError = (msg, categoria) =>{
        
        dispatch({
            type: MOSTRAR_ERROR,
            payload: { msg, categoria }
        })

        setTimeout(() => {
            dispatch({
                type: OCULTAR_ERROR
            })
        }, 3000);

    }

    return(
        <errorContext.Provider value={{ error: state.error, mostrarError }}>
            { props.children }
        </errorContext.Provider>
    )

};

export default ErrorState;