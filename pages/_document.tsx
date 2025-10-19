import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Basic Meta Tags */}
        <meta name="description" content="Join Ragnarok Libre Clutch - The ultimate creator leaderboard platform. Compete with content creators worldwide, earn $DELABS tokens, and track your performance with integrated YouTube and Twitch analytics." />
        <meta name="keywords" content="Ragnarok Libre, Clutch, creator leaderboard, gaming content, DELABS token, YouTube creators, Twitch streamers, gaming rewards, content creator platform, WEMIX NIGHTCROWS" />
        <meta name="author" content="Ragnarok Libre" />
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
        <meta property="og:title" content="Ragnarok Libre Clutch - Creator Leaderboard & Rewards Platform" />
        <meta property="og:description" content="Join the ultimate gaming creator competition. Submit content, refer players, and earn $DELABS tokens based on your leaderboard ranking." />
        <meta property="og:image" content="https://ragnaroklibre-clutch-production.up.railway.app/1200x630.png" />
        <meta property="og:url" content="https://ragnaroklibre-clutch-production.up.railway.app" />
        <meta property="og:site_name" content="Ragnarok Libre Clutch" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ragnarok Libre Clutch - Creator Leaderboard & Rewards Platform" />
        <meta name="twitter:description" content="Join the ultimate gaming creator competition. Submit content, refer players, and earn $DELABS tokens based on your leaderboard ranking." />
        <meta name="twitter:image" content="https://ragnaroklibre-clutch-production.up.railway.app/1200x630.png" />
        
        {/* Theme */}
        <meta name="theme-color" content="#FF0000" />
        <meta name="msapplication-TileColor" content="#FF0000" />
        <meta name="apple-mobile-web-app-title" content="Ragnarok Libre Clutch" />
        <meta name="application-name" content="Ragnarok Libre Clutch" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Ragnarok Libre Clutch",
              "description": "Creator leaderboard and rewards platform for Ragnarok Libre gaming content",
              "url": "https://ragnaroklibre-clutch-production.up.railway.app",
              "applicationCategory": "GameApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "Ragnarok Libre"
              }
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
