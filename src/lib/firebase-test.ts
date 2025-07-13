import { Capacitor } from '@capacitor/core';
import { getDoc, setDoc, getCollection, addDocToCollection } from './firestore';
import { firebaseDebugger } from './firebase-debug';

const isNative = Capacitor.isNativePlatform();

/**
 * Firebase Test Utility
 * 
 * This utility provides comprehensive testing capabilities for the Firebase abstraction,
 * ensuring that no Promise-like objects are exposed and that operations work correctly.
 */

interface TestResult {
  success: boolean;
  operation: string;
  error?: string;
  duration: number;
  platform: string;
}

class FirebaseTester {
  private static instance: FirebaseTester;
  private testResults: TestResult[] = [];

  private constructor() {}

  static getInstance(): FirebaseTester {
    if (!FirebaseTester.instance) {
      FirebaseTester.instance = new FirebaseTester();
    }
    return FirebaseTester.instance;
  }

  private async runTest<T>(
    operation: string,
    testFn: () => Promise<T>
  ): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      
      // Validate that the result is not Promise-like
      if (result && typeof result === 'object' && typeof (result as any).then === 'function') {
        throw new Error(`Test failed: ${operation} returned a Promise-like object`);
      }
      
      const duration = Date.now() - startTime;
      
      const testResult: TestResult = {
        success: true,
        operation,
        duration,
        platform: isNative ? 'native' : 'web',
      };
      
      this.testResults.push(testResult);
      console.log(`✅ ${operation} test passed (${duration}ms)`);
      
      return testResult;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      const testResult: TestResult = {
        success: false,
        operation,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        platform: isNative ? 'native' : 'web',
      };
      
      this.testResults.push(testResult);
      console.error(`❌ ${operation} test failed (${duration}ms):`, error);
      
      return testResult;
    }
  }

  async testGetDocument(): Promise<TestResult> {
    return this.runTest('getDocument', async () => {
      const result = await getDoc('test/document');
      return result;
    });
  }

  async testSetDocument(): Promise<TestResult> {
    return this.runTest('setDocument', async () => {
      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        platform: isNative ? 'native' : 'web',
      };
      
      await setDoc('test/document', testData);
      return 'success';
    });
  }

  async testGetCollection(): Promise<TestResult> {
    return this.runTest('getCollection', async () => {
      const result = await getCollection('test');
      return result;
    });
  }

  async testAddDocument(): Promise<TestResult> {
    return this.runTest('addDocument', async () => {
      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        platform: isNative ? 'native' : 'web',
      };
      
      const id = await addDocToCollection('test', testData);
      return id;
    });
  }

  async runAllTests(): Promise<TestResult[]> {
    console.log('🧪 Starting Firebase abstraction tests...');
    console.log(`Platform: ${isNative ? 'Native' : 'Web'}`);
    
    // Clear previous test results
    this.testResults = [];
    
    // Run tests in sequence
    await this.testSetDocument();
    await this.testGetDocument();
    await this.testAddDocument();
    await this.testGetCollection();
    
    // Print summary
    const passed = this.testResults.filter(r => r.success).length;
    const failed = this.testResults.filter(r => !r.success).length;
    const totalDuration = this.testResults.reduce((sum, r) => sum + r.duration, 0);
    
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(r => !r.success)
        .forEach(r => console.log(`  - ${r.operation}: ${r.error}`));
    }
    
    return this.testResults;
  }

  getTestResults(): TestResult[] {
    return [...this.testResults];
  }

  clearTestResults() {
    this.testResults = [];
  }
}

export const firebaseTester = FirebaseTester.getInstance();

/**
 * Run Firebase tests and return results
 */
export async function testFirebaseAbstraction(): Promise<TestResult[]> {
  return firebaseTester.runAllTests();
}

/**
 * Check if Firebase abstraction is working correctly
 */
export async function isFirebaseAbstractionWorking(): Promise<boolean> {
  try {
    const results = await firebaseTester.runAllTests();
    return results.every(r => r.success);
  } catch (error) {
    console.error('Firebase abstraction test failed:', error);
    return false;
  }
}

/**
 * Validate that no Promise-like objects are being returned
 */
export function validateFirebaseAbstraction(): void {
  console.log('🔍 Validating Firebase abstraction...');
  
  // Check if any Firebase modules are being imported directly
  const modules = [
    'firebase/app',
    'firebase/auth', 
    'firebase/firestore',
    '@capacitor-firebase/app',
    '@capacitor-firebase/authentication',
    '@capacitor-firebase/firestore',
  ];
  
  // Note: require.resolve is not available in browser environment
  // This validation is primarily for Node.js environments
  if (typeof require !== 'undefined') {
    modules.forEach(module => {
      try {
        // This will throw if the module is not available (which is expected for Firebase Web SDK on native)
        require.resolve(module);
        console.log(`⚠️  Module ${module} is available`);
      } catch {
        console.log(`✅ Module ${module} is properly excluded`);
      }
    });
  } else {
    console.log('✅ Running in browser environment - module validation skipped');
  }
  
  // Check debug log for any Promise-like objects
  const debugLog = firebaseDebugger.getDebugLog();
  const promiseErrors = debugLog.filter(log => 
    log.error?.includes('Promise') || log.error?.includes('then()')
  );
  
  if (promiseErrors.length > 0) {
    console.warn('⚠️  Promise-like errors detected in debug log:', promiseErrors);
  } else {
    console.log('✅ No Promise-like errors detected');
  }
} 