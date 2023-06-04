/* eslint-disable @next/next/no-page-custom-font */
import "./globals.css";

export const metadata = {
  title: "Sock - An AI-controlled puppet for streaming",
  description: "An AI-controlled puppet for streaming by Kyle Weems",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-bs-theme="dark">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ"
          crossOrigin="anonymous"
        ></link>
        <link rel="icon" href="/assets/icons/favicon-32.png" sizes="32x32" />
        <link rel="icon" href="/assets/icons/favicon-196.png" sizes="196x196" />
      </head>
      <body>{children}</body>
    </html>
  );
}
