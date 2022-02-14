import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from '../pages/auth/Login';
import Home from '../pages/dashboard/Home';
import PrivateRouter from './PrivateRouter';

const AppRouter = () => {

    return (
        
        <Router>
            <div>
                <Switch>
                    <Route exact path="/login" component={ Login }/>
                    <PrivateRouter path="/" component={ Home }/>
                </Switch>
            </div>
        </Router>

    )

};

export default AppRouter;