//Constants 
const initialData = {
    loggedIn : false
};

const LOGIN = "LOGIN";

//Reducer
export default function reducer(state = initialData, action){
    switch(action.type){
        case LOGIN:
        default :
            return state;
    }
}


//Actions (Action creator)