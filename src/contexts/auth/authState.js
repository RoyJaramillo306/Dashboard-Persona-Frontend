import React, { useReducer } from 'react';
import authReducer from './authReducer';
import authContext from './authContext';
import clienteAxios from '../../config/axios';
import tokenAuth from '../../config/token';
import { CERRAR_SESION, OBTENER_USUARIO, SESION_ERROR, SESION_EXITOSA } from '..';

const AuthState = props => {

    const initialState = {
        token: localStorage.getItem('token'),
        autenticado: null,
        usuario: null,
        mensaje: null,
        fullname: null,
        cargando: true
    }

    const [state, dispatch] = useReducer(authReducer, initialState);

    const usuarioAutenticado = async () => {

        const token = localStorage.getItem('token');

        if (token) tokenAuth(token);

        try {
            
            const {data} = await clienteAxios.get('/api/auth');

            const datos = {
                data: data,
                token: token
            }
        
            dispatch({
                type: OBTENER_USUARIO,
                payload: datos
            });

        } catch ({response}) {
            dispatch({
                type: SESION_ERROR,
                payload: response.data.msg
            })
        }

    }

    const iniciarSesion = async datos => {
        
        try {
            
            const {data} = await clienteAxios.post('/api/auth', datos);
            
            dispatch({
                type: SESION_EXITOSA,
                payload: data
            })

            usuarioAutenticado();

        } catch ({response}) {
            
            const error = {
                msg: response.data.msg,
                categoria: 'text-danger'
            }

            dispatch({
                type: SESION_ERROR,
                payload: error
            })

        }

    }

    const cerrarSesion = () => {
        dispatch({
            type: CERRAR_SESION
        })
    }

    return (
        <authContext.Provider value={{ token: state.token, autenticado: state.autenticado, usuario: state.usuario, mensaje: state.mensaje, fullname: state.fullname, cargando: state.cargando, iniciarSesion, usuarioAutenticado, cerrarSesion }}>
            { props.children }
        </authContext.Provider>
    );
};

export default AuthState;