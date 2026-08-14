import Document, { Html, Head, Main, NextScript } from "next/document";
import type { DocumentContext, DocumentInitialProps } from "next/document";

// nextjs-mf: getInitialProps olmadan Next sayfayı statik sanır ve
// Module Federation server runtime oluşmaz (React hook'ları SSR'de kırılır).

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    return Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="tr">
        <Head>
          <title>React & NextJS Enterprise Starter</title>
          <meta
            name="description"
            content="Neominal Akademi — React & NextJS Enterprise Architecture eğitimi başlangıç projesi"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
