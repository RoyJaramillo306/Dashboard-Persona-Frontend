import React, { useContext } from 'react';
import './Sidebar.css';
import { IoIosPeople } from "react-icons/io";
import logo from '../../../assets/images/logo.png';
import { MdMenu, MdOutlinePendingActions, MdAnalytics } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";

const Sidebar = () => {

    let contador = 0;

    const cambio = () => {

        let sidebar = document.querySelector(".sidebar");
        contador++;

        if(contador%2==0){
            sidebar.setAttribute("class", "sidebar");
        }else{
            sidebar.setAttribute("class", "sidebar active");
        }

    }

    return (

        <>  

            <div className="sidebar">

                <div className="menu">
                    <img className='img-logo' src={logo} />
                    <i id="btn" onClick={cambio}><MdMenu /></i>
                </div><hr/>
            
                <ul className="list-group">

                    <li className="list-group-iten">
                        <NavLink className="nav" exact to="/dashboard" data-toggle="tooltip" data-placement="right" title="Dashboard">
                            <i><MdAnalytics /></i>
                            <div>Dashboard</div>
                        </NavLink>
                    </li>

                    <li className="list-group-iten">
                        <NavLink className="nav" exact to="/personas" data-toggle="tooltip" data-placement="right" title="Personas">
                            <i><IoIosPeople /></i>
                            <div>Personas</div>
                        </NavLink>
                    </li>

                    <li className="list-group-iten">
                        <NavLink className="nav" exact to="/usuarios" data-toggle="tooltip" data-placement="right" title="Usuarios"> 
                            <i><FaUserFriends /></i>
                            <div>Usuarios</div>
                        </NavLink>
                    </li>

                    <li className="list-group-iten">
                        <NavLink className="nav" exact to="/casos" data-toggle="tooltip" data-placement="right" title="Casos">
                            <i><MdOutlinePendingActions /></i>
                            <div>Casos</div>
                        </NavLink>
                    </li>

                </ul>

            </div>

            {/* <div className="sidebar">
                <div className="logo-details">
                    <div className="logo_name">KairosConsulting</div>
                    <i id='btn' onClick={cambio}><MdMenu /></i>
                    <hr />
                </div>
                <ul className="nav-list">
                    <li>
                        <NavLink className="nav" exact to="/personas">
                            <i><IoIosPeople /></i>
                            <span className="links_name"> Personas</span>
                        </NavLink>
                        <span className="tooltip"> Personas</span>
                    </li>
                    <li>
                        <NavLink className="nav" exact to="/usuarios">
                            <i><FaUserFriends /></i>
                            <span className="links_name"> Usuarios</span>
                        </NavLink>
                        <span className="tooltip"> Usuarios</span>
                    </li>
                    <li>
                        <NavLink className="nav" exact to="/casos">
                            <i><MdOutlinePendingActions /></i>
                            <span className="links_name"> Casos</span>
                        </NavLink>
                        <span className="tooltip"> Casos</span>
                    </li>
                </ul>
            </div> */}
        </>

    )

};

export default Sidebar;