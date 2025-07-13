"use client";
import { useState } from 'react';
import { testFirebaseAbstraction, validateFirebaseAbstraction } from '@/lib/firebase-test';
import { firebaseDebugger } from '@/lib/firebase-debug';
import { Capacitor } from '@capacitor/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TestFirebasePage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [debugLog, setDebugLog] = useState<any[]>([]);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const results = await testFirebaseAbstraction();
      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const validateAbstraction = () => {
    validateFirebaseAbstraction();
    setDebugLog(firebaseDebugger.getDebugLog());
  };

  const clearDebugLog = () => {
    firebaseDebugger.clearDebugLog();
    setDebugLog([]);
  };

  const isNative = Capacitor.isNativePlatform();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Firebase Abstraction Test
          </h1>
          <p className="text-gray-600">
            Test the Firebase abstraction to ensure it works correctly on {isNative ? 'native' : 'web'} platform
          </p>
          <Badge variant={isNative ? "default" : "secondary"} className="mt-2">
            Platform: {isNative ? 'Native' : 'Web'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Run Tests</CardTitle>
              <CardDescription>
                Test all Firebase operations to ensure they work correctly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? 'Running Tests...' : 'Run Firebase Tests'}
              </Button>
              
              {testResults.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Test Results:</h3>
                  {testResults.map((result, index) => (
                    <div 
                      key={index} 
                      className={`p-2 rounded text-sm ${
                        result.success 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span>{result.operation}</span>
                        <span>{result.success ? '✅' : '❌'}</span>
                      </div>
                      {!result.success && (
                        <div className="text-xs mt-1">{result.error}</div>
                      )}
                      <div className="text-xs text-gray-600 mt-1">
                        {result.duration}ms
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Debug & Validation</CardTitle>
              <CardDescription>
                Validate the abstraction and view debug information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={validateAbstraction} variant="outline">
                  Validate Abstraction
                </Button>
                <Button onClick={clearDebugLog} variant="outline">
                  Clear Debug Log
                </Button>
              </div>
              
              {debugLog.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Debug Log:</h3>
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {debugLog.map((log, index) => (
                      <div key={index} className="text-xs bg-gray-100 p-2 rounded">
                        <div className="font-mono">
                          [{log.timestamp}] {log.operation}
                          {log.path && ` (${log.path})`}
                        </div>
                        {log.error && (
                          <div className="text-red-600 mt-1">{log.error}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What This Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Firebase operations work correctly on both web and native platforms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>No Promise-like objects are returned from Firebase operations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Capacitor plugins are properly loaded and managed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Firebase Web SDK is properly excluded from native builds</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>No &quot;FirebaseFirestore.then()&quot; errors occur</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 