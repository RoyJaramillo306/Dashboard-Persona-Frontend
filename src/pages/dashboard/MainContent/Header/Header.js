import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import './Header.css'
import { BsBank2 } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import AuthContext from '../../../../contexts/auth/authContext';

const Header = () => {

    const { fullname, cerrarSesion } = useContext(AuthContext);

    return (
        <header className='header-component'>
            <strong><BsBank2 className='logo' /></strong>
            <div>
                <Tooltip title="Cerrar sesión" placement="bottom"><NavLink exact to="/login" className='li-header' onClick={cerrarSesion}><strong><BiLogOut className='log-out'/></strong></NavLink></Tooltip>
                { fullname && <li className='li-header'><strong> { fullname } </strong></li> }
            </div>
        </header>
    );
};

export default Header;