// src/pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from 'next/script'; // Import the next/script component

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Set a character set */}
          <meta charSet="utf-8" />
          {/* Add any default meta tags, favicon, or external fonts here */}
          <link rel="icon" href="/favicon.ico" />
          {/* Example: Preconnect to Google Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        </Head>
        <body>
          <Main />
          <NextScript />

          {/* Infolinks Ad Code - Load asynchronously using Next.js Script component */}
          <Script
            id="infolinks-inline-script" // Add a unique ID for the inline script
            type="text/javascript"
            strategy="afterInteractive" // Makes the script load after the page is interactive
          >
            {`
              var infolinks_pid = 3435655;
              var infolinks_wsid = 0;
            `}
          </Script>
          <Script
            id="infolinks-main-script" // Add a unique ID for the external script
            type="text/javascript"
            src="//resources.infolinks.com/js/infolinks_main.js"
            strategy="afterInteractive" // Ensures the script loads asynchronously after the page is interactive
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
