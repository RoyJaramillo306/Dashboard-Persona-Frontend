import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer>
            <div className="bottom-details">
                <div className="bottom_text">
                    <span className="copyright_text">Copyright © 2022 <strong>Kairos Consulting</strong> All rights reserved</span>
                    <span className="version"> Versión 1.0.0 </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;