import { MOSTRAR_ERROR, OCULTAR_ERROR } from "..";

export default (state, action) => {

    switch (action.type) {
        
        case MOSTRAR_ERROR:
            return { error: action.payload }
            
        case OCULTAR_ERROR:
            return { error: null }

        default:
            return state;

    }

}