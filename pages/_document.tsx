import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Exo+2:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        
        {/* Basic Meta Tags */}
        <meta name="description" content="Join Spekter Games - The ultimate creator leaderboard platform. Compete with content creators worldwide, earn rewards, and track your performance with integrated YouTube and Twitch analytics." />
        <meta name="keywords" content="Spekter Games, creator leaderboard, gaming content, YouTube creators, Twitch streamers, gaming rewards, content creator platform, gaming competition" />
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
        <meta property="og:title" content="Spekter Games - Creator Leaderboard & Rewards Platform" />
        <meta property="og:description" content="Join the ultimate gaming creator competition. Submit content, refer players, and earn rewards based on your leaderboard ranking." />
        <meta property="og:image" content="https://spekter-agency.vercel.app/1200x630.png" />
        <meta property="og:url" content="https://spekter-agency.vercel.app" />
        <meta property="og:site_name" content="Spekter Games" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Spekter Games - Creator Leaderboard & Rewards Platform" />
        <meta name="twitter:description" content="Join the ultimate gaming creator competition. Submit content, refer players, and earn rewards based on your leaderboard ranking." />
        <meta name="twitter:image" content="https://spekter-agency.vercel.app/1200x630.png" />
        
        {/* Theme */}
        <meta name="theme-color" content="#346FC4" />
        <meta name="msapplication-TileColor" content="#346FC4" />
        <meta name="apple-mobile-web-app-title" content="Spekter Games" />
        <meta name="application-name" content="Spekter Games" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Spekter Games",
              "description": "Creator leaderboard and rewards platform for gaming content creators",
              "url": "https://spekter-agency.vercel.app",
              "applicationCategory": "GameApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "Spekter Games"
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
