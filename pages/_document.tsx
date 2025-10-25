import { Html, Head, Main, NextScript } from 'next/document';
import { DocumentProps } from 'next/document';

export default function Document(props: DocumentProps) {
  return (
    <Html lang="en">
      <Head>
        {/* Preload background image */}
        <link
          rel="preload"
          as="image"
          href="/athena.jpg"
        />

        {/* Garamond font */}
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap"
          rel="stylesheet"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}