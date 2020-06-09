import axios from 'axios';
import { updateDB, getFavs } from '../firebase';
import ApolloClient ,{ gql } from 'apollo-boost';

//Constants 
const initialData = {
    fetching: false,
    array: [],
    current: {},
    favorites: [],
    nextPage: 1
};

const URL = "https://rickandmortyapi.com/api/character";
const remoteGraphQL = "https://rickandmortyapi.com/graphql";

const client = new ApolloClient({
    uri: remoteGraphQL
});

//Esto solo lo utilizaremos para comunicaciones con el backend

//LOS CARACTERES DESDE EL API
const GET_CHARACTERS = "GET_CHARACTERS";
const GET_CHARACTERS_SUCCESS = "GET_CHARACTERS_SUCCESS";
const GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR";

const UPDATE_PAGE = "UPDATE_PAGE";

//LOS CARACTERES FAVORITOS DESDE FIREBASE
const GET_FAVS = "GET_FAVS";
const GET_FAVS_SUCCESS = "GET_FAVS_SUCCESS";
const GET_FAVS_ERROR = "GET_FAVS_ERROR";

//SIMPLE ACTIONS
const REMOVE_CHARACTERS = "REMOVE_CHARACTERS";
const ADD_TO_FAVORITES = "ADD_TO_FAVORITES";

//Reducer
export default function reducer(state = initialData, action){
    switch(action.type){
        
        //AGREGAR O QUITAR FAVORITOS
        case ADD_TO_FAVORITES:
            return {...state, ...action.payload}
        case REMOVE_CHARACTERS:
            return {...state, array: action.payload}

        //ACTUALIZAR LA PAGINA CUANDO SE ACABEN LOS RESULTADOS
        case UPDATE_PAGE:
            return {...state, nextPage: action.payload}

        //CARGAR FAVORITOS DESDE FIREBASE
        case GET_FAVS:
            return {...state, fetching: true}
        case GET_FAVS_ERROR:
            return {...state, error: action.payload, fetching: false}
        case GET_FAVS_SUCCESS:
            return {...state, favorites: action.payload, fetching: false}


        //CARGAR CHARACTERS DESDE EL API
        case GET_CHARACTERS:
            return {...state, fetching: true}
        case GET_CHARACTERS_ERROR:
            return {...state, error: action.payload, fetching: false}
        case GET_CHARACTERS_SUCCESS:
            return {...state, array: action.payload, fetching: false}

        default :
            return state;
    }
}

//Actions (Action creator)


export const getCharactersAction = () => (dispatch,getState) => {

    let query = gql`
        query ($page: Int) {
            characters(page:$page){
                info{
                    pages
                    next
                    prev
                }
                results{
                    name
                    image
                }
            }
        }
    `;

    //Ponemos el estado como cargando
    dispatch({
        type: GET_CHARACTERS
    });

    let {nextPage} = getState().characters;

    return client.query({
        query,
        variables: {page: nextPage}
    })
    .then(({data, error}) => {
        if(error) {
            dispatch({
                type: GET_CHARACTERS_ERROR,
                payload: error
            }); 
            return;
        }

        dispatch({
            type: GET_CHARACTERS_SUCCESS,
            payload: data.characters.results
        });

        dispatch({
            type: UPDATE_PAGE,
            payload: data.characters.info.next ? data.characters.info.next : 1
        });
    })
    .catch(error => {
        console.log(error);
    });

    // return axios.get(URL)
    //         .then(res => {
    //             dispatch({
    //                 type: GET_CHARACTERS_SUCCESS,
    //                 payload: res.data.results
    //             });
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             dispatch({
    //                 type: GET_CHARACTERS_ERROR,
    //                 payload: error.response.message
    //             });
    //         });
};


export const removeCharactersAction = () => (dispatch, getState) => {
    const {array} = getState().characters;
    array.shift();

    if(!array.length){
        getCharactersAction()(dispatch, getState);
        return;
    }

    dispatch({
        type: REMOVE_CHARACTERS,
        payload: [...array]
    });
};


export const addToFavoritesAction = () => (dispatch, getState) => {
    const { array, favorites } = getState().characters;
    const { uid } = getState().user;
    const char = array.shift();
    favorites.push(char);
    
    updateDB(favorites, uid);

    dispatch({
        type: ADD_TO_FAVORITES,
        payload: { array:[...array], favorites:[...favorites] }
    });
};


export const retriveFavoritesAction = () => (dispatch, getState) => {

    //Ponemos el estado como cargando
    dispatch({
        type: GET_FAVS
    });

    const { uid } = getState().user;
    return getFavs(uid)
            .then(favorites => {
                dispatch({
                    type: GET_FAVS_SUCCESS,
                    payload: [...favorites]
                });
            })
            .catch(e => {
                console.log(e);
                dispatch({
                    type: GET_FAVS_ERROR,
                    payload: e.message
                });
            });

    
};