import { AGREGAR_PERSONA, EDITAR_PERSONA, ELIMINAR_PERSONA, OBTENER_PERSONA, OBTENER_PERSONAS, QUITAR_PERSONA, QUITAR_PERSONAS, REGISTRO_ERROR } from ".."

export default (state, action) => {

    switch (action.type) {
        case OBTENER_PERSONAS:
            return { ...state, personas: action.payload }
        case OBTENER_PERSONA:
            return { ...state, persona: action.payload }
        case AGREGAR_PERSONA:
            return { ...state, personas: [...state.personas, action.payload] }
        case EDITAR_PERSONA:
            return { ...state, errorMensaje: null }
        case ELIMINAR_PERSONA:
            return { ...state, personas: state.personas.filter( persona => persona.id !== action.payload ) }
        case QUITAR_PERSONA:
            return { ...state, persona: null }
        case QUITAR_PERSONAS:
            return { ...state, personas: [] }
        case REGISTRO_ERROR:
            return { ...state, errorMensaje: action.payload }
        default:
            return state
    }

}