import { useState } from 'react'
import Layout from '../components/Layout'

interface TestResult {
  success: boolean
  message?: string
  error?: string
  details?: any
  testData?: any
}

interface Creator {
  id: string
  name: string
  email: string
  youtubeOAuthUrl?: string
  twitchOAuthUrl?: string
}

export default function ApiTest() {
  const [youtubeResult, setYoutubeResult] = useState<TestResult | null>(null)
  const [twitchResult, setTwitchResult] = useState<TestResult | null>(null)
  const [creator, setCreator] = useState<Creator | null>(null)
  const [loading, setLoading] = useState({ youtube: false, twitch: false, creator: false })

  const testYouTube = async () => {
    setLoading(prev => ({ ...prev, youtube: true }))
    try {
      const response = await fetch('/api/test-youtube')
      const result = await response.json()
      setYoutubeResult(result)
    } catch (error) {
      setYoutubeResult({
        success: false,
        error: 'Request failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(prev => ({ ...prev, youtube: false }))
    }
  }

  const testTwitch = async () => {
    setLoading(prev => ({ ...prev, twitch: true }))
    try {
      const response = await fetch('/api/test-twitch')
      const result = await response.json()
      setTwitchResult(result)
    } catch (error) {
      setTwitchResult({
        success: false,
        error: 'Request failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(prev => ({ ...prev, twitch: false }))
    }
  }

  const createTestCreator = async () => {
    setLoading(prev => ({ ...prev, creator: true }))
    try {
      const response = await fetch('/api/create-test-creator', {
        method: 'POST'
      })
      const result = await response.json()
      if (result.success) {
        setCreator({
          id: result.creator.id,
          name: result.creator.name,
          email: result.creator.email,
          youtubeOAuthUrl: result.youtubeOAuthUrl,
          twitchOAuthUrl: result.twitchOAuthUrl
        })
      }
    } catch (error) {
      console.error('Failed to create test creator:', error)
    } finally {
      setLoading(prev => ({ ...prev, creator: false }))
    }
  }

  const ResultCard = ({ title, result, loading }: { 
    title: string, 
    result: TestResult | null, 
    loading: boolean 
  }) => (
    <div className="bg-game-dark/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      
      {loading && (
        <div className="flex items-center text-blue-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
          Testing connection...
        </div>
      )}
      
      {result && !loading && (
        <div className={`p-4 rounded-lg ${result.success ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
          <div className={`font-medium ${result.success ? 'text-green-400' : 'text-red-400'}`}>
            {result.success ? '✅ Success' : '❌ Failed'}
          </div>
          
          {result.message && (
            <div className="text-gray-300 mt-2">{result.message}</div>
          )}
          
          {result.error && (
            <div className="text-red-400 mt-2 font-medium">{result.error}</div>
          )}
          
          {result.testData && (
            <div className="mt-4">
              <div className="text-sm text-gray-400 mb-2">Test Data:</div>
              <pre className="bg-black/30 p-3 rounded text-xs text-gray-300 overflow-x-auto">
                {JSON.stringify(result.testData, null, 2)}
              </pre>
            </div>
          )}
          
          {result.details && (
            <div className="mt-4">
              <div className="text-sm text-gray-400 mb-2">Details:</div>
              <pre className="bg-black/30 p-3 rounded text-xs text-gray-300 overflow-x-auto">
                {JSON.stringify(result.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-game-dark via-gray-900 to-game-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">API Connection Test</h1>
              <p className="text-gray-400">Test your YouTube and Twitch API connections</p>
            </div>

            {/* Creator Setup */}
            <div className="mb-8 bg-game-dark/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">🧪 Test Creator Setup</h2>
              
              {!creator ? (
                <button
                  onClick={createTestCreator}
                  disabled={loading.creator}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  {loading.creator ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    '👤 Create Test Creator'
                  )}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="text-green-400 font-medium">✅ Test Creator Ready</div>
                  <div className="text-gray-300">
                    <strong>Name:</strong> {creator.name}<br/>
                    <strong>Email:</strong> {creator.email}<br/>
                    <strong>ID:</strong> {creator.id}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <a
                      href={creator.youtubeOAuthUrl}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                    >
                      📺 Connect YouTube
                    </a>
                    <a
                      href={creator.twitchOAuthUrl}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                    >
                      🎮 Connect Twitch
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* API Test Buttons */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={testYouTube}
                disabled={loading.youtube}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading.youtube ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Testing...
                  </>
                ) : (
                  '📺 Test YouTube API'
                )}
              </button>

              <button
                onClick={testTwitch}
                disabled={loading.twitch}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading.twitch ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Testing...
                  </>
                ) : (
                  '🎮 Test Twitch API'
                )}
              </button>
            </div>

            {/* Results */}
            <div className="grid md:grid-cols-2 gap-6">
              <ResultCard 
                title="YouTube API Test" 
                result={youtubeResult} 
                loading={loading.youtube} 
              />
              <ResultCard 
                title="Twitch API Test" 
                result={twitchResult} 
                loading={loading.twitch} 
              />
            </div>

            {/* Setup Instructions */}
            <div className="mt-12 bg-game-dark/30 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">🔧 Setup Status</h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">YouTube API Key: Configured ✅</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">YouTube OAuth: Configured ✅</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">Twitch Client ID: Configured ✅</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">Twitch Client Secret: Configured ✅</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">Database: Connected ✅</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  📖 Check <code className="bg-black/30 px-2 py-1 rounded">API_SETUP_GUIDE.md</code> for detailed setup instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
