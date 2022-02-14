import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import PersonaContext from '../../../../../contexts/persona/personaContext';
import DataTable from 'react-data-table-component';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { FaEdit, FaUserPlus, FaAddressCard, FaCity } from "react-icons/fa";
import { MdDelete, MdCancel, MdEmail } from "react-icons/md";
import { BsFillTelephoneFill, BsFilePost } from "react-icons/bs";
import { GiBlackFlag } from "react-icons/gi";
import { IoIosPersonAdd, IoIosSave, IoIosCheckmarkCircle } from "react-icons/io";
import './Personas.css';
import AlertError from '../../../../../components/common/Alerts/AlertError';
import AlertSucces from '../../../../../components/common/Alerts/AlertSucces';
import EstadoStyle from './EstadoStyle';
import ErrorContext from '../../../../../contexts/errors/errorContext';

const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};

const FilterComponent = ({ filterText, onFilter, onClear }) => (
    	<>
    		<input id="search" className='search' type="text" placeholder="Filtrar por nombre" aria-label="Buscador" value={filterText} onChange={onFilter} autoComplete="off"/>
    		<button className='btn-search' type="button" onClick={onClear}>x</button>
    	</>
    );

const Personas = () => {

    const { persona, personas, errorMensaje, getPersonas, obtenerPersona, registrarPersona, editarPersona, eliminarPersona } = useContext(PersonaContext);
    const [listar, setListar] = useState(false);
    const [filtro, setFiltro] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const initialStatep = { nombrep: '', apellidop: '', emailp: '', ciudadp: '', paisp: '', telefonop: '', direccionp: '', codigo_postalp: '', estadop: 0 }
    const [personp, setPersonp] = useState(initialStatep);
    const { nombrep, apellidop, emailp, ciudadp, paisp, telefonop, direccionp, codigo_postalp, estadop } = personp;
    const initialState = { nombre: '', apellido: '', email: '', ciudad: '', pais: '', telefono: '', direccion: '', codigo_postal: '', estado: 0 };
    const [person, setPerson] = useState(initialState);
    const { nombre, apellido, email, ciudad, pais, telefono, direccion, codigo_postal, estado } = person;
    const initialStateValor = { valorNom: false, valorAp: false, valorEm: false, valorCiu: false, valorPais: false, valorTelf: false, valorDir: false, valorCod: false };
    const [valor, setValor] = useState(initialStateValor);
    const [mensaje, setMensaje] = useState({ mensajeNom: '', mensajeAp: '', mensajeEm: '', mensajeCiu: '', mensajePais: '', mensajeTelf: '', mensajeDir: '', mensajeCod: '' });
    const [cerrar, setCerrar] = useState('modal');
    const [formularioAlert, setFormularioAlert] = useState({ error: false, success: false, errorValidacion: false, errorEmail: false });
    const [actual, setActual] = useState(initialState);
    const [emailActual, setEmailActual] = useState('');
    const { error, mostrarError } = useContext(ErrorContext);

    const expresiones = {
        
        name: /^[a-zA-ZÀ-ÿ\s]{1,50}$/, // Letras y espacios, pueden llevar acentos.
        //password: /^.{4,12}$/, // 4 a 12 digitos.
        correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        telf: /^\d{7,14}$/, // 7 a 14 numeros.
        direc: /^[a-zA-ZÀ-ÿ0-9\s\#\.\-]{1,200}$/, // Letras, numeros, espacios, guion, punto y numeral.
        postal: /^\d{1,5}$/, // 1 a 5 numeros.
    }

    useEffect(() => {

        getPersonas();

        if(errorMensaje) mostrarError(errorMensaje.msg, errorMensaje.categoria);

    }, [listar, errorMensaje]);

    

    const cambiop = ({target}) => setPersonp( { ...personp, [target.name]: target.value } );

    const cambio = ({target}) => setPerson( { ...person, [target.name]: target.value } );

    const formReset = () => {
        setPersonp(initialStatep);
        setValor({ valorNom: false, valorAp: false, valorEm: false, valorCiu: false, valorPais: false, valorTelf: false, valorDir: false, valorCod: false });
        if(valor) setMensaje({ mensajeNom: '', mensajeAp: '', mensajeEm: '', mensajeCiu: '', mensajePais: '', mensajeTelf: '', mensajeDir: '', mensajeCod: '' });
        limpiar()
    }

    const filteredItems = personas.filter( item => item.nombre && item.nombre.toLowerCase().includes(filtro.toLowerCase()), );

    const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (filtro) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFiltro('');
			}
		};

		return ( <FilterComponent onFilter={e => setFiltro(e.target.value)} onClear={handleClear} filtro={filtro} /> );
	}, [filtro, resetPaginationToggle]);

    const columns = useMemo( () => 
            [
                { name: 'Estado', selector: row => row.estado, center: true, width: '150px', cell: row => <EstadoStyle row={row} /> },
                { name: 'Foto', selector: row => row.foto, center: true, width: '180px' },
                { name: 'Persona', selector: row => row.nombre, sortable: true, center: true },
                { name: 'Email', selector: row => row.email, sortable: true, center: true },
                { name: 'Teléfono', selector: row => row.telefono, sortable: true, center: true, width: '180px' },
                {	
                    cell: () => 
                    <>
                        <button className='btn btn-outline-primary btn-sm' type="button" data-bs-toggle="modal" data-bs-target="#editModal" data-tag="allowRowEvents"><FaEdit data-tag="allowRowEvents"/> Editar</button>,
                        <button className='btn btn-outline-secondary btn-sm' type="button" data-bs-toggle="modal" data-bs-target="#deleteModal" data-tag="allowRowEvents"><MdDelete data-tag="allowRowEvents"/> Eliminar</button>,
                    </>, ignoreRowClick: false, allowOverflow: true, button: true, width: '200px'
                }
            ], [],
        );

    const registrar = (e) => {
        e.preventDefault();

        let pers = personas.filter( r => r.email === emailp );
        
        if(nombrep.trim() === '' || apellidop.trim() === '' || emailp.trim() === '' || telefonop.trim() === '' || ciudadp.trim() === '' || paisp.trim() === '' || direccionp.trim() === '' || codigo_postalp.trim() === ''){
            setFormularioAlert({ ...formularioAlert, error: true });
            setTimeout(() => {
                setFormularioAlert({ ...formularioAlert, error: false });
            }, 3000);
        } else if(valor.valorNom == true || valor.valorAp == true || valor.valorEm == true || valor.valorCiu == true || valor.valorPais == true || valor.valorTelf == true || valor.valorDir == true || valor.valorCod == true){
            setFormularioAlert({ ...formularioAlert, errorValidacion: true });
            setTimeout(() => {
                setFormularioAlert({ ...formularioAlert, errorValidacion: false });
            }, 3000);
        } else if(pers[0]){
            setFormularioAlert({ ...formularioAlert, errorEmail: true });
            setTimeout(() => {
                setFormularioAlert({ ...formularioAlert, errorEmail: false });
            }, 3000);
        } else {
            registrarPersona(personp);
            if(error) console.log('Error definido');
            setFormularioAlert({ ...formularioAlert, success: true });
            setTimeout(() => {
                setFormularioAlert({ ...formularioAlert, success: false });
            }, 3000);
            formReset();
            setListar(!listar);
        }
    }

    const rowSelect = (r) => {
        setPerson(r);
        setActual(r);
        obtenerPersona(r);
    }

    const editar = (e) =>{
        e.preventDefault();

        if(emailActual === email){
            if(nombre.trim() === '' || apellido.trim() === '' || email.trim() === '' || telefono.trim() === '' || ciudad.trim() === '' || pais.trim() === '' || direccion.trim() === '' || codigo_postal.trim() === ''){
                setFormularioAlert({ ...formularioAlert, error: true });
                setTimeout(() => {
                    setFormularioAlert({ ...formularioAlert, error: false });
                }, 3000);
            } else if(valor.valorNom == true || valor.valorAp == true || valor.valorEm == true || valor.valorCiu == true || valor.valorPais == true || valor.valorTelf == true || valor.valorDir == true || valor.valorCod == true){
                setFormularioAlert({ ...formularioAlert, errorValidacion: true });
                setTimeout(() => {
                    setFormularioAlert({ ...formularioAlert, errorValidacion: false });
                }, 3000);
            } else {
                editarPersona(person);
                setFormularioAlert({ ...formularioAlert, success: true });
                setTimeout(() => {
                    setFormularioAlert({ ...formularioAlert, success: false });
                }, 3000);
            }
            setListar(!listar);
            limpiar();
        } else {
            let per = personas.filter( r => r.email === email );
            if (per[0]) {
                setFormularioAlert({ ...formularioAlert, errorEmail: true });
                    setTimeout(() => {
                        setFormularioAlert({ ...formularioAlert, errorEmail: false });
                    }, 3000);
            } else {
                if(nombre.trim() === '' || apellido.trim() === '' || email.trim() === '' || telefono.trim() === '' || ciudad.trim() === '' || pais.trim() === '' || direccion.trim() === '' || codigo_postal.trim() === ''){
                    setFormularioAlert({ ...formularioAlert, error: true });
                    setTimeout(() => {
                        setFormularioAlert({ ...formularioAlert, error: false });
                    }, 3000);
                } else if(valor.valorNom == true || valor.valorAp == true || valor.valorEm == true || valor.valorCiu == true || valor.valorPais == true || valor.valorTelf == true || valor.valorDir == true || valor.valorCod == true){
                    setFormularioAlert({ ...formularioAlert, errorValidacion: true });
                    setTimeout(() => {
                        setFormularioAlert({ ...formularioAlert, errorValidacion: false });
                    }, 3000);
                } else {
                    editarPersona(person);
                    setFormularioAlert({ ...formularioAlert, success: true });
                    setTimeout(() => {
                        setFormularioAlert({ ...formularioAlert, success: false });
                    }, 3000);
                }
                setListar(!listar);
                limpiar();
            }
        }

    }

    const validarCampos = () => {

        if(persona) setEmailActual(persona.email);

        if(nombre.trim() === '' || apellido.trim() === '' || email.trim() === '' || telefono.trim() === '' || ciudad.trim() === '' || pais.trim() === '' || direccion.trim() === '' || codigo_postal.trim() === ''){
            setCerrar('');
        } else if(nombre.trim() === '' & apellido.trim() === '' & email.trim() === '' & telefono.trim() === '' & ciudad.trim() === '' & pais.trim() === '' & direccion.trim() === '' & codigo_postal.trim() === ''){
            setCerrar('');
        } else if(valor.valorNom == true || valor.valorAp == true || valor.valorEm == true || valor.valorCiu == true || valor.valorPais == true || valor.valorTelf == true || valor.valorDir == true || valor.valorCod == true){
            setCerrar('');
        } else{
            setCerrar('modal');
        }
    }

    const eliminar = () => {
        eliminarPersona(person.id);
        limpiar();
        setListar(!listar);
    }

    const limpiar = () => {
        setPerson(initialState);
        setActual(initialState);
        obtenerPersona(null);
    }

    const validarNombre = () => {
        if (expresiones.name.test(nombrep)){
            setValor({ ...valor, valorNom: false });
            if(valor.valorNom) setMensaje({ ...mensaje, mensajeNom: '' });
        } else {
            if(nombrep===''){
                setValor({ ...valor, valorNom: true });
                setMensaje({ ...mensaje, mensajeNom: 'El nombre es obligatorio.' });
            } else {
                setValor({ ...valor, valorNom: true });
                setMensaje({ ...mensaje, mensajeNom: 'El nombre solo debe tener letras y espacios.' });
            }
        }
    }

    const validarNombreEdit = () => {
        if (expresiones.name.test(nombre)){
            setValor({ ...valor, valorNom: false });
            if(valor.valorNom) setMensaje({ ...mensaje, mensajeNom: '' });
        } else {
            if(nombre===''){
                setValor({ ...valor, valorNom: true });
                setMensaje({ ...mensaje, mensajeNom: 'El nombre es obligatorio.' });
            } else {
                setValor({ ...valor, valorNom: true });
                setMensaje({ ...mensaje, mensajeNom: 'El nombre solo debe tener letras y espacios.' });
            }
        }
    }

    const validarApellido = () => {
        if (expresiones.name.test(apellidop)){
            setValor({ ...valor, valorAp: false });
            if(valor.valorAp) setMensaje({ ...mensaje, mensajeAp: '' });
        } else {
            if(apellidop===''){
                setValor({ ...valor, valorAp: true });
                setMensaje({ ...mensaje, mensajeAp: 'El apellido es obligatorio.' });
            } else {
                setValor({ ...valor, valorAp: true });
                setMensaje({ ...mensaje, mensajeAp: 'El apellido solo debe tener letras y espacios.' });
            }
        }
    }

    const validarApellidoEdit = () => {
        if (expresiones.name.test(apellido)){
            setValor({ ...valor, valorAp: false });
            if(valor.valorAp) setMensaje({ ...mensaje, mensajeAp: '' });
        } else {
            if(apellido===''){
                setValor({ ...valor, valorAp: true });
                setMensaje({ ...mensaje, mensajeAp: 'El apellido es obligatorio.' });
            } else {
                setValor({ ...valor, valorAp: true });
                setMensaje({ ...mensaje, mensajeAp: 'El apellido solo debe tener letras y espacios.' });
            }
        }
    }
    
    const validarEmail = () => {
        if (expresiones.correo.test(emailp)){
            setValor({ ...valor, valorEm: false });
            if(valor.valorEm) setMensaje({ ...mensaje, mensajeEm: '' });
        } else {
            if(emailp===''){
                setValor({ ...valor, valorEm: true });
                setMensaje({ ...mensaje, mensajeEm: 'El email es obligatorio.' });
            } else {
                setValor({ ...valor, valorEm: true });
                setMensaje({ ...mensaje, mensajeEm: 'Ingrese un correo con formato válido: ejemplo@ejemplo.com.' });
            }
        }
    }

    const validarEmailEdit = () => {
        if (expresiones.correo.test(email)){
            setValor({ ...valor, valorEm: false });
            if(valor.valorEm) setMensaje({ ...mensaje, mensajeEm: '' });
        } else {
            if(email===''){
                setValor({ ...valor, valorEm: true });
                setMensaje({ ...mensaje, mensajeEm: 'El email es obligatorio.' });
            } else {
                setValor({ ...valor, valorEm: true });
                setMensaje({ ...mensaje, mensajeEm: 'Ingrese un correo con formato válido: ejemplo@ejemplo.com.' });
            }
        }
    }

    const validarDireccion = () => {
        if (expresiones.direc.test(direccionp)){
            setValor({ ...valor, valorDir: false });
            if(valor.valorDir) setMensaje({ ...mensaje, mensajeDir: '' });
        } else {
            if(direccionp===''){
                setValor({ ...valor, valorDir: true });
                setMensaje({ ...mensaje, mensajeDir: 'La dirección es obligatoria.' });
            } else {
                setValor({ ...valor, valorDir: true });
                setMensaje({ ...mensaje, mensajeDir: 'La dirección debe contener letras, numeros, espacios, guion, punto y numeral.' });
            }
        }
    }

    const validarDireccionEdit = () => {
        if (expresiones.direc.test(direccion)){
            setValor({ ...valor, valorDir: false });
            if(valor.valorDir) setMensaje({ ...mensaje, mensajeDir: '' });
        } else {
            if(direccion===''){
                setValor({ ...valor, valorDir: true });
                setMensaje({ ...mensaje, mensajeDir: 'La dirección es obligatoria.' });
            } else {
                setValor({ ...valor, valorDir: true });
                setMensaje({ ...mensaje, mensajeDir: 'La dirección debe contener letras, numeros, espacios, guion, punto y numeral.' });
            }
        }
    }

    const validarCiudad = () => {
        if (expresiones.name.test(ciudadp)){
            setValor({ ...valor, valorCiu: false });
            if(valor.valorCiu) setMensaje({ ...mensaje, mensajeCiu: '' });
        } else {
            if(ciudadp===''){
                setValor({ ...valor, valorCiu: true });
                setMensaje({ ...mensaje, mensajeCiu: 'La ciudad es obligatoria.' });
            } else {
                setValor({ ...valor, valorCiu: true });
                setMensaje({ ...mensaje, mensajeCiu: 'El nombre de la ciudad solo debe contener letras y espacios.' });
            }
        }
    }

    const validarCiudadEdit = () => {
        if (expresiones.name.test(ciudad)){
            setValor({ ...valor, valorCiu: false });
            if(valor.valorCiu) setMensaje({ ...mensaje, mensajeCiu: '' });
        } else {
            if(ciudad===''){
                setValor({ ...valor, valorCiu: true });
                setMensaje({ ...mensaje, mensajeCiu: 'La ciudad es obligatoria.' });
            } else {
                setValor({ ...valor, valorCiu: true });
                setMensaje({ ...mensaje, mensajeCiu: 'El nombre de la ciudad solo debe contener letras y espacios.' });
            }
        }
    }

    const validarPais = () => {
        if (expresiones.name.test(paisp)){
            setValor({ ...valor, valorPais: false });
            if(valor.valorPais) setMensaje({ ...mensaje, mensajePais: '' });
        } else {
            if(paisp===''){
                setValor({ ...valor, valorPais: true });
                setMensaje({ ...mensaje, mensajePais: 'El país es obligatorio.' });
            } else {
                setValor({ ...valor, valorPais: true });
                setMensaje({ ...mensaje, mensajePais: 'El nombre del país solo debe contener letras y espacios.' });
            }
        }
    }

    const validarPaisEdit = () => {
        if (expresiones.name.test(pais)){
            setValor({ ...valor, valorPais: false });
            if(valor.valorPais) setMensaje({ ...mensaje, mensajePais: '' });
        } else {
            if(pais===''){
                setValor({ ...valor, valorPais: true });
                setMensaje({ ...mensaje, mensajePais: 'El país es obligatorio.' });
            } else {
                setValor({ ...valor, valorPais: true });
                setMensaje({ ...mensaje, mensajePais: 'El nombre del país solo debe contener letras y espacios.' });
            }
        }
    }

    const validarTelefono = () => {
        if (expresiones.telf.test(telefonop)){
            setValor({ ...valor, valorTelf: false });
            if(valor.valorTelf) setMensaje({ ...mensaje, mensajeTelf: '' });
        } else {
            if(telefonop===''){
                setValor({ ...valor, valorTelf: true });
                setMensaje({ ...mensaje, mensajeTelf: 'El teléfono es obligatorio.' });
            } else {
                setValor({ ...valor, valorTelf: true });
                setMensaje({ ...mensaje, mensajeTelf: 'El teléfono debe tener mínimo 7 dígitos.' });
            }
        }
    }

    const validarTelefonoEdit = () => {
        if (expresiones.telf.test(telefono)){
            setValor({ ...valor, valorTelf: false });
            if(valor.valorTelf) setMensaje({ ...mensaje, mensajeTelf: '' });
        } else {
            if(telefono===''){
                setValor({ ...valor, valorTelf: true });
                setMensaje({ ...mensaje, mensajeTelf: 'El teléfono es obligatorio.' });
            } else {
                setValor({ ...valor, valorTelf: true });
                setMensaje({ ...mensaje, mensajeTelf: 'El teléfono debe tener mínimo 7 dígitos.' });
            }
        }
    }

    const validarPostal = () => {
        if (expresiones.postal.test(codigo_postalp)){
            setValor({ ...valor, valorCod: false });
            if(valor.valorCod) setMensaje({ ...mensaje, mensajeCod: '' });
        } else {
            if(codigo_postalp===''){
                setValor({ ...valor, valorCod: true });
                setMensaje({ ...mensaje, mensajeCod: 'El código postal es obligatorio.' });
            } else {
                setValor({ ...valor, valorCod: true });
                setMensaje({ ...mensaje, mensajeCod: 'El código postal debe tener de uno a cinco dígitos.' });
            }
        }
    }

    const validarPostalEdit = () => {
        if (expresiones.postal.test(codigo_postal)){
            setValor({ ...valor, valorCod: false });
            if(valor.valorCod) setMensaje({ ...mensaje, mensajeCod: '' });
        } else {
            if(codigo_postal===''){
                setValor({ ...valor, valorCod: true });
                setMensaje({ ...mensaje, mensajeCod: 'El código postal es obligatorio.' });
            } else {
                setValor({ ...valor, valorCod: true });
                setMensaje({ ...mensaje, mensajeCod: 'El código postal debe tener de uno a cinco dígitos.' });
            }
        }
    }
    
    return (

        <div className='container'><br/>
            <div className='row'>
                <div className='col'>
                    <button className='btn btn-primary btn-sm' type="button" data-bs-toggle="modal" data-bs-target="#exampleModal"><IoIosPersonAdd /> Nueva Persona </button><br/><br/>
                </div>
                <div className='col-10'>
                    { formularioAlert.success && <AlertSucces mensaje="modificada" tamaño="col-md-4 offset-3" /> }
                    { formularioAlert.errorEmail && <AlertError mensaje="El correo ingresado ya existe, intente con otro" tamaño="col-md-5 offset-3" /> }
                </div>
            </div>
            <DataTable title="Registros Persona" data={filteredItems} columns={columns} highlightOnHover pagination fixedHeader paginationResetDefaultPage={resetPaginationToggle} paginationComponentOptions={paginationComponentOptions} 
                subHeader subHeaderComponent={subHeaderComponentMemo} persistTableHead onRowClicked={ r => rowSelect(r) }
		    />

            <div className="modal fade" id="exampleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel"> Registro de Persona </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={formReset}></button>
                        </div>
                        <div className="modal-body">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Datos Personales</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Más información</button>
                                </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab"><br/>
                                    <form className="row g-3 form-persona" autoComplete='off' onSubmit={registrar}>
                                        <div className="col-md-6">
                                            <TextField label="Nombre" error={valor.valorNom} className='col-md-10' helperText={mensaje.mensajeNom} name='nombrep' value={nombrep} onChange={cambiop} placeholder="Ingrese nombre"
                                                       onKeyUp={validarNombre} InputProps={{ startAdornment: ( <InputAdornment position="start"> <FaUserPlus className='icon-registrar' /></InputAdornment>),}} variant="standard"/>
                                        </div>                           
                                        <div className="col-md-6">
                                            <TextField label="Apellido" error={valor.valorAp} className='col-md-10' helperText={mensaje.mensajeAp} name='apellidop' value={apellidop} onChange={cambiop} placeholder="Ingrese apellido"
                                                       onKeyUp={validarApellido} InputProps={{ startAdornment: ( <InputAdornment position="start"> <FaUserPlus className='icon-registrar'/></InputAdornment>),}} variant="standard"/>
                                        </div><br/><br/><br/><br/>
                                        <div className="col-md-6">
                                            <TextField label="Email" error={valor.valorEm} className='col-md-10' helperText={mensaje.mensajeEm} name='emailp' value={emailp} onChange={cambiop} placeholder="Ingrese un email"
                                                       onKeyUp={validarEmail} InputProps={{ startAdornment: ( <InputAdornment position="start"> <MdEmail className='icon-registrar'/></InputAdornment>),}} variant="standard"/>
                                        </div>
                                        <div className="col-md-6">
                                            <TextField label="Teléfono" error={valor.valorTelf} className='col-md-10' helperText={mensaje.mensajeTelf} name='telefonop' value={telefonop} onChange={cambiop} placeholder="Ingrese un teléfono"
                                                       onKeyUp={validarTelefono} InputProps={{ startAdornment: ( <InputAdornment position="start"> <BsFillTelephoneFill className='icon-registrar'/></InputAdornment>),}} variant='standard'/>
                                        </div><br/><br/><br/><br/>
                                        <div className="col-md-12">
                                            <TextField label="Dirección" error={valor.valorDir} className='col-md-10' helperText={mensaje.mensajeDir} name='direccionp' value={direccionp} onChange={cambiop} placeholder="Ingrese una dirección"
                                                       onKeyUp={validarDireccion} InputProps={{ startAdornment: ( <InputAdornment position="start"> <FaAddressCard className='icon-registrar' /></InputAdornment>),}} variant='standard'/>
                                        </div><br/><br/><br/><br/>      
                                        <div className="col-md-6">
                                            <TextField label="Ciudad" error={valor.valorCiu} className='col-md-10' helperText={mensaje.mensajeCiu} name='ciudadp' value={ciudadp} onChange={cambiop} placeholder="Ingrese una ciudad"
                                                       onKeyUp={validarCiudad} InputProps={{ startAdornment: ( <InputAdornment position="start"> <FaCity className='icon-registrar'/></InputAdornment>),}} variant='standard'/>
                                        </div>
                                        <div className="col-md-2">
                                            <TextField label="Código postal" error={valor.valorCod} className='col-md-10' helperText={mensaje.mensajeCod} name='codigo_postalp' value={codigo_postalp} onChange={cambiop} placeholder="Ingrese zip"
                                                       onKeyUp={validarPostal} InputProps={{ startAdornment: ( <InputAdornment position="start"> <BsFilePost className='icon-registrar' /></InputAdornment>),}} label="Código postal" variant='standard'/>
                                        </div>
                                        <div className="col-md-4">
                                            <TextField label="País" error={valor.valorPais} className='col-md-10' helperText={mensaje.mensajePais} name='paisp' value={paisp} onChange={cambiop} placeholder="Ingrese un país"
                                                       onKeyUp={validarPais} InputProps={{ startAdornment: ( <InputAdornment position="start"> <GiBlackFlag className='icon-registrar' /></InputAdornment>),}} variant='standard'/>
                                        </div>
                                        <div className="row mt-5"><br/><br/>
                                            <label htmlFor="select-estado" className="col-md-1 col-form-label">Estado:</label>
                                            <div className="col-md-4">
                                                <select id="select-estado" className="form-control form-select form-select-sm" aria-label="Default select example" name='estadop' value={estadop} onChange={cambiop}>
                                                    <option value={0} defaultValue>REGISTRO</option>
                                                    <option value={1}>PENDIENTE</option>
                                                    <option value={2}>CON CONTRATO</option>
                                                    <option value={3}>SIN CASO</option>
                                                </select>
                                            </div>
                                        </div>
                                        { formularioAlert.error && <AlertError mensaje="Todos los campos son obligatorios" tamaño="col-md-4 offset-4" /> }
                                        { formularioAlert.errorValidacion && <AlertError mensaje="Todos los campos deben ser válidos" tamaño="col-md-4 offset-4" /> }
                                        { formularioAlert.errorEmail && <AlertError mensaje="El correo ingresado ya existe, intente con otro" tamaño="col-md-5 offset-4"/> }
                                        { formularioAlert.success && <AlertSucces mensaje="registrada" tamaño="col-md-4 offset-4" /> }
                                        <div className="modal-footer">
                                            <Tooltip title="Cancelar" placement="left"><IconButton aria-label="delete" data-bs-dismiss="modal" onClick={formReset}><MdCancel /></IconButton></Tooltip>
                                            <Tooltip title="Guardar" placement="top"><IconButton type='submit' color="primary"><IoIosSave /></IconButton></Tooltip>
                                        </div>
                                    </form>
                                </div>
                                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">Profile</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="editModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel"> Editar Persona </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={formReset}></button>
                        </div>
                        <div className="modal-body">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Datos Personales</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Más información</button>
                                </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab"><br/>
                                    <form className="row g-3 form-persona" autoComplete='off' onSubmit={editar}>
                                        <div className="col-md-6">
                                            <TextField label="Nombre" error={valor.valorNom} className='col-md-10' helperText={mensaje.mensajeNom} name='nombre' value={nombre} onChange={cambio} 
                                                onKeyUp={validarNombreEdit} InputProps={{ startAdornment: ( <InputAdornment position="start"> <FaUserPlus className='icon-registrar' /></InputAdornment>),}} variant="standard"/>
                                        </div>
                                        <div className="col-md-6">
                                            <TextField label="Apellido" error={valor.valorAp} className='col-md-10' helperText={mensaje.mensajeAp} name='apellido' value={apellido} onChange={cambio} 
                                                onKeyUp={validarApellidoEdit} InputProps={{ startAdornment: ( <InputAdornment position="start"> <FaUserPlus className='icon-registrar'/></InputAdornment>),}} variant="standard"/>
                                        </div><br/><br/><br/><br/>
                                        <div className="col-md-6">
                                            <TextField label="Email" error={valor.valorEm} className='col-md-10' helperText={mensaje.mensajeEm} name='email' value={email} onChange={cambio} 
                                                onKeyUp={validarEmailEdit} InputProps={{ startAdornment: ( <InputAdornment position="start"> <MdEmail className='icon-registrar'/></InputAdornment>),}} variant="standard"/>
                                        </div>
                                        <div className="col-md-6">
                                            <TextField label="Teléfono" error={valor.valorTelf} className='col-md-10' helperText={mensaje.mensajeTelf} name='telefono' value={telefono} onChange={cambio} 
                                                onKeyUp={validarTelefonoEdit} InputProps={{ startAdornment: ( <InputAdornment position="start"> <BsFillTelephoneFill className='icon-registrar'/></InputAdornment>),}} variant='standard'/>
                                        </div><br/><br/><br/><br/>
                                        <div className="col-md-12">
                                            <TextField label="Dirección" error={valor.valorDir} className='col-md-10' helperText={mensaje.mensajeDir} name='direccion' value={direccion} onChange={cambio} 
                                                onKeyUp={validarDireccionEdit} InputProps={{ startAdornment: ( <InputAdornment position="start"> <FaAddressCard className='icon-registrar' /></InputAdornment>),}} variant='standard'/>
                                        </div><br/><br/><br/><br/>      
                                        <div className="col-md-6">
                                            <TextField label="Ciudad" error={valor.valorCiu} className='col-md-10' helperText={mensaje.mensajeCiu} name='ciudad' value={ciudad} onChange={cambio} 
                                                onKeyUp={validarCiudadEdit} InputProps={{ startAdornment: ( <InputAdornment position="start"> <FaCity className='icon-registrar'/></InputAdornment>),}} variant='standard'/>
                                        </div>
                                        <div className="col-md-2">
                                            <TextField label="Código postal" error={valor.valorCod} className='col-md-10' helperText={mensaje.mensajeCod} name='codigo_postal' value={codigo_postal} onChange={cambio} 
                                                onKeyUp={validarPostalEdit} InputProps={{ startAdornment: ( <InputAdornment position="start"> <BsFilePost className='icon-registrar' /></InputAdornment>),}} label="Código postal" variant='standard'/>
                                        </div>
                                        <div className="col-md-4">
                                            <TextField label="País" error={valor.valorPais} className='col-md-10' helperText={mensaje.mensajePais} name='pais' value={pais} onChange={cambio} 
                                                onKeyUp={validarPaisEdit} InputProps={{ startAdornment: ( <InputAdornment position="start"> <GiBlackFlag className='icon-registrar' /></InputAdornment>),}} variant='standard'/>
                                        </div>
                                        <div className="row mt-5"><br/><br/>
                                            <label htmlFor="select-estado" className="col-md-1 col-form-label">Estado:</label>
                                            <div className="col-md-4">
                                                <select id="select-estado" className="form-control form-select form-select-sm" aria-label="Default select example" name='estado' value={estado} onChange={cambio}>
                                                    <option value={0} defaultValue>REGISTRO</option>
                                                    <option value={1}>PENDIENTE</option>
                                                    <option value={2}>CON CONTRATO</option>
                                                    <option value={3}>SIN CASO</option>
                                                </select>
                                            </div>
                                        </div>
                                        { formularioAlert.error && <AlertError mensaje="Todos los campos son obligatorios" tamaño="col-md-4 offset-4" /> }
                                        { formularioAlert.errorValidacion && <AlertError mensaje="Todos los campos deben ser válidos" tamaño="col-md-4 offset-4" /> }
                                        <div className="modal-footer">
                                        <Tooltip title="Cancelar" placement="left"><IconButton aria-label="delete" data-bs-dismiss="modal" onClick={formReset}><MdCancel /></IconButton></Tooltip>
                                        <Tooltip title="Guardar" placement="top"><IconButton type='submit' color="primary" data-bs-dismiss={cerrar} onMouseEnter={validarCampos}><IoIosSave /></IconButton></Tooltip>
                                        </div>
                                    </form>
                                </div>
                                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">Profile</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-sm">
                    <div className="modal-content">
                        <div className="card text-center border-danger">
                            <div className="card-header text-danger border-danger">Eliminar Persona</div>
                            <div className="card-body">
                                <p className="card-text">¿Está seguro de eliminar a {nombre}?</p>
                                <Tooltip title="Cancelar" placement="left"><IconButton aria-label="delete" data-bs-dismiss="modal" onClick={limpiar}><MdCancel className='cancel'/></IconButton></Tooltip>
                                <Tooltip title="Confirmar" placement="right"><IconButton type='submit' color="primary" data-bs-dismiss="modal" onClick={eliminar}><IoIosCheckmarkCircle className='confirm'/></IconButton></Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                
        </div>

    )
};

export default Personas;