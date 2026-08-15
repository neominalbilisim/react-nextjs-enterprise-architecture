import Document, { Html, Head, Main, NextScript } from "next/document";
import type { DocumentContext, DocumentInitialProps } from "next/document";


// Problem: Next.js, normalde sayfalarda getInitialProps veya getServerSideProps gibi 
// server-side method'lar görmezse sayfayı statik olarak build eder. Module Federation ise runtime'da dinamik import yapıyor.

//Sonuç: Module Federation'ın server runtime'ı oluşmaz ve federated component'ler yüklenirken React hook'ları patlar

// nextjs-mf: getInitialProps olmadan Next sayfayı statik sanır ve
// Module Federation server runtime oluşmaz (React hook'ları SSR'de kırılır).
// Bu dosya olmadan, shell'deki federated import'lar (checkout/CheckoutStep1, 
// checkout/pages/CheckoutStep1Page vb.) çalışmaz. 
// Module Federation'ın ihtiyaç duyduğu server-side chunk'ları oluşturmak için gerekli.

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
