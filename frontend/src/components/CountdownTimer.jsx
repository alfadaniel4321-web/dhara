import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ availableTime }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const getTargetTime = () => {
      const now = new Date();
      let target = new Date(now.getTime() + (2 * 60 + 45) * 60 * 1000); // default 2h 45m
      
      if (availableTime && availableTime.includes('-')) {
        try {
          const parts = availableTime.split('-');
          const endPart = parts[1].trim(); // e.g. "10:00 AM"
          const match = endPart.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (match) {
            let hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const ampm = match[3].toUpperCase();
            if (ampm === 'PM' && hours < 12) hours += 12;
            if (ampm === 'AM' && hours === 12) hours = 0;
            
            const tempTarget = new Date();
            tempTarget.setHours(hours, minutes, 0, 0);
            
            if (tempTarget > now) {
              target = tempTarget;
            } else {
              target = new Date(now.getTime() + (1 * 60 + 30) * 60 * 1000);
            }
          }
        } catch (e) {
          // fallback
        }
      }
      return target.getTime();
    };

    const targetTime = getTargetTime();

    const updateTimer = () => {
      const difference = targetTime - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft('Slot Closed');
        return;
      }

      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      const hStr = h.toString().padStart(2, '0');
      const mStr = m.toString().padStart(2, '0');
      const sStr = s.toString().padStart(2, '0');

      setTimeLeft(`${hStr}:${mStr}:${sStr}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [availableTime]);

  return (
    <span className="flex items-center text-xs font-mono font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">
      <Clock className="w-3 h-3 mr-1 text-emerald-400 animate-pulse" />
      {timeLeft}
    </span>
  );
}
