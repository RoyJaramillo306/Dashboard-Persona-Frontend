import React, { useReducer } from 'react';
import clienteAxios from '../../config/axios';
import personaReducer from './personaReducer';
import personaContext from './personaContext';
import { AGREGAR_PERSONA, EDITAR_PERSONA, ELIMINAR_PERSONA, OBTENER_PERSONA, OBTENER_PERSONAS, QUITAR_PERSONA, QUITAR_PERSONAS, REGISTRO_ERROR } from '..';

const PersonaState = props => {

    const initialState = {
        personas: [],
        persona: null,
        errorMensaje: null
    }

    const [state, dispatch] = useReducer(personaReducer, initialState);

    const getPersonas = async () => {
        
        try {

            const {data} = await clienteAxios.get('/api/personas');

            dispatch({
                type: OBTENER_PERSONAS,
                payload: data
            })

        } catch ({response}){
            console.log(response.data.msg);
        }

    }

    const obtenerPersona = async (persona) =>{
        
        try {
            
            dispatch({
                type: OBTENER_PERSONA,
                payload: persona
            })

        } catch (error) {
            console.log(error);
        }

    }

    const quitarPersona = async () => {
        try {
            dispatch({
                type: QUITAR_PERSONA
            })
        } catch (error) {
            console.log(error);
        }
    }

    const quitarPersonas = async () => {
        try {
            dispatch({
                type: QUITAR_PERSONAS
            })
        } catch (error) {
            console.log(error);
        }
    }

    const registrarPersona = async (datos) => {

        const { nombrep, apellidop, emailp, ciudadp, paisp, telefonop, direccionp, codigo_postalp, estadop } = datos;

        const perso = { nombre: nombrep, apellido: apellidop, email: emailp, ciudad: ciudadp, pais: paisp, telefono: telefonop, direccion: direccionp, codigo_postal: codigo_postalp, estado: estadop }
        
        try {
            
            const {data} = await clienteAxios.post('/api/personas', perso);

            dispatch({
                type: AGREGAR_PERSONA,
                payload: data
            })

        } catch ({response}) {

            const error = {
                msg: response.data.msg,
                categoria: 'text-danger'
            }

            dispatch({
                type: REGISTRO_ERROR,
                payload: error
            })
        }

    }

    const editarPersona = async (person) => {

        try {

            if(state.persona) person.emailActual = state.persona.email;

            const perso = await clienteAxios.put(`/api/personas/${person.id}`, person);

            dispatch({
                type: EDITAR_PERSONA
            })

        } catch ({response}) {
            
            dispatch({
                type: REGISTRO_ERROR,
                payload: response.data.msg
            })
        }

    }

    const eliminarPersona = async id => {
        
        try {
        
            const {data} = await clienteAxios.delete(`/api/personas/${id}`);
            
            dispatch({
                type: ELIMINAR_PERSONA,
                payload: id
            })

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <personaContext.Provider value={{ personas: state.personas, persona: state.persona, errorMensaje: state.errorMensaje, getPersonas, obtenerPersona, registrarPersona, editarPersona, eliminarPersona, quitarPersona, quitarPersonas }} >
            { props.children }
        </personaContext.Provider>
    )

};

export default PersonaState;