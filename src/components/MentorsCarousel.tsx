import React, { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { fetchMentors, Mentor } from '../services/mentorService';

const MentorsCarousel: React.FC<{ featuredOnly?: boolean }>= ({ featuredOnly = true }) => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchMentors({ featured: featuredOnly });
        if (mounted) setMentors((data || []).filter(m => m.active !== false).sort((a, b) => (a.order||0) - (b.order||0)));
      } catch {}
    })();
    return () => { mounted = false; };
  }, [featuredOnly]);

  // Auto-slide every 2s through all mentors
  useEffect(() => {
    if (!mentors || mentors.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((idx) => (idx + 1) % mentors.length);
    }, 2000);
    return () => clearInterval(id);
  }, [mentors]);

  if (!mentors || mentors.length === 0) return null;

  const highlight = mentors[currentIndex] || mentors[0];

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Our Mentors</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left copy */}
        <div>
          <p className="text-sm font-semibold text-emerald-600">My Mission With Career Redefine</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">A Mentor’s Promise to You</h2>
          {highlight?.bio && (
            <p className="mt-4 text-gray-600 leading-relaxed">{highlight.bio}</p>
          )}
        </div>

        {/* Right card */}
        <div className="relative">
          {/* Top-right badge */}
          <div className="absolute -top-3 right-6 z-10">
            <span className="inline-block rounded-full bg-white/90 backdrop-blur px-3 py-1 text-sm font-medium text-gray-700 shadow border">Mentor</span>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-gray-900 relative">
            <div className="relative aspect-[16/10] w-full">
              <img src={highlight?.image} alt={highlight?.name} className="absolute inset-0 w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-900/60 to-indigo-900/50" />

              {/* Overlay content */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col">
                <div className="flex items-center gap-2 text-indigo-200">
                  <Quote className="w-5 h-5" />
                  <span className="text-xs uppercase tracking-wide">My Mission With Career Redefine…</span>
                </div>
                <h3 className="mt-3 text-xl sm:text-2xl font-bold text-indigo-50">A Mentor’s Promise to You</h3>
                {highlight?.bio && (
                  <p className="mt-3 text-sm sm:text-base text-indigo-100/90 line-clamp-4">{highlight.bio}</p>
                )}

                {/* Name bar */}
                <div className="mt-auto">
                  <div className="w-full rounded-xl bg-indigo-700/80 backdrop-blur px-4 py-3 text-indigo-50 shadow-inner">
                    <div className="text-base sm:text-lg font-semibold">{highlight?.name}</div>
                    <div className="text-xs sm:text-sm opacity-90">{highlight?.title}{highlight?.company ? ` | ${highlight.company}` : ''}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chip under card */}
          {(highlight?.company || highlight?.title) && (
            <div className="mt-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow border">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                {highlight.company || highlight.title}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MentorsCarousel;
