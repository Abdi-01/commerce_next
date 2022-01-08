// Tempat import konfigurasi css bootstrap
import '../styles/globals.css'; // global css hanya bisa diimport disini, jika diimport lagi ditempat lain akan terjadi error
import 'bootstrap/dist/css/bootstrap.min.css'; // css bootstrap untuk menggunakan reactstrap
import { Provider, useDispatch } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { rootReducers } from '../redux/reducers';
import ReduxThunk from 'redux-thunk'
import React, { useEffect } from 'react';

const globalStore = createStore(rootReducers, {}, applyMiddleware(ReduxThunk))

const MyApp = ({ Component, pageProps }) => {

  return (
    <Provider store={globalStore}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp;
