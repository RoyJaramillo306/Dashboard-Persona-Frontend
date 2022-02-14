import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../contexts/auth/authContext';

const PrivateRouter = ({ component: Component, ...props }) => {

    const { autenticado, cargando, usuarioAutenticado } = useContext(AuthContext);

    useEffect(() => {
        usuarioAutenticado();
    }, []);

    return (
        <Route {...props} render={ props => !autenticado && !cargando ? (
            <Redirect to="/login" />
        ): (
            <Component {...props} />
        )} />
    );

};

export default PrivateRouter;