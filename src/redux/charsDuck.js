import axios from 'axios';

//Constants 
const initialData = {
    fetching: false,
    array: [],
    current: {}
};

const URL = "https://rickandmortyapi.com/api/character";

//Esto solo lo utilizaremos para comunicaciones con el backend
const GET_CHARACTERS = "GET_CHARACTERS";
const GET_CHARACTERS_SUCCESS = "GET_CHARACTERS_SUCCESS";
const GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR";


const REMOVE_CHARACTERS = "REMOVE_CHARACTERS";

//Reducer
export default function reducer(state = initialData, action){
    switch(action.type){
        case GET_CHARACTERS:
            return {... state, fetching: true}
        case GET_CHARACTERS_ERROR:
            return {... state, error: action.payload, fetching: false}
        case GET_CHARACTERS_SUCCESS:
            return {... state, array: action.payload, fetching: false}
        case REMOVE_CHARACTERS:
            return {... state, array: action.payload}
        default :
            return state;
    }
}

//Actions (Action creator)


export const getCharactersAction = () => (dispatch,getState) => {

    //Ponemos el estado como cargando
    dispatch({
        type: GET_CHARACTERS
    });

    return axios.get(URL)
            .then(res => {
                dispatch({
                    type: GET_CHARACTERS_SUCCESS,
                    payload: res.data.results
                });
            })
            .catch(error => {
                console.log(error);
                dispatch({
                    type: GET_CHARACTERS_ERROR,
                    payload: error.response.message
                });
            });
};


export const removeCharactersAction = () => (dispatch, getState) => {
    const {array} = getState().characters;
    array.shift();


    //Ponemos el estado como cargando
    dispatch({
        type: REMOVE_CHARACTERS,
        payload: [...array]
    });
};