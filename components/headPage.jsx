import Head from "next/head";

// Component untuk mengkonfigurasi tampilan meta data jika link dari website dishare
// konfigurasi yang diterapkan pada og atau open graph meta data
// open graph meta data merupakan konfigurasi untuk open browse atau situs umum
const HeadPage = (props) => {
    return <Head>
        <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
        ></link>
        <title>{props.title} | Commerce</title>
        <meta property="og:title" content={`${props.title} | Commerce`} key="title" />
        <meta property="og:description" content={props.description} />
        <meta property="og:image" itemprop="image" content={props.image} key="ogimage" />
        <meta property="og:site_name" content={"Commerce"} key="ogsitename" />
        <meta property="og:type" content="website" />
    </Head>
}

export default HeadPage