export default function Head() {
  return (
    <>
      <link rel="manifest" href="/manifest.json" />

      <meta name="theme-color" content="#ffffff" />

      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />

      <meta name="mobile-web-app-capable" content="yes" />

      <link
        rel="apple-touch-icon"
        sizes="192x192"
        href="/icons/logo-192x192.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="512x512"
        href="/icons/logo-512x512.png"
      />
    </>
  );
}
