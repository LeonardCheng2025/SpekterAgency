import Head from 'next/head'
import Link from 'next/link'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - Clutch</title>
        <meta name="description" content="Terms of Service for Clutch platform" />
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
            <h1 className="text-3xl font-bold text-foreground mb-8">Terms of Service</h1>
            
            <div className="prose prose-invert max-w-none space-y-8">
              <div>
                <p className="text-muted mb-6">
                  <strong>Last Updated:</strong> September 8, 2025
                </p>
              </div>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted mb-4">
                  These Terms of Service (&quot;Terms&quot;) form a binding agreement between you (&quot;User,&quot; &quot;you&quot;) and 
                  <strong> AB Technologies Limited</strong> (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; &quot;us&quot;), regarding your use of the 
                  <strong> Clutch</strong> platform and related services (collectively, the &quot;Service&quot;). By accessing or using the Service, you acknowledge that you have read, understood, and agree to these Terms. If you do not agree, you may not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
                <p className="text-muted mb-4">
                  Clutch is a creator analytics and engagement platform offering:
                </p>
                <ul className="list-disc pl-6 text-muted mb-4 space-y-2">
                  <li>Content performance insights and reporting</li>
                  <li>Creator ranking and leaderboard systems</li>
                  <li>Integrations with external platforms (e.g. YouTube, Twitch)</li>
                  <li>Community and networking features</li>
                  <li>Seasonal challenges, competitions, and reward mechanisms</li>
                </ul>
                <p className="text-muted">
                  We may modify, suspend, or discontinue any part of the Service at any time without prior notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Accounts and Registration</h2>
                <h3 className="text-xl font-medium text-foreground mb-3">3.1 Account Creation</h3>
                <p className="text-muted mb-4">
                  To use certain features, you must register an account and connect your creator channels (YouTube, Twitch, etc.). You agree to provide accurate, current, and complete information.
                </p>

                <h3 className="text-xl font-medium text-foreground mb-3">3.2 Security</h3>
                <p className="text-muted mb-4">
                  You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. Notify us immediately if you suspect unauthorized access.
                </p>

                <h3 className="text-xl font-medium text-foreground mb-3">3.3 Eligibility</h3>
                <ul className="list-disc pl-6 text-muted mb-4 space-y-2">
                  <li>You must be at least 13 years old.</li>
                  <li>If under 18, parental or guardian consent is required.</li>
                </ul>
                <p className="text-muted">
                  By registering, you represent that you meet these requirements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Acceptable Use</h2>
                <p className="text-muted mb-4">You agree to use the Service only for lawful purposes and not to:</p>
                <ul className="list-disc pl-6 text-muted mb-4 space-y-2">
                  <li>Violate laws or regulations</li>
                  <li>Infringe intellectual property rights</li>
                  <li>Upload harmful code or attempt to breach security</li>
                  <li>Engage in harassment, abuse, or discrimination</li>
                  <li>Manipulate rankings or analytics artificially</li>
                  <li>Publish misleading, false, or defamatory content</li>
                  <li>Reverse engineer or copy the Service without authorization</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Content and Data</h2>
                <h3 className="text-xl font-medium text-foreground mb-3">5.1 User Content</h3>
                <p className="text-muted mb-4">
                  You retain ownership of your content. By using the Service, you grant us a non-exclusive, worldwide, royalty-free license to access, display, and analyze your connected platform data for the purposes of providing and improving the Service.
                </p>

                <h3 className="text-xl font-medium text-foreground mb-3">5.2 Platform Integrations</h3>
                <p className="text-muted mb-4">
                  By connecting external platforms (YouTube, Twitch), you authorize us to retrieve and process available data in accordance with those platforms&apos; own terms of service.
                </p>

                <h3 className="text-xl font-medium text-foreground mb-3">5.3 Accuracy of Data</h3>
                <p className="text-muted">
                  We do not guarantee the accuracy or completeness of third-party data. Rankings and analytics are provided for informational purposes only.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Intellectual Property</h2>
                <p className="text-muted mb-4">
                  The Service, including software, design, features, and technology, is owned by <strong>AB Technologies Limited</strong> and protected by intellectual property laws. You may not copy, modify, or distribute any part of the Service without prior written consent.
                </p>
                <p className="text-muted">
                  &quot;Clutch&quot; and related marks belong to <strong>AB Technologies Limited</strong>. Third-party trademarks remain the property of their respective owners.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Privacy</h2>
                <p className="text-muted">
                  Our collection and use of personal information is governed by our <strong>Privacy Policy</strong>, which is incorporated into these Terms by reference. Please review it to understand how we handle your information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Termination</h2>
                <h3 className="text-xl font-medium text-foreground mb-3">8.1 By You</h3>
                <p className="text-muted mb-4">
                  You may terminate your account at any time.
                </p>

                <h3 className="text-xl font-medium text-foreground mb-3">8.2 By Us</h3>
                <p className="text-muted mb-4">
                  We may suspend or terminate your account if you violate these Terms or misuse the Service. When reasonable, we will provide notice.
                </p>

                <h3 className="text-xl font-medium text-foreground mb-3">8.3 Effect of Termination</h3>
                <p className="text-muted">
                  Your right to use the Service ends immediately. Certain data may be retained as required by law or for legitimate business purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Disclaimers and Limitations</h2>
                <ul className="list-disc pl-6 text-muted mb-4 space-y-2">
                  <li>The Service is provided <strong>&quot;as is&quot;</strong> and <strong>&quot;as available.&quot;</strong> We do not guarantee uninterrupted or error-free operation.</li>
                  <li>To the maximum extent permitted by law, <strong>AB Technologies Limited</strong> shall not be liable for indirect, incidental, or consequential damages.</li>
                  <li>Third-party integrations (e.g. YouTube, Twitch) are not controlled by us. We are not responsible for their availability, content, or practices.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Indemnification</h2>
                <p className="text-muted">
                  You agree to indemnify and hold harmless <strong>AB Technologies Limited</strong> from any claims, damages, or expenses arising out of your use of the Service, violation of these Terms, or infringement of third-party rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">11. Governing Law</h2>
                <p className="text-muted">
                  These Terms are governed by the laws of <strong>Hong Kong</strong>. Any disputes shall be resolved exclusively in the courts of Hong Kong.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">12. Changes to Terms</h2>
                <p className="text-muted">
                  We may update these Terms at any time. Material changes will be communicated through the Service or via email. Your continued use after changes constitutes acceptance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">13. Severability</h2>
                <p className="text-muted">
                  If any provision of these Terms is deemed unenforceable, the remaining provisions shall remain in effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">14. Contact Information</h2>
                <div className="bg-card-secondary p-4 rounded-lg">
                  <p className="text-muted mb-2"><strong>AB Technologies Limited</strong></p>
                  <p className="text-muted mb-2">Room 29-33, 5/F</p>
                  <p className="text-muted mb-2">Beverly Commercial Centre</p>
                  <p className="text-muted mb-2">87-105 Chatham Road</p>
                  <p className="text-muted mb-2">Tsim Sha Tsui, Kowloon</p>
                  <p className="text-muted mb-4">Hong Kong</p>
                  <p className="text-muted"><strong>Support Email:</strong> <a href="mailto:leonard@accelab.io" className="text-primary hover:text-primary-hover">leonard@accelab.io</a></p>
                </div>
              </section>

              <section className="border-t border-border pt-8">
                <p className="text-sm text-muted">
                  By using the Clutch Service, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms of Service.
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
