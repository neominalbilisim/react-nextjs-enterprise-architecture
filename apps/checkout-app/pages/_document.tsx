import Document, { Html, Head, Main, NextScript } from "next/document";
import type { DocumentContext, DocumentInitialProps } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    return Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="tr">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
