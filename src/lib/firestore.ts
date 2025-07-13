import { Capacitor } from '@capacitor/core';
import { firebaseDebugger, validateNotPromiseLike } from './firebase-debug';

const isNative = Capacitor.isNativePlatform();

// Web: statically import query helpers (these will be excluded from native build by next.config.ts alias)
import { orderBy as orderByWeb, limit as limitWeb, where as whereWeb } from 'firebase/firestore';

// Singleton pattern to ensure plugins are loaded only once
class FirestoreManager {
  private static instance: FirestoreManager;
  private capacitorFirestore: any = null;
  private isPluginLoaded = false;
  private pluginLoadPromise: Promise<any> | null = null;

  private constructor() {}

  static getInstance(): FirestoreManager {
    if (!FirestoreManager.instance) {
      FirestoreManager.instance = new FirestoreManager();
    }
    return FirestoreManager.instance;
  }

  private async loadCapacitorPlugin(): Promise<any> {
    if (this.isPluginLoaded) {
      return this.capacitorFirestore;
    }

    if (this.pluginLoadPromise) {
      return this.pluginLoadPromise;
    }

    this.pluginLoadPromise = (async () => {
      try {
        firebaseDebugger.logOperation('loadCapacitorPlugin');
        
        // Import the plugin module
        const firestoreModule = await import('@capacitor-firebase/firestore');
        
        // Extract the plugin and immediately wrap it to prevent Promise-like behavior
        const rawPlugin = firestoreModule.FirebaseFirestore;
        
        // Create a safe wrapper that only exposes the methods we need
        const safePlugin = {
          getDocument: rawPlugin.getDocument.bind(rawPlugin),
          setDocument: rawPlugin.setDocument.bind(rawPlugin),
          updateDocument: rawPlugin.updateDocument.bind(rawPlugin),
          deleteDocument: rawPlugin.deleteDocument.bind(rawPlugin),
          getCollection: rawPlugin.getCollection.bind(rawPlugin),
          addDocument: rawPlugin.addDocument.bind(rawPlugin),
        };
        
        // Ensure the wrapper is not Promise-like
        Object.defineProperty(safePlugin, 'then', {
          value: undefined,
          writable: false,
          configurable: false,
        });
        
        this.capacitorFirestore = safePlugin;
        this.isPluginLoaded = true;
        console.log('Capacitor Firestore plugin loaded successfully');
        return this.capacitorFirestore;
      } catch (error) {
        console.warn('Capacitor Firestore plugin not available:', error);
        firebaseDebugger.logOperation('loadCapacitorPlugin', undefined, error as Error);
        this.capacitorFirestore = null;
        this.isPluginLoaded = true;
        return null;
      }
    })();

    return this.pluginLoadPromise;
  }

  async getDocument(path: string): Promise<any> {
    if (!isNative) {
      const { getFirestore, doc, getDoc: getDocWeb } = await import('firebase/firestore');
      const { getApp } = await import('firebase/app');
      const db = getFirestore(getApp());
      const docRef = doc(db, path);
      const snapshot = await getDocWeb(docRef);
      const result = snapshot.exists() ? { ...snapshot.data(), id: snapshot.id } as any : null;
      // Convert date ISO string to Date object
      if (result && typeof result.date === 'string') {
        result.date = new Date(result.date);
      }
      validateNotPromiseLike(result, 'getDocument result');
      return result;
    }

    const plugin = await this.loadCapacitorPlugin();
    if (!plugin) {
      throw new Error('Capacitor Firestore plugin not available');
    }

    try {
      const { document } = await plugin.getDocument({ reference: path });
      const result = document ? { ...document.data, id: document.id } as any : null;
      // Convert date ISO string to Date object
      if (result && typeof result.date === 'string') {
        result.date = new Date(result.date);
      }
      validateNotPromiseLike(result, 'getDocument result');
      return result;
    } catch (error) {
      console.error('Native getDocument error:', error);
      firebaseDebugger.logOperation('getDocument', path, error as Error);
      throw error;
    }
  }

  async setDocument(path: string, data: any): Promise<void> {
    if (!isNative) {
      const { getFirestore, doc, setDoc: setDocWeb } = await import('firebase/firestore');
      const { getApp } = await import('firebase/app');
      const db = getFirestore(getApp());
      const docRef = doc(db, path);
      await setDocWeb(docRef, data);
      return;
    }

    const plugin = await this.loadCapacitorPlugin();
    if (!plugin) {
      throw new Error('Capacitor Firestore plugin not available');
    }

    try {
      await plugin.setDocument({ reference: path, data });
    } catch (error) {
      console.error('Native setDocument error:', error);
      firebaseDebugger.logOperation('setDocument', path, error as Error);
      throw error;
    }
  }

  async updateDocument(path: string, data: any): Promise<void> {
    if (!isNative) {
      const { getFirestore, doc, updateDoc: updateDocWeb } = await import('firebase/firestore');
      const { getApp } = await import('firebase/app');
      const db = getFirestore(getApp());
      const docRef = doc(db, path);
      await updateDocWeb(docRef, data);
      return;
    }

    const plugin = await this.loadCapacitorPlugin();
    if (!plugin) {
      throw new Error('Capacitor Firestore plugin not available');
    }

    try {
      await plugin.updateDocument({ reference: path, data });
    } catch (error) {
      console.error('Native updateDocument error:', error);
      firebaseDebugger.logOperation('updateDocument', path, error as Error);
      throw error;
    }
  }

