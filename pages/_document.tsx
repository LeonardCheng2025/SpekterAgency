import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Basic Meta Tags */}
        <meta name="description" content="Spekter Agency Creator Competition - Compete with creators from YouTube, Twitch, Facebook, and X. Create content, get referrals, and earn rewards. Track your performance and climb the leaderboard!" />
        <meta name="keywords" content="Spekter Agency, creator competition, YouTube creators, Twitch streamers, Facebook creators, X creators, content creation, referral program, gaming rewards, creator leaderboard, Spekter Games" />
        <meta name="author" content="Spekter Agency" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en-US" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/SG-Background.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/SG-Background.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/SG-Background.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/SG-Background.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/SG-Background.png" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Spekter Agency Creator Competition - Compete & Earn Rewards" />
        <meta property="og:description" content="Join the creator competition! Create content, get referrals, and earn rewards. Compete with creators from YouTube, Twitch, Facebook, and X. Track your performance and climb the leaderboard!" />
        <meta property="og:image" content="https://spekter-agency.vercel.app/1200x630.png" />
        <meta property="og:url" content="https://spekter-agency.vercel.app" />
        <meta property="og:site_name" content="Spekter Agency Creator Competition" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Spekter Agency Creator Competition - Compete & Earn Rewards" />
        <meta name="twitter:description" content="Join the creator competition! Create content, get referrals, and earn rewards. Compete with creators from YouTube, Twitch, Facebook, and X. Track your performance and climb the leaderboard!" />
        <meta name="twitter:image" content="https://spekter-agency.vercel.app/1200x630.png" />
        
        {/* Theme */}
        <meta name="theme-color" content="#346FC4" />
        <meta name="msapplication-TileColor" content="#346FC4" />
        <meta name="apple-mobile-web-app-title" content="Spekter Agency Creator Competition" />
        <meta name="application-name" content="Spekter Agency Creator Competition" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Spekter Agency Creator Competition",
              "description": "Creator competition platform where content creators from YouTube, Twitch, Facebook, and X compete for rewards by creating content and getting referrals to play Spekter Agency.",
              "url": "https://spekter-agency.vercel.app",
              "applicationCategory": "SocialNetworkingApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Spekter Agency"
              },
              "audience": {
                "@type": "Audience",
                "audienceType": "Content Creators"
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
