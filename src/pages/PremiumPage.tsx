import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { materialService } from '../services/materialService';
import { meetingService, type PremiumMeeting } from '../services/meetingService';

type Material = {
  _id: string;
  name: string;
  url: string;
  createdAt: string;
  mimetype?: string;
};

const PremiumPage: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  // Meetings state
  const [meetings, setMeetings] = useState<PremiumMeeting[]>([]);
  const [mLoading, setMLoading] = useState(false);
  const [mError, setMError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await materialService.list(); // { materials }
        setMaterials(data?.materials || []);
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load materials');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadMeetings = async () => {
      setMLoading(true);
      setMError(null);
      try {
        const list = await meetingService.mine();
        setMeetings(list);
      } catch (e: any) {
        setMError(e?.response?.data?.message || e?.message || 'Failed to load meetings');
      } finally {
        setMLoading(false);
      }
    };
    loadMeetings();
  }, []);

  // Countdown helper
  const getCountdown = (iso?: string) => {
    if (!iso) return '';
    const target = new Date(iso).getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) return 'Starting now';
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  const handleSubmitMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setMError(null);
      await meetingService.create({ name: form.name, email: form.email, message: form.message });
      const list = await meetingService.mine();
      setMeetings(list);
      setForm({ name: '', email: '', message: '' });
    } catch (e: any) {
      setMError(e?.response?.data?.message || e?.message || 'Failed to submit meeting request');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Premium Features</h1>
        <p className="text-gray-600 mb-6">
          Welcome to the premium area. As a premium member, you have exclusive access to tools, content,
          and support. More features will appear here as we roll them out.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-800 mb-1">Exclusive Tools</h2>
            <p className="text-sm text-gray-600 mb-3">Access premium AI tools and advanced resources.</p>
            <Link
              to="/premium-tools"
              className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Open Tools
            </Link>
          </div>
          <div className="p-4 rounded-lg border border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-800 mb-1">Priority Support</h2>
            <p className="text-sm text-gray-600 mb-3">Get faster responses from our support team.</p>
            <div className="flex flex-wrap gap-2">
              <a
                href="tel:+918618536940"
                className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Call
              </a>
              <a
                href="https://wa.me/918618536940"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Chat with Mentor
              </a>
            </div>
          </div>
        </div>

        {/* Groups Section */}
        <div className="mt-2 mb-8 p-4 rounded-lg border border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">Groups</h2>
            <Link
              to="/groups"
              className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Open My Groups
            </Link>
          </div>
        </div>

        {/* Premium Meeting Request */}
        <div className="mt-2 mb-8 p-4 rounded-lg border border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-800 mb-2">Request a Premium Meeting</h2>
          <p className="text-sm text-gray-600 mb-3">Submit your details to request a meeting. Admin will approve and schedule it.</p>
          {mError && <div className="text-sm text-red-600 mb-2">{mError}</div>}
          <form onSubmit={handleSubmitMeeting} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            <input
              type="text"
              placeholder="Your name"
              required
              className="border rounded-md px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <input
              type="email"
              placeholder="Your email"
              required
              className="border rounded-md px-3 py-2 text-sm"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Message (optional)"
              className="border rounded-md px-3 py-2 text-sm md:col-span-1"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
            <div className="md:col-span-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={mLoading}
              >
                {mLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>

          <h3 className="font-semibold text-gray-800 mb-2">My Meetings</h3>
          {mLoading ? (
            <div className="text-gray-500 text-sm">Loading meetings...</div>
          ) : meetings.length === 0 ? (
            <div className="text-gray-500 text-sm">No meeting requests yet.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {meetings.map((mtg) => {
                const canJoin = mtg.status === 'approved' && mtg.scheduledAt ? new Date(mtg.scheduledAt).getTime() <= Date.now() : false;
                const countdown = getCountdown(mtg.scheduledAt);
                return (
                  <li key={mtg._id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="font-medium text-gray-900">{mtg.name} ({mtg.email})</div>
                      <div className="text-xs text-gray-500">Requested: {new Date(mtg.createdAt).toLocaleString()}</div>
                      <div className="text-xs">
                        <span className="mr-2">Status: <span className={mtg.status === 'approved' ? 'text-emerald-600' : mtg.status === 'rejected' ? 'text-red-600' : 'text-gray-600'}>{mtg.status}</span></span>
                        {mtg.scheduledAt && (
                          <span className="text-gray-600">Scheduled: {new Date(mtg.scheduledAt).toLocaleString()} ({countdown})</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {mtg.status === 'approved' && mtg.meetingLink ? (
                        <a
                          href={mtg.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md ${canJoin ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-gray-200 text-gray-600 cursor-not-allowed'}`}
                          onClick={(e) => { if (!canJoin) e.preventDefault(); }}
                        >
                          {canJoin ? 'Join Meeting' : 'Join (available at start time)'}
                        </a>
                      ) : (
                        <button className="px-3 py-1.5 text-sm rounded-md border" disabled>
                          {mtg.status === 'rejected' ? 'Rejected' : 'Awaiting approval'}
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Materials</h2>
          {loading ? (
            <div className="text-gray-500">Loading materials...</div>
          ) : error ? (
            <div className="text-red-600 text-sm">{error}</div>
          ) : materials.length === 0 ? (
            <div className="text-gray-500 text-sm">No materials available yet.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {materials.map((m) => (
                <li key={m._id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-gray-900">{m.name}</div>
                    <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* View button uses backend inline proxy to ensure proper extension and viewing */}
                    {(m.mimetype?.startsWith('application/pdf') || m.mimetype?.startsWith('image/')) && (
                      <button
                        onClick={() => {
                          const viewUrl = `${API_URL}/api/v1/materials/${m._id}/view`;
                          setViewerUrl(viewUrl);
                        }}
                        className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        View
                      </button>
                    )}
                    <a
                      href={`${API_URL}/api/v1/materials/${m._id}/download`}
                      className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Download
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {viewerUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setViewerUrl(null)} />
          {/* Panel */}
          <div className="relative z-10 w-[95vw] h-[90vh] md:w-[80vw] md:h-[85vh] bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <div className="text-sm text-gray-600">PDF Viewer</div>
              <div className="flex items-center gap-3">
                <a
                  href={viewerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Open in new tab
                </a>
                <button
                  onClick={() => setViewerUrl(null)}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
            <iframe
              title="PDF Viewer"
              src={viewerUrl}
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumPage;