  async deleteDocument(path: string): Promise<void> {
    if (!isNative) {
      const { getFirestore, doc, deleteDoc: deleteDocWeb } = await import('firebase/firestore');
      const { getApp } = await import('firebase/app');
      const db = getFirestore(getApp());
      const docRef = doc(db, path);
      await deleteDocWeb(docRef);
      return;
    }

    const plugin = await this.loadCapacitorPlugin();
    if (!plugin) {
      throw new Error('Capacitor Firestore plugin not available');
    }

    try {
      await plugin.deleteDocument({ reference: path });
    } catch (error) {
      console.error('Native deleteDocument error:', error);
      firebaseDebugger.logOperation('deleteDocument', path, error as Error);
      throw error;
    }
  }

  async getCollection(path: string, constraints: any[] = []): Promise<any[]> {
    if (!isNative) {
      const { getFirestore, collection, query, getDocs: getDocsWeb } = await import('firebase/firestore');
      const { getApp } = await import('firebase/app');
      const db = getFirestore(getApp());
      const colRef = collection(db, path);
      const q = constraints.length ? query(colRef, ...constraints) : colRef;
      const snapshot = await getDocsWeb(q);
      const result = snapshot.docs.map((doc: any) => {
        const data = { ...doc.data(), id: doc.id };
        if (typeof data.date === 'string') {
          data.date = new Date(data.date);
        }
        return data;
      });
      validateNotPromiseLike(result, 'getCollection result');
      return result;
    }

    const plugin = await this.loadCapacitorPlugin();
    if (!plugin) {
      throw new Error('Capacitor Firestore plugin not available');
    }

    try {
      const response = await plugin.getCollection({ reference: path });
      const snapshots = response.snapshots || [];
      console.log('Native Firestore snapshots:', snapshots);
      let docs = snapshots.map((snapshot: any) => {
        console.log('Raw event data:', snapshot.data);
        const data = { ...snapshot.data };
        if (!data.date) {
          console.warn('Event missing date field:', data, snapshot);
        } else {
          data.date = new Date(data.date);
        }
        return { ...data, id: snapshot.id };
      });
      // Apply constraints in JS (only basic orderBy/limit supported)
      let orderByField: string | null = null;
      let orderByDirection: 'asc' | 'desc' = 'asc';
      let limitCount: number | null = null;
      
      for (const c of constraints) {
        if (c && c.__type === 'orderBy') {
          orderByField = c.field;
          orderByDirection = c.direction || 'asc';
        }
        if (c && c.__type === 'limit') {
          limitCount = c.count;
        }
      }
      
      if (orderByField) {
        docs = docs.sort((a: any, b: any) => {
          if (!a[orderByField!] || !b[orderByField!]) return 0;
          if (a[orderByField!] < b[orderByField!]) return orderByDirection === 'asc' ? -1 : 1;
          if (a[orderByField!] > b[orderByField!]) return orderByDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }
      
      if (limitCount !== null) {
        docs = docs.slice(0, limitCount);
      }
      
      validateNotPromiseLike(docs, 'getCollection result');
      return docs;
    } catch (error) {
      console.error('Native getCollection error:', error);
      firebaseDebugger.logOperation('getCollection', path, error as Error);
      throw error;
    }
  }

  async addDocument(path: string, data: any): Promise<string> {
    if (!isNative) {
      const { getFirestore, collection, addDoc: addDocWeb } = await import('firebase/firestore');
      const { getApp } = await import('firebase/app');
      const db = getFirestore(getApp());
      const colRef = collection(db, path);
      const docRef = await addDocWeb(colRef, data);
      const result = docRef.id;
      validateNotPromiseLike(result, 'addDocument result');
      return result;
    }

    const plugin = await this.loadCapacitorPlugin();
    if (!plugin) {
      throw new Error('Capacitor Firestore plugin not available');
    }

    try {
      const { id } = await plugin.addDocument({ reference: path, data });
      validateNotPromiseLike(id, 'addDocument result');
      return id;
    } catch (error) {
      console.error('Native addDocument error:', error);
      firebaseDebugger.logOperation('addDocument', path, error as Error);
      throw error;
    }
  }
}

// Create singleton instance
const firestoreManager = FirestoreManager.getInstance();

// Exported Firestore API functions (never return the plugin)
export const getDoc = async (path: string): Promise<any> => {
  return firestoreManager.getDocument(path);
};

export const setDoc = async (path: string, data: any): Promise<void> => {
  return firestoreManager.setDocument(path, data);
};

export const updateDoc = async (path: string, data: any): Promise<void> => {
  return firestoreManager.updateDocument(path, data);
};

export const deleteDoc = async (path: string): Promise<void> => {
  return firestoreManager.deleteDocument(path);
};

export const getCollection = async (path: string, constraints: any[] = []): Promise<any[]> => {
  return firestoreManager.getCollection(path, constraints);
};

export const addDocToCollection = async (path: string, data: any): Promise<string> => {
  return firestoreManager.addDocument(path, data);
};

// Query helpers (web only)
export const orderByQuery = (field: string, direction: 'asc' | 'desc' = 'asc') => {
  if (isNative) {
    return { __type: 'orderBy', field, direction };
  }
  return orderByWeb(field, direction);
};

export const limitQuery = (count: number) => {
  if (isNative) {
    return { __type: 'limit', count };
  }
  return limitWeb(count);
};

export const whereQuery = (...args: Parameters<typeof whereWeb>) => {
  if (isNative) {
    throw new Error('whereQuery is not implemented for native. Use only basic getCollection(path) or implement JS-side filtering.');
  }
  return whereWeb(...args);
}; 