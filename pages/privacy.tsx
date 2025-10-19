import Head from 'next/head'
import Link from 'next/link'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Clutch</title>
        <meta name="description" content="Privacy Policy for Clutch platform" />
      </Head>

      <div className="min-h-screen bg-bg">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-lg border-b border-brand/20" style={{background: 'rgba(13, 13, 13, 0.9)'}}>
          <div className="container mx-auto">
            <div className="flex h-16 items-center justify-center">
              <Link href="/dashboard">
                <img src="/clutch.png" alt="Clutch" className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="samsung-card p-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
            
            <div className="prose prose-invert max-w-none space-y-8">
              <div>
                <p className="text-muted mb-6">
                  <strong>Last Updated:</strong> September 8, 2025
                </p>
              </div>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
                <p className="text-muted mb-4">
                  <strong>AB Technologies Limited</strong> (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the <strong>Clutch</strong> platform (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service, in accordance with the <strong>Personal Data (Privacy) Ordinance (Cap. 486) of Hong Kong (&quot;PDPO&quot;)</strong>.
                </p>
                <p className="text-muted">
                  By using the Service, you consent to the collection and use of information in accordance with this Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-medium text-foreground mb-3">2.1 Personal Information</h3>
                <p className="text-muted mb-4">We may collect the following personal information:</p>
                <ul className="list-disc pl-6 text-muted mb-4 space-y-2">
                  <li>Account details (e.g. username, email address)</li>
                  <li>Profile information from connected platforms (YouTube, Twitch)</li>
                  <li>Content performance and analytics data</li>
                  <li>Communication records with our support team</li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">2.2 Third-Party Platform Data (YouTube & Twitch)</h3>
                <p className="text-muted mb-4">When you connect your YouTube or Twitch account, we collect and process the following data through their respective APIs:</p>
                
                <h4 className="text-lg font-medium text-foreground mb-2">YouTube Data:</h4>
                <ul className="list-disc pl-6 text-muted mb-4 space-y-1">
                  <li><strong>Channel Information:</strong> Channel name, ID, profile picture, and basic statistics</li>
                  <li><strong>Video Content Data:</strong> Video titles, descriptions, thumbnails, publication dates, view counts, likes, comments, and duration</li>
                  <li><strong>Analytics Data:</strong> Watch time, average view duration, subscriber growth, and engagement metrics</li>
                  <li><strong>Authentication Tokens:</strong> Encrypted access and refresh tokens to maintain connection</li>
                </ul>
                
                <p className="text-muted mb-4">
                  We use YouTube&apos;s readonly scopes (<code className="bg-card-secondary px-1 rounded text-sm">youtube.readonly</code> and <code className="bg-card-secondary px-1 rounded text-sm">yt-analytics.readonly</code>) to access this data for providing performance analytics and content management features. We do not access private information or perform any actions on your behalf.
                </p>

                <h4 className="text-lg font-medium text-foreground mb-2">Twitch Data:</h4>
                <ul className="list-disc pl-6 text-muted mb-4 space-y-1">
                  <li><strong>User Information:</strong> Username, display name, profile picture, and email address</li>
                  <li><strong>Channel Data:</strong> Stream information, video content, and basic statistics</li>
                  <li><strong>Analytics Data:</strong> Viewer metrics and engagement data (where available)</li>
                  <li><strong>Authentication Tokens:</strong> Encrypted access and refresh tokens to maintain connection</li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">2.3 Technical Information</h3>
                <ul className="list-disc pl-6 text-muted mb-4 space-y-2">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Usage patterns and preferences</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
                <p className="text-muted mb-4">We use your information for the following purposes:</p>
                <ul className="list-disc pl-6 text-muted mb-4 space-y-2">
                  <li>Providing and maintaining the Service</li>
                  <li>Processing registrations and managing accounts</li>
                  <li>Generating analytics and performance insights</li>
                  <li>Communicating with you about your account and updates</li>
                  <li>Improving and developing new features</li>
                  <li>Complying with applicable laws and regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Information Sharing and Disclosure</h2>
                <p className="text-muted mb-4">We may share your information in the following circumstances:</p>
                <ul className="list-disc pl-6 text-muted mb-4 space-y-2">
                  <li><strong>With your consent:</strong> When you explicitly agree to share data</li>
                  <li><strong>Service providers:</strong> With third parties that help us operate the Service</li>
                  <li><strong>Legal obligations:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business transfers:</strong> In the event of mergers, acquisitions, or asset sales</li>
                </ul>
                <p className="text-muted">
                  We do <strong>not</strong> sell or trade your personal information to third parties for marketing purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
                <p className="text-muted mb-4">
                  We implement technical and organizational measures to safeguard your personal information, including:
                </p>
                <ul className="list-disc pl-6 text-muted mb-4 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Staff training on privacy and data protection</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights under Hong Kong Law</h2>
                <p className="text-muted mb-4">Under the <strong>PDPO</strong>, you have the right to:</p>
                <ul className="list-disc pl-6 text-muted mb-4 space-y-2">
                  <li>Access the personal data we hold about you</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data (subject to legal obligations)</li>
                  <li>Object to processing of your data</li>
                  <li>Request data portability (where technically feasible)</li>
                </ul>
                <p className="text-muted">
                  To exercise these rights, please contact us (see Section 11).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Data Retention</h2>
                <p className="text-muted">
                  We retain personal data only as long as necessary for the purposes set out in this Policy, to comply with legal obligations, resolve disputes, and enforce agreements. Account-related data may be retained for up to <strong>7 years after account closure</strong> for regulatory compliance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. International Transfers</h2>
                <p className="text-muted">
                  Your data may be transferred to and processed outside of Hong Kong. We ensure such transfers comply with applicable privacy laws and that safeguards are in place to protect your information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Cookies and Tracking Technologies</h2>
                <p className="text-muted mb-4">
                  We use cookies and similar technologies to enhance user experience. You may disable cookies in your browser settings, but this may affect Service functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to This Policy</h2>
                <p className="text-muted">
                  We may update this Privacy Policy periodically. Material changes will be posted on this page with an updated &quot;Last Updated&quot; date. Your continued use of the Service after such changes indicates acceptance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Information</h2>
                <p className="text-muted mb-4">
                  For questions about this Privacy Policy or our data practices, please contact:
                </p>
                <div className="bg-card-secondary p-4 rounded-lg">
                  <p className="text-muted mb-2"><strong>AB Technologies Limited</strong></p>
                  <p className="text-muted mb-2">Room 29-33, 5/F</p>
                  <p className="text-muted mb-2">Beverly Commercial Centre</p>
                  <p className="text-muted mb-2">87-105 Chatham Road</p>
                  <p className="text-muted mb-2">Tsim Sha Tsui, Kowloon</p>
                  <p className="text-muted mb-4">Hong Kong</p>
                  <p className="text-muted mb-4"><strong>Support Email:</strong> <a href="mailto:leonard@accelab.io" className="text-primary hover:text-primary-hover">leonard@accelab.io</a></p>
                  <p className="text-muted">
                    If you have concerns about our handling of personal data, you may also contact the <strong>Office of the Privacy Commissioner for Personal Data, Hong Kong</strong>.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">12. Governing Law</h2>
                <p className="text-muted">
                  This Privacy Policy is governed by the laws of <strong>Hong Kong</strong>. Any disputes shall be subject to the exclusive jurisdiction of the <strong>Hong Kong courts</strong>.
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-bg border-t border-brand/20 mt-24 relative overflow-hidden">
          <div className="relative z-10 container mx-auto px-4 py-12">
            <div className="text-center text-sm text-white/40 font-medium tracking-wide">
              © 2025 Clutch. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
