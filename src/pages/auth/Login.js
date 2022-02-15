import React, { useContext, useEffect, useState } from 'react';
import './Login.css';
import fondo from '../../assets/images/fondo.jpg';
import logo from '../../assets/images/logo.png';
import IconButton from '@material-ui/core/IconButton';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Input, InputLabel, InputAdornment } from '@material-ui/core';
import { MdEmail, MdVpnKey } from "react-icons/md";
import PropTypes from 'prop-types';
import AuthContext from '../../contexts/auth/authContext';
import ErrorContext from '../../contexts/errors/errorContext';

const Login = ({history}) => {

    const { mensaje, autenticado, token, iniciarSesion, usuarioAutenticado } = useContext(AuthContext);
    const [ passw, setPassw] = useState({ showPassword: false });
    const { error, mostrarError } = useContext(ErrorContext);

    useEffect(() => {

        if(autenticado) history.replace('/');

        if(!autenticado){
            if(token){
                usuarioAutenticado();
            }
        }
       
        if(mensaje) mostrarError(mensaje.msg, mensaje.categoria);

    }, [mensaje, autenticado, token, history]);
    
    const [ usuario, setUsuario] = useState({
        email: '',
        password: ''
    })

    const { email, password } = usuario;
    const { showPassword } = passw;
    
    const handleClickShowPassword = () => {
        setPassw({ ...passw, showPassword: !showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const cambio = ({target}) =>{
        setUsuario( { ...usuario, [target.name]: target.value } );
    }
   
    const login = (e) => {

        e.preventDefault();

        if (email.trim() === '' || password.trim() === '') {
            mostrarError('Los campos son obligatorios', 'text-danger');
        } else {
            iniciarSesion({ email, password });
        }

    }

    return (
        
        <div className='principal'>
            <section>
                <div className='imgBx'>
                    <img src={fondo} />
                </div>
                <div className='contentBx'>
                    <div className='formBx'>
                        <h2 className='container'>Bienvenido</h2>
                        <div className='container div-logo'>
                            <img className='img-logo' src={logo} />
                        </div>
                        { error && (<span className={`span-error ${error.categoria}`} > {error.msg} </span>) }
                        <form autoComplete='off' onSubmit={login}><br/>
                            <div>
                                <InputLabel className='label-input' htmlFor="correo">Email</InputLabel>
                                <Input type='text' className='inputBx-email' name='email' value={email} onChange={cambio} id="correo" startAdornment={ <InputAdornment position="start"> <MdEmail /> </InputAdornment> } placeholder="Ingrese con el correo demo@demo.com"/>
                            </div>
                            <br/>
                            <div>
                                <InputLabel className='label-input' htmlFor="pass">Password</InputLabel>
                                <Input className='inputBx-password' id="pass" name='password' type={ showPassword ? 'text' : 'password' } value={password} onChange={cambio}
                                    startAdornment={ <InputAdornment position="start"> <MdVpnKey /> </InputAdornment> } placeholder="Ingrese su password"
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                                                { showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </div>
                            <br/>
                            <div className='inputBx div-button'>
                                <button className='btn btn-outline-primary' type='submit'>Ingresar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>

    )

};

export default Login;
