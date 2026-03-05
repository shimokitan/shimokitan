import { useState, useEffect } from 'react';

export function useTime(options: { showSeconds?: boolean } = {}) {
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', {
                timeZone: 'Asia/Tokyo',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                ...(options.showSeconds ? { second: '2-digit' } : {})
            }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [options.showSeconds]);

    return time;
}
