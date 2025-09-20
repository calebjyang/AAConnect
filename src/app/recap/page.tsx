"use client";
import { useEffect, useState } from "react";
import { getCollection, orderByQuery } from "@/lib/firestore";
import React from "react";
import { parseEventDate } from '@/lib/utils';

type Recap = {
    id: string;
    title: string;
    date?: Date;
    location: string;
    sermonTopic?: string;
    summary?: string;
}

function RecapDetailModal({ recap, onClose }:  {recap: Recap; onClose: () => void}) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
        return () => setShow(false);
    }, []);

    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 200);
    };

    const recapDate = parseEventDate(recap.date) ?? new Date();

    return (
        <div>
            <div
                className={`bg-white rounded-xl shadow-xl p-8 max-w-lg w-full mx-4 relative transform transition-all duration-200 ${show ? 'scale-100' : 'scale-95'} flex flex-col`}
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                ×
                </button>
                
                <div className="mb-6">
                <h2 className="text-3xl font-bold text-aacf-blue mb-3">{recap.title}</h2>
                <p className="text-gray-600">
                    {recap.date ? recapDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                    }) : 'Date TBD'}
                </p>
                </div>

                {recap.sermonTopic && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Sermon Topic</h3>
                    <p className="text-gray-700">{recap.sermonTopic}</p>
                </div>
                )}
                {recap.summary && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
                    <p className="text-gray-700 whitespace-pre-line">{recap.summary}</p>
                </div>
                )}
                {/* {recap.afterEvent && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">After Event</h3>
                    <p className="text-gray-700">{recap.afterEvent}</p>
                </div>
                )} */}
            </div>
        </div>
    )
}

function ListView({ recaps, onRecapClick }: { recaps: Recap[]; onRecapClick: (recap: Recap) => void }) {
    return (
        <div className="space-y-8">
            {recaps.map(recap => (
                <div
                    key={recap.id}
                    onClick={()=>onRecapClick(recap)}
                    className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition cursor-pointer"
                >
                    <h3>{recap.title}</h3>
                    <p>
                        {recap.date ? (parseEventDate(recap.date) ?? new Date()).toLocaleDateString() : "Unknown Date"}
                    </p>
                    {recap.sermonTopic && (
                        <p className="text-gray-700">{recap.sermonTopic}</p>
                    )}
                    {recap.summary && (
                        <p className="text-gray-700">{recap.summary}</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default function RecapPage() {
    const [recaps, setRecaps] = useState<Recap[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecap, setSelectedRecap] = useState<Recap | null>(null);

    useEffect(() => {
        async function fetchRecaps() {
            try {
                const orderByConstraint = await orderByQuery("date", "desc");
                // Currently recaps doesn't exist in the firebase
                const data = await getCollection("recaps", [orderByConstraint]) as Recap[];
                setRecaps(data.map(e => ({ ...e, date: parseEventDate(e.date) ?? new Date() })));
            } finally {
                setLoading(false);
            }
        }
        fetchRecaps();
    }, []);
    
    return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recap</h1>
        <p className="text-gray-600 mb-8">Here’s what happened at our recent gatherings.</p>

        {loading ? (
          <p className="text-gray-600">Loading recaps...</p>
        ) : recaps.length === 0 ? (
          <p className="text-gray-500">No recaps yet. Check back later!</p>
        ) : (
          <ListView recaps={recaps} onRecapClick={setSelectedRecap} />
        )}
      </div>

      {selectedRecap && (
        <RecapDetailModal recap={selectedRecap} onClose={() => setSelectedRecap(null)} />
      )}
    </div>
  );
}