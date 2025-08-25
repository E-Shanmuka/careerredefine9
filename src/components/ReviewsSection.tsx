import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';

type ReviewItem = {
  _id: string;
  comment: string;
  rating: number;
  createdAt?: string;
  user?: { name?: string; photo?: string };
  course?: { _id: string; title?: string };
};

const ReviewsSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  // course is optional in UI; rating is numeric with a default value
  const [form, setForm] = useState<{ course?: string; rating: number; comment: string }>({ rating: 5, comment: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await reviewService.getAll({ limit: 12 });
        const list = (res?.data?.reviews ?? res?.reviews ?? []) as ReviewItem[];
        if (mounted) setReviews(list);
      } catch (e) {
        console.error('Failed to load reviews', e);
        if (mounted) setError('Failed to load reviews');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rating || !form.comment) {
      alert('Rating and Comment are required');
      return;
    }
    const ratingNum = Number(form.rating);
    if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      alert('Rating must be between 1 and 5');
      return;
    }
    try {
      setCreating(true);
      const res = await reviewService.create({
        rating: ratingNum,
        comment: form.comment,
      });
      const created: ReviewItem = res?.data?.review ?? res?.review ?? res;
      if (created?._id) {
        setReviews((prev) => [created, ...prev]);
        setForm({ rating: 5, comment: '' });
        setShowForm(false);
      }
    } catch (err: any) {
      console.error('Create review failed', err);
      alert(err?.response?.data?.message || 'Failed to create review. Make sure you are enrolled in this course.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-gray-50 font-sans">
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-center py-20 md:py-32 px-4">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">What learners say</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Read authentic reviews from our community.
          </p>
          {isAuthenticated && (
            <div className="mt-6">
              <button onClick={() => setShowForm((s) => !s)} className="inline-flex items-center rounded-md bg-white/90 text-indigo-700 px-4 py-2 font-semibold hover:bg-white">
                {showForm ? 'Cancel' : 'Add Review'}
              </button>
            </div>
          )}
        </div>
      </div>

      {isAuthenticated && showForm && (
        <div className="bg-white py-8">
          <div className="max-w-3xl mx-auto px-4">
            <form onSubmit={submit} className="grid grid-cols-1 gap-4">
              {/* Clickable star rating */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 mr-2">Your rating:</span>
                {Array.from({ length: 5 }).map((_, i) => {
                  const starValue = i + 1;
                  const active = form.rating >= starValue;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                      onClick={() => setForm({ ...form, rating: starValue })}
                      className="focus:outline-none"
                    >
                      <Star className={`h-6 w-6 ${active ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    </button>
                  );
                })}
                <span className="ml-2 text-sm text-gray-700">{form.rating}/5</span>
              </div>

              {/* Review comment */}
              <textarea
                className="border rounded px-3 py-2"
                placeholder="Share your experience (min 3 characters)"
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                rows={4}
                required
                minLength={3}
              />
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" disabled={creating} className={`inline-flex items-center rounded-md px-4 py-2 text-white ${creating ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                  {creating ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && <div className="text-center text-gray-500">Loading reviews...</div>}
          {error && <div className="text-center text-red-600">{error}</div>}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((rev) => (
                <div key={rev._id} className="bg-white p-8 rounded-xl shadow-lg flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-4">
                      {(rev.user?.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-900">{rev.user?.name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-600">{rev.course?.title || 'Course'}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    {Array.from({ length: Math.max(0, Math.min(5, rev.rating ?? 0)) }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
