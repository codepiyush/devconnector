import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser} from './actions/authActions'

//import Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'


//to maintain login in again if refresh 


if(localStorage.jwtToken){
    //set ayth token header auth

    setAuthToken(localStorage.jwtToken);

    //decode token to get user info and exp

    const decoded = jwt_decode(localStorage.jwtToken);

    //set current user using actions
    store.dispatch(setCurrentUser(decoded));

    //check for expired token
    const currenttime  = Date.now()/1000;
    if(decoded.exp <currenttime){
        store.dispatch(logoutUser);
        //redirect to login page
        window.location.href('/login')
    }
}

class App extends React.Component {
    render() {
        return (
            <Provider store = {store}>
            <Router>
                <div className="App">
                    <Navbar />
                    <Route exact path="/" component={Landing} />
                    <div className="container">
                        <Route exact path='/register' component={Register} />
                        <Route exact path='/login' component={Login} />
                    </div>
                    <Footer />
                </div>
            </Router>
            </Provider>
        )
    }
}
export default App;