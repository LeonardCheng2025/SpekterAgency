import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Basic Meta Tags */}
        <meta name="description" content="Spekter Agency - Next-gen rogue-lite survivor game on Telegram. Hunt spirits, build combos, earn Spark points. Web2 gameplay meets Web3 rewards. Play now on Telegram!" />
        <meta name="keywords" content="Spekter Agency, Spekter Games, rogue-lite, survivor game, Telegram game, Web3 gaming, blockchain game, mobile game, spirit hunting, Spark points, next-gen gaming" />
        <meta name="author" content="Spekter Games" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en-US" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/512x512.png" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Spekter Agency - Next-Gen Rogue-lite Survivor Game on Telegram" />
        <meta property="og:description" content="Hunt spirits, build combos, earn Spark points. Spekter Agency combines Web2 gameplay with Web3 rewards. Play now on Telegram - no download required!" />
        <meta property="og:image" content="https://spekter-agency.vercel.app/1200x630.png" />
        <meta property="og:url" content="https://spekter-agency.vercel.app" />
        <meta property="og:site_name" content="Spekter Agency" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Spekter Agency - Next-Gen Rogue-lite Survivor Game on Telegram" />
        <meta name="twitter:description" content="Hunt spirits, build combos, earn Spark points. Spekter Agency combines Web2 gameplay with Web3 rewards. Play now on Telegram - no download required!" />
        <meta name="twitter:image" content="https://spekter-agency.vercel.app/1200x630.png" />
        
        {/* Theme */}
        <meta name="theme-color" content="#346FC4" />
        <meta name="msapplication-TileColor" content="#346FC4" />
        <meta name="apple-mobile-web-app-title" content="Spekter Agency" />
        <meta name="application-name" content="Spekter Agency" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoGame",
              "name": "Spekter Agency",
              "description": "Next-gen rogue-lite survivor game on Telegram. Hunt spirits, build combos, earn Spark points. Web2 gameplay meets Web3 rewards.",
              "url": "https://spekter-agency.vercel.app",
              "applicationCategory": "Game",
              "operatingSystem": "Telegram, Mobile",
              "genre": "Rogue-lite, Survivor, Action",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Spekter Games"
              },
              "gamePlatform": "Telegram",
              "playMode": "SinglePlayer"
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
