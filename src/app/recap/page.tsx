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
    sermonTopic: string;
    summary: string;
}

function RecapDetailModal({ recap, onClose }:  {recap: Recap; onClose: () => void}) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
        return () => setShow(false);
    }, []);
}