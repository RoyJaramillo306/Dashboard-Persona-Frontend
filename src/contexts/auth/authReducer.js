import { CERRAR_SESION, OBTENER_USUARIO, SESION_ERROR, SESION_EXITOSA } from "../index";

export default (state, action) => {

    switch (action.type) {

        case SESION_EXITOSA:
            localStorage.setItem('token', action.payload.token);
            return{ ...state, autenticado: true, mensaje: null, cargando: false }

        case OBTENER_USUARIO:
            return { ...state, token: action.payload.token ,autenticado: true, usuario: action.payload.data.usuario, fullname: action.payload.data.fullName, cargando: false }

        case SESION_ERROR:
        case CERRAR_SESION:
            localStorage.removeItem('token');
            return { ...state, token: null, usuario: null, autenticado: null, fullname: null, mensaje: action.payload, cargando: false }
        
        default:
            return state
    }

}