import React, { useContext, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './MainContent/Header/Header';
import Footer from './MainContent/Footer/Footer';
import Casos from './MainContent/Views/Casos/Casos';
import Dashboard from './MainContent/Views/Dashboard/Dashboard';
import Usuarios from './MainContent/Views/Usuarios/Usuarios';
import Personas from './MainContent/Views/Personas/Personas';
import './Sidebar/Sidebar.css';
import AuthContext from '../../contexts/auth/authContext';

const Home = ({history}) => {

    const {autenticado, usuarioAutenticado} = useContext(AuthContext);

    useEffect(() => {
        
        usuarioAutenticado();

        if(!autenticado) history.push('/login');

    }, []);

    return (
        <>
            <Sidebar />

            <div className='home-context'>
                <Header />
                <Switch>
                    <Route exact path="/dashboard" component={ Dashboard }/>
                    <Route exact path="/personas" component={ Personas }/>
                    <Route exact path="/usuarios" component={ Usuarios }/>
                    <Route exact path="/casos" component={ Casos }/>
                    <Redirect to="/dashboard" />
                </Switch>
                <Footer />
            </div>
        </>
    )
};

export default Home;