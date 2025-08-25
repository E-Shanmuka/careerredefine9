import React, { useState, useEffect } from 'react';

const OfferBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const targetDate = new Date('2025-09-01T00:00:00');
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-4 text-center">
      <div className="container mx-auto px-4">
        <p className="font-semibold">
          ✨ Limited-Time Offer! Get 20% off on all courses. Ends in:
          <span className="ml-2 font-bold">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </span>
        </p>
      </div>
    </div>
  );
};

export default OfferBanner;
