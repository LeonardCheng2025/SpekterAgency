import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function DebugOAuth() {
  const [currentUrl, setCurrentUrl] = useState('')
  const [backendConfig, setBackendConfig] = useState<any>(null)

  useEffect(() => {
    setCurrentUrl(window.location.origin)
    
    // 獲取後端配置
    fetch('/api/debug/oauth-config')
      .then(res => res.json())
      .then(data => setBackendConfig(data))
      .catch(err => console.error('Failed to fetch backend config:', err))
  }, [])

  const youtubeAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=786441496819-vqh13p4fpdadf9e5t3gv9bffs1nijktk.apps.googleusercontent.com&` +
    `redirect_uri=${encodeURIComponent(currentUrl + '/api/auth/youtube/callback')}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent('https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly')}&` +
    `access_type=offline&` +
    `prompt=consent`

  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?` +
    `client_id=7kyzo0p5di36m1cbyyk452khhwx5gc&` +
    `redirect_uri=${encodeURIComponent(currentUrl + '/api/auth/twitch/callback')}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent('user:read:email')}`

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>OAuth Debug - Spekter Agency</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">OAuth Configuration Debug</h1>

        <div className="space-y-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Current Environment</h2>
            <div className="space-y-2 text-sm font-mono">
              <p><span className="text-green-400">Current URL:</span> {currentUrl}</p>
              <p><span className="text-green-400">Expected YouTube Redirect:</span> {currentUrl}/api/auth/youtube/callback</p>
              <p><span className="text-green-400">Expected Twitch Redirect:</span> {currentUrl}/api/auth/twitch/callback</p>
            </div>
          </div>

          {backendConfig && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Backend Configuration</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <h3 className="text-yellow-400 font-semibold">YouTube Config:</h3>
                  <div className="ml-4 space-y-1 font-mono">
                    <p><span className="text-blue-400">Client ID:</span> {backendConfig.youtube.clientId}</p>
                    <p><span className="text-blue-400">Redirect URI:</span> {backendConfig.youtube.redirectUri}</p>
                    <p><span className="text-blue-400">Has Secret:</span> {backendConfig.youtube.hasClientSecret ? '✅' : '❌'}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-purple-400 font-semibold">Twitch Config:</h3>
                  <div className="ml-4 space-y-1 font-mono">
                    <p><span className="text-blue-400">Client ID:</span> {backendConfig.twitch.clientId}</p>
                    <p><span className="text-blue-400">Redirect URI:</span> {backendConfig.twitch.redirectUri}</p>
                    <p><span className="text-blue-400">Has Secret:</span> {backendConfig.twitch.hasClientSecret ? '✅' : '❌'}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-cyan-400 font-semibold">Environment:</h3>
                  <div className="ml-4 space-y-1 font-mono">
                    <p><span className="text-blue-400">Node ENV:</span> {backendConfig.environment}</p>
                    <p><span className="text-blue-400">Host:</span> {backendConfig.requestHeaders.host}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">YouTube OAuth URL</h2>
            <div className="bg-gray-700 p-4 rounded text-xs font-mono break-all mb-4">
              {youtubeAuthUrl}
            </div>
            <a 
              href={youtubeAuthUrl}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold"
            >
              Test YouTube Login
            </a>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Twitch OAuth URL</h2>
            <div className="bg-gray-700 p-4 rounded text-xs font-mono break-all mb-4">
              {twitchAuthUrl}
            </div>
            <a 
              href={twitchAuthUrl}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white font-semibold"
            >
              Test Twitch Login
            </a>
          </div>

          <div className="bg-yellow-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">⚠️ Important Notes</h2>
            <ul className="space-y-2 text-sm">
              <li>• Make sure the redirect URIs are configured in Google Cloud Console</li>
              <li>• Make sure the redirect URIs are configured in Twitch Developer Console</li>
              <li>• The redirect URIs must match exactly (including https/http and trailing slashes)</li>
              <li>• Check the browser console and network tab for detailed error messages</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-x-4">
              <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
                Go to Login Page
              </Link>
              <Link href="/api-test" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">
                API Test Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
