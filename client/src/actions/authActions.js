import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode'

export const registerUser = (userData, history) => (dispatch) => {

    axios.post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err => {
            dispatch({
                type: 'ERRORS_MANAGE',
                payload: err.response.data
            })

        })
}

//login get user tocken
export const loginUser = (userData) => (dispatch) => {
    axios.post('/api/users/login', userData)
        .then(res => {

            //save to local storeage
            const { token } = res.data;
            localStorage.setItem('jwtToken', token);

            //set tocken to auth header
            setAuthToken(token);

            //decode tocken to get user data
            const decoded = jwt_decode(token)

            //set current user in state
            dispatch(setCurrentUser(decoded))

        })
        .catch(err => dispatch({
            type: 'ERRORS_MANAGE',
            payload: err.response.data
        }))
};

//set current user action required in loginUser Action

export const setCurrentUser = (decoded) => {
    return {
        type: 'SET_CURRENT_USER',
        payload: decoded
    }
};

export const logoutUser = () => (dispatch) => {

    //delete the local storage
    localStorage.removeItem('jwtToken');

    //delete the axios authorosation header

    setAuthToken(false);

    //set the current user to null and is authencated to flase

    dispatch(setCurrentUser({}));

}
