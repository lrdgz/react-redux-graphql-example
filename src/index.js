import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import 'font-awesome/css/font-awesome.css';
import { Provider } from 'react-redux';
import generateStore from './redux/store';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import 'cross-fetch/polyfill';

const store = generateStore();

//https://www.robinwieruch.de/graphql-apollo-client-tutorial

const remoteGraphQL = "https://rickandmortyapi.com/graphql";

const client = new ApolloClient({
    uri: remoteGraphQL
});

let WithRouter = () => <BrowserRouter><App /></BrowserRouter>;
let WithStore = () => <Provider store={ store } ><WithRouter /></Provider>;
let WithApollo = () => <ApolloProvider client={ client } ><WithStore /></ApolloProvider>;


ReactDOM.render(<WithApollo />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
