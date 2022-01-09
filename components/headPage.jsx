import Head from "next/head";

// Component untuk mengkonfigurasi tampilan meta data jika link dari website dishare
// konfigurasi yang diterapkan pada og atau open graph meta data
// open graph meta data merupakan konfigurasi untuk open browse atau situs umum
const HeadPage = (props) => {
    console.log("cek meta url", props.url)
    return <Head>
        <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
        ></link>
        <title>{props.title} | Commerce</title>
        <meta property="og:title" content={`${props.title} | Commerce`} key="title" />
        <meta property="og:description" content={props.description} />
        <meta property="og:image" itemProp="image" content={props.image} key="ogimage" />
        <meta property="og:site_name" content={"Commerce"} key="ogsitename" />
        <meta property="og:type" content="website" />

        {/* <!-- HTML Meta Tags --> */}
        <meta name="description" content="All Products Collection by Commerce" />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content={`https://commerce-next-abdi-01.vercel.app${props.url?.includes("?") ? props.url : "/products/"}`} />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="commerce-next-abdi-01.vercel.app" />
        <meta property="twitter:url" content="https://commerce-next-abdi-01.vercel.app/products/" />
        <meta name="twitter:title" content={`${props.title} | Commerce`} />
        <meta name="twitter:description" content={props.description} />
        <meta name="twitter:image" content={props.image} />

        {/* <!-- Meta Tags Generated via https://www.opengraph.xyz --> */}


    </Head>
}

export default HeadPage