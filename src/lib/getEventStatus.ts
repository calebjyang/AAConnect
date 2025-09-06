import { Timestamp } from 'firebase/firestore';

export type EventStatus = 'upcoming' | 'live' | 'ended';

/**
 * Determines the status of an event based on current time vs start/end times
 * @param start - Event start time (Date or Firestore Timestamp)
 * @param end - Event end time (Date or Firestore Timestamp) 
 * @param now - Current time (defaults to new Date())
 * @returns Event status: 'upcoming', 'live', or 'ended'
 */
export function getEventStatus(
  start: Date | Timestamp | any,
  end: Date | Timestamp | any,
  now: Date = new Date()
): EventStatus {
  // Handle Firestore Timestamp conversion
  const startDate = start instanceof Date ? start : 
                   start?.toDate ? start.toDate() : 
                   start?.seconds ? new Date(start.seconds * 1000) : 
                   new Date(start);

  const endDate = end instanceof Date ? end : 
                 end?.toDate ? end.toDate() : 
                 end?.seconds ? new Date(end.seconds * 1000) : 
                 new Date(end);

  // Check if dates are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return 'upcoming'; // Default fallback
  }

  if (now < startDate) {
    return 'upcoming';
  } else if (now >= startDate && now <= endDate) {
    return 'live';
  } else {
    return 'ended';
  }
}

/**
 * Get UI properties for event status badge
 */
export function getStatusBadgeProps(status: EventStatus) {
  switch (status) {
    case 'upcoming':
      return {
        className: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
        text: 'Upcoming'
      };
    case 'live':
      return {
        className: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse',
        text: 'Live'
      };
    case 'ended':
      return {
        className: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
        text: 'Ended'
      };
    default:
      return {
        className: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
        text: 'Upcoming'
      };
  }
}
