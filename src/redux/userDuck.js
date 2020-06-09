import { loginWithGoogle, signOutGoogle } from '../firebase';
import { retriveFavoritesAction } from './charsDuck';

//Constants 
const initialData = {
    loggedIn : false,
    fetching : false
};

const LOGIN = "LOGIN";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_ERROR = "LOGIN_ERROR";


const LOG_OUT = "LOG_OUT";

//Reducer
export default function reducer(state = initialData, action){
    switch(action.type){
        case LOG_OUT:
            return { ...initialData }
        case LOGIN_SUCCESS:
            return { ...state, fetching: false, ...action.payload, loggedIn: true }
        case LOGIN_ERROR:
            return { ...state, fetching: false, error: action.payload, loggedIn: false }
        case LOGIN:
            return { ...state, fetching: true, loggedIn: false }
        default :
            return state;
    }
}


//Aux
const saveStorage = (storage) => {
    localStorage.storage = JSON.stringify(storage);
};


//Actions (Action creator)
export const logOutAction = () => (dispatch, getState) => {
    signOutGoogle();
    dispatch({
        type: LOG_OUT
    });
    localStorage.removeItem('storage');
}


export const restoreSessionAction = () => dispatch => {
    let storage = localStorage.getItem('storage');
    storage = JSON.parse(storage);

    if(storage && storage.user){
        dispatch({
            type: LOGIN_SUCCESS,
            payload: storage.user
        });
    }
}



export const doGoogleLoginAction = () => (dispatch, getState) => {
    
    dispatch({
        type: LOGIN
    });

    return loginWithGoogle()
           .then(user => {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: {
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL
                    }
                });

                //GUARDAMOS LOS DATOS EN EL LOCALSTORAGE
                saveStorage(getState());

                //LLAMAMOS LOS FAVORITOS
                retriveFavoritesAction()(dispatch, getState);
           })
           .catch(e => {
               console.log(e);
               dispatch({
                    type: LOGIN_ERROR,
                    payload: e.message
                });
           });
};