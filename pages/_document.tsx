import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/icon.png" />
                <meta name="theme-color" content="#fe2c55" />

                <link rel="icon" href="/favicon.ico" />
                <meta charSet="utf-8" />
                <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
                <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
                <meta name="referrer" content="always" />
                <meta httpEquiv="X-UA-Compatible" />

                <meta name="twitter:label1" content="Prime Couples" />
                <meta name="twitter:domain" content="primecouples.com" />
                <meta name="twitter:card" content="summary_large_image" />

            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}