import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';


const initialState = {}
const middleware = [thunk];
const store = createStore (
    rootReducer, //all the reducers combined
    initialState, //initial state, empty in this case
    compose(applyMiddleware(...middleware),// middleware thunk added
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) //use this for using redux dev tools
    )

export default store;