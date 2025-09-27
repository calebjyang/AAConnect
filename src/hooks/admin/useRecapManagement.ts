import { useState, useCallback, useEffect } from 'react';
import { getCollection, addDocToCollection, updateDoc, setDoc } from '@/lib/firestore';
import { Timestamp } from 'firebase/firestore';

export interface RecapData {
    title: string;
    date: string;
    location: string;
    sermonTopic: string;
    summary: string;
}

export interface Recap {
    id: string;
    title: string;
    date: Date;
    location: string;
    sermonTopic?: string;
    summary?: string;
}

