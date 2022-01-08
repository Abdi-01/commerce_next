// Tempat import konfigurasi css bootstrap
import '../styles/globals.css'; // global css hanya bisa diimport disini, jika diimport lagi ditempat lain akan terjadi error
import 'bootstrap/dist/css/bootstrap.min.css'; // css bootstrap untuk menggunakan reactstrap
import { Provider, useDispatch } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { rootReducers } from '../redux/reducers';
import ReduxThunk from 'redux-thunk'
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

// Google Analytics Import
import * as gtag from "../lib/gtag"
import Script from 'next/script';

const globalStore = createStore(rootReducers, {}, applyMiddleware(ReduxThunk))

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();

  // Ketika ada perubahan di route, akan trigger useEffect
  useEffect(() => {
    console.log("CEK GA ID", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS)
    const handleRouteChange = (url) => {
      console.log("CEK ROUTE PAGE GA", url)
      gtag.pageview(url);
    };
    console.log("CEK ROUTE ", router.events)
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <Provider store={globalStore}>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <Script id="gtag-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
  
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
            page_path: window.location.pathname,
          });
          `}
      </Script>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp;
