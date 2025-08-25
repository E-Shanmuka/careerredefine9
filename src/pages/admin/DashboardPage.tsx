import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import { 
  UsersIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  users: number;
  jobs: number;
  courses: number;
  awards: number;
  articles: number;
  queries: number;
  questions: number;
  appointments: number;
  reviews: number;
  recentUsers: Array<{
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  recentQueries: Array<{
    _id: string;
    subject: string;
    message: string;
    user: { name: string };
    createdAt: string;
  }>;
  recentQuestions: Array<{
    _id: string;
    subject: string;
    message: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  recentAppointments: Array<{
    _id: string;
    type: string;
    user: { name: string };
    date: string;
  }>;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const section = location.hash ? location.hash.slice(1) : '';
  const validSections = new Set(['jobs', 'courses', 'articles', 'reviews', 'queries', 'questions', 'bookings', 'appointments']);
  const isSectionView = validSections.has(section);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [apptActionState, setApptActionState] = useState<Record<string, { meetingLink?: string; message?: string; loading?: 'accept' | 'reject' | null }>>({});
  // Inline form state
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    category: '',
    applicationUrl: '',
    isRemote: false,
    description: ''
  });
  const [creatingJob, setCreatingJob] = useState(false);

  const [courseForm, setCourseForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    image: '',
    price: '',
    duration: '',
    level: 'beginner',
    category: '',
    pageLink: ''
  });
  const [creatingCourse, setCreatingCourse] = useState(false);

  const [articleForm, setArticleForm] = useState({
    title: '',
    summary: '',
    content: '',
    tags: ''
  });
  const [creatingArticle, setCreatingArticle] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    course: '',
    rating: '',
    comment: ''
  });
  const [creatingReview, setCreatingReview] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    date: '',
    timeSlot: '',
    type: 'consultation'
  });
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [queryForm, setQueryForm] = useState({
    subject: '',
    message: '',
    name: '',
    email: '',
    phone: ''
  });
  const [creatingQuery, setCreatingQuery] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await adminService.getDashboardStats();
        setStats(data as DashboardStats);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // Fetch compact lists for inline admin actions
    const fetchCompactLists = async () => {
      // Robust extractor that always returns an array for the requested key
      const extract = (res: any, key: string) => {
        const d = res?.data;
        const dd = d?.data;
        // Prefer nested data container: { status, results, data: { key: [] } }
        if (Array.isArray(dd?.[key])) return dd[key];
        // Next prefer: { status, key: [] }
        if (Array.isArray(d?.[key])) return d[key];
        // Or a top-level array at res[key]
        if (Array.isArray(res?.[key])) return res[key];
        // Sometimes API may return the array directly as data
        if (Array.isArray(d)) return d;
        // Fallback: if nested data itself is an array
        if (Array.isArray(dd)) return dd;
        return [];
      };
      const results = await Promise.allSettled([
        adminService.getJobs(1, 5),
        adminService.getCourses(1, 5),
        adminService.getArticles(1, 5),
        adminService.getReviews(1, 5),
        adminService.getQueries(1, 5),
        adminService.getQuestions(1, 5),
        adminService.getAppointments(1, 5)
      ]);
      // Jobs
      if (results[0].status === 'fulfilled') setJobs(extract((results[0] as any).value, 'jobs')); else console.warn('Jobs failed');
      // Courses
      if (results[1].status === 'fulfilled') setCourses(extract((results[1] as any).value, 'courses')); else console.warn('Courses failed');
      // Articles
      if (results[2].status === 'fulfilled') setArticles(extract((results[2] as any).value, 'articles')); else console.warn('Articles failed');
      // Reviews
      if (results[3].status === 'fulfilled') setReviews(extract((results[3] as any).value, 'reviews')); else console.warn('Reviews failed');
      // Queries
      if (results[4].status === 'fulfilled') setQueries(extract((results[4] as any).value, 'queries')); else console.warn('Queries failed');
      // Questions
      if (results[5].status === 'fulfilled') setQuestions(extract((results[5] as any).value, 'questions')); else console.warn('Questions failed');
      // Appointments (bookings)
      if (results[6].status === 'fulfilled') {
        const val: any = (results[6] as any).value;
        // Try standard bookings envelope first, then any legacy key name
        const arr = extract(val, 'bookings');
        const arr2 = extract(val, 'appointments');
        setAppointments(arr.length ? arr : arr2);
      } else {
        console.warn('Appointments failed');
      }
    };
    fetchCompactLists();
  }, []);

  // Format date helper function (commented out until needed)
  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return new Intl.DateTimeFormat('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   });
  // };

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        {/* Compact Management Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Manage Content</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Jobs */}
            {(!isSectionView || section === 'jobs') && (
            <div id="jobs" className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Jobs</h3>
                <span className="text-xs text-gray-500">{jobs.length} shown</span>
              </div>
              <div className="divide-y divide-gray-200">
                {/* Inline create Job */}
                <div className="px-6 py-4">
                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!jobForm.title || !jobForm.company || !jobForm.location || !jobForm.category || !jobForm.applicationUrl) {
                        alert('Title, Company, Location, Category, and Application URL are required');
                        return;
                      }
                      try {
                        setCreatingJob(true);
                        const payload: any = {
                          title: jobForm.title,
                          company: jobForm.company,
                          location: jobForm.location,
                          type: jobForm.type,
                          category: jobForm.category,
                          applicationUrl: jobForm.applicationUrl,
                          isRemote: jobForm.isRemote,
                          description: jobForm.description,
                          postedBy: (user as any)?._id || (user as any)?.id
                        };
                        const res = await adminService.createJob(payload);
                        const created = res?.data?.job || res?.job || res?.data || res;
                        if (created?._id) {
                          setJobs((prev) => [created, ...prev].slice(0, 5));
                          setStats((prev) => (prev ? { ...prev, jobs: prev.jobs + 1 } : prev));
                          setJobForm({ title: '', company: '', location: '', type: 'full-time', category: '', applicationUrl: '', isRemote: false, description: '' });
                        }
                      } catch (err: any) {
                        console.error('Create job failed', err);
                        alert(err?.response?.data?.message || 'Failed to create job');
                      } finally {
                        setCreatingJob(false);
                      }
                    }}
                  >
                    <input className="border rounded px-3 py-2 text-sm" placeholder="Title" value={jobForm.title} onChange={(e) => setJobForm((s) => ({ ...s, title: e.target.value }))} />
                    <input className="border rounded px-3 py-2 text-sm" placeholder="Company" value={jobForm.company} onChange={(e) => setJobForm((s) => ({ ...s, company: e.target.value }))} />
                    <input className="border rounded px-3 py-2 text-sm" placeholder="Location" value={jobForm.location} onChange={(e) => setJobForm((s) => ({ ...s, location: e.target.value }))} />
                    <select className="border rounded px-3 py-2 text-sm" value={jobForm.type} onChange={(e) => setJobForm((s) => ({ ...s, type: e.target.value }))}>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                    <input className="border rounded px-3 py-2 text-sm" placeholder="Category" value={jobForm.category} onChange={(e) => setJobForm((s) => ({ ...s, category: e.target.value }))} />
                    <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Application URL" value={jobForm.applicationUrl} onChange={(e) => setJobForm((s) => ({ ...s, applicationUrl: e.target.value }))} />
                    <div className="flex items-center gap-2 md:col-span-2">
                      <input id="job-remote" type="checkbox" className="h-4 w-4" checked={jobForm.isRemote} onChange={(e) => setJobForm((s) => ({ ...s, isRemote: e.target.checked }))} />
                      <label htmlFor="job-remote" className="text-sm text-gray-600">Remote</label>
                    </div>
                    <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Description (optional)" value={jobForm.description} onChange={(e) => setJobForm((s) => ({ ...s, description: e.target.value }))} />
                    <div className="md:col-span-2 flex justify-end">
                      <button type="submit" disabled={creatingJob} className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white ${creatingJob ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                        {creatingJob ? 'Creating...' : 'Quick Create Job'}
                      </button>
                    </div>
                  </form>
                </div>
                {jobs.map((j) => (
                  <div key={j._id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{j.title}</p>
                      <p className="text-xs text-gray-500">{j.company} • {j.location}</p>
                    </div>
                    <button
                      onClick={async () => {
                        if (!j._id) return;
                        if (!window.confirm('Delete this job?')) return;
                        try {
                          setDeletingId(j._id);
                          await adminService.deleteJob(j._id);
                          setJobs((prev) => prev.filter((x) => x._id !== j._id));
                          setStats((prev) => prev ? { ...prev, jobs: Math.max(0, prev.jobs - 1) } : prev);
                        } catch (e) {
                          console.error('Delete job failed', e);
                          alert('Failed to delete job');
                        } finally {
                          setDeletingId(null);
                        }
                      }}
                      className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white ${deletingId === j._id ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                      disabled={deletingId === j._id}
                    >
                      {deletingId === j._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <div className="px-6 py-6 text-sm text-gray-500">No jobs found</div>
                )}
              </div>
            </div>
            )}
            {/* Questions (alias for support form submissions) */}
            {(!isSectionView || section === 'questions') && (
            <div id="questions" className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                <span className="text-xs text-gray-500">{questions.length} shown</span>
              </div>
              <div className="divide-y divide-gray-200">
                {questions.map((q) => (
                  <div key={q._id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <button
                        type="button"
                        className="text-left"
                        onClick={() => setExpandedQuestionId(expandedQuestionId === q._id ? null : q._id)}
                      >
                        <p className="text-sm font-medium text-gray-900">{q.subject || 'Question'}</p>
                        <p className="text-xs text-gray-500">From: {q.name || q.user?.name || 'Unknown'} • {q.email || q.user?.email || '-'}</p>
                      </button>
                      <button
                        onClick={async () => {
                          if (!q._id) return;
                          if (!window.confirm('Delete this question?')) return;
                          try {
                            setDeletingId(q._id);
                            await adminService.deleteQuestion(q._id);
                            setQuestions((prev) => prev.filter((x) => x._id !== q._id));
                            setStats((prev) => prev ? { ...prev, questions: Math.max(0, prev.questions - 1) } : prev);
                          } catch (e) {
                            console.error('Delete question failed', e);
                            alert('Failed to delete question');
                          } finally {
                            setDeletingId(null);
                          }
                        }}
                        className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white ${deletingId === q._id ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                        disabled={deletingId === q._id}
                      >
                        {deletingId === q._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                    {expandedQuestionId === q._id && (
                      <div className="mt-3 text-sm text-gray-700 space-y-1">
                        <p><span className="font-medium">Name:</span> {q.name || q.user?.name || '-'}</p>
                        <p><span className="font-medium">Email:</span> {q.email || q.user?.email || '-'}</p>
                        <p><span className="font-medium">Phone:</span> {q.phone || '-'}</p>
                        <p><span className="font-medium">Subject:</span> {q.subject || '-'}</p>
                        <p><span className="font-medium">Message:</span> {q.message || '-'}</p>
                        {q.createdAt && (
                          <p className="text-xs text-gray-400">Created: {new Date(q.createdAt).toLocaleString()}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {questions.length === 0 && (
                  <div className="px-6 py-6 text-sm text-gray-500">No questions found</div>
                )}
              </div>
            </div>
            )}

            {/* Courses */}
            {(!isSectionView || section === 'courses') && (
            <div id="courses" className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Courses</h3>
                <span className="text-xs text-gray-500">{courses.length} shown</span>
              </div>
              <div className="divide-y divide-gray-200">
                {/* Inline create Course */}
                <div className="px-6 py-4">
                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!courseForm.title || !courseForm.shortDescription || !courseForm.description || !courseForm.image || !courseForm.category) {
                        alert('Title, Short Description, Description, Image URL, and Category are required');
                        return;
                      }
                      try {
                        setCreatingCourse(true);
                        const payload: any = {
                          title: courseForm.title,
                          shortDescription: courseForm.shortDescription,
                          description: courseForm.description,
                          image: courseForm.image,
                          price: courseForm.price ? Number(courseForm.price) : undefined,
                          duration: courseForm.duration || undefined,
                          level: courseForm.level,
                          category: courseForm.category,
                          pageLink: courseForm.pageLink || undefined
                        };
                        const res = await adminService.createCourse(payload);
                        const created = res?.data?.course || res?.course || res?.data || res;
                        if (created?._id) {
                          setCourses((prev) => [created, ...prev].slice(0, 5));
                          setStats((prev) => (prev ? { ...prev, courses: prev.courses + 1 } : prev));
                          setCourseForm({ title: '', shortDescription: '', description: '', image: '', price: '', duration: '', level: 'beginner', category: '', pageLink: '' });
                        }
                      } catch (err: any) {
                        console.error('Create course failed', err);
                        alert(err?.response?.data?.message || 'Failed to create course');
                      } finally {
                        setCreatingCourse(false);
                      }
                    }}
                  >
                    <input className="border rounded px-3 py-2 text-sm" placeholder="Title" value={courseForm.title} onChange={(e) => setCourseForm((s) => ({ ...s, title: e.target.value }))} />
                    <input className="border rounded px-3 py-2 text-sm" placeholder="Category" value={courseForm.category} onChange={(e) => setCourseForm((s) => ({ ...s, category: e.target.value }))} />
                    <input className="border rounded px-3 py-2 text-sm" placeholder="Price" value={courseForm.price} onChange={(e) => setCourseForm((s) => ({ ...s, price: e.target.value }))} />
                    <input className="border rounded px-3 py-2 text-sm" placeholder="Duration" value={courseForm.duration} onChange={(e) => setCourseForm((s) => ({ ...s, duration: e.target.value }))} />
                    <select className="border rounded px-3 py-2 text-sm" value={courseForm.level} onChange={(e) => setCourseForm((s) => ({ ...s, level: e.target.value }))}>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Image URL" value={courseForm.image} onChange={(e) => setCourseForm((s) => ({ ...s, image: e.target.value }))} />
                    <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Page Link (optional)" value={courseForm.pageLink} onChange={(e) => setCourseForm((s) => ({ ...s, pageLink: e.target.value }))} />
                    <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Short Description" value={courseForm.shortDescription} onChange={(e) => setCourseForm((s) => ({ ...s, shortDescription: e.target.value }))} />
                    <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Description" value={courseForm.description} onChange={(e) => setCourseForm((s) => ({ ...s, description: e.target.value }))} />
                    <div className="md:col-span-2 flex justify-end">
                      <button type="submit" disabled={creatingCourse} className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white ${creatingCourse ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                        {creatingCourse ? 'Creating...' : 'Quick Create Course'}
                      </button>
                    </div>
                  </form>
                </div>
                {courses.map((c) => (
                  <div key={c._id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{c.title}</p>
                      <p className="text-xs text-gray-500">{c.category} • {c.level || 'N/A'}</p>
                      {c.pageLink && (
                        <p className="text-xs mt-1"><a className="text-indigo-600 hover:underline" href={c.pageLink} target="_blank" rel="noreferrer">Open page</a></p>
                      )}
                    </div>
                    <button
                      onClick={async () => {
                        if (!c._id) return;
                        if (!window.confirm('Delete this course?')) return;
                        try {
                          setDeletingId(c._id);
                          await adminService.deleteCourse(c._id);
                          setCourses((prev) => prev.filter((x) => x._id !== c._id));
                          setStats((prev) => prev ? { ...prev, courses: Math.max(0, prev.courses - 1) } : prev);
                        } catch (e) {
                          console.error('Delete course failed', e);
                          alert('Failed to delete course');
                        } finally {
                          setDeletingId(null);
                        }
                      }}
                      className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white ${deletingId === c._id ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                      disabled={deletingId === c._id}
                    >
                      {deletingId === c._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                ))}
                {courses.length === 0 && (
                  <div className="px-6 py-6 text-sm text-gray-500">No courses found</div>
                )}
              </div>
            </div>
            )}
            {/* Articles */}
            {(!isSectionView || section === 'articles') && (
            <div id="articles" className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Articles</h3>
                <span className="text-xs text-gray-500">{articles.length} shown</span>
              </div>
              <div className="divide-y divide-gray-200">
                {/* Inline create Article */}
                <div className="px-6 py-4">
                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!articleForm.title || !articleForm.summary || !articleForm.content) {
                        alert('Title, Summary and Content are required');
                        return;
                      }
                      try {
                        setCreatingArticle(true);
                        const payload = {
                          title: articleForm.title,
                          summary: articleForm.summary,
                          content: articleForm.content,
                          tags: articleForm.tags
                            ? articleForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
                            : []
                        } as any;
                        const res = await adminService.createArticle(payload);
                        const created = res?.data?.article || res?.article || res?.data || res;
                        if (created?._id) {
                          setArticles((prev) => [created, ...prev].slice(0, 5));
                          setStats((prev) => (prev ? { ...prev, articles: prev.articles + 1 } : prev));
                          setArticleForm({ title: '', summary: '', content: '', tags: '' });
                        }
                      } catch (err: any) {
                        console.error('Create article failed', err);
                        alert(err?.response?.data?.message || 'Failed to create article');
                      } finally {
                        setCreatingArticle(false);
                      }
                    }}
                  >
                    <input
                      className="border rounded px-3 py-2 text-sm"
                      placeholder="Title"
                      value={articleForm.title}
                      onChange={(e) => setArticleForm((s) => ({ ...s, title: e.target.value }))}
                    />
                    <input
                      className="border rounded px-3 py-2 text-sm"
                      placeholder="Summary"
                      value={articleForm.summary}
                      onChange={(e) => setArticleForm((s) => ({ ...s, summary: e.target.value }))}
                    />
                    <input
                      className="border rounded px-3 py-2 text-sm md:col-span-2"
                      placeholder="Content"
                      value={articleForm.content}
                      onChange={(e) => setArticleForm((s) => ({ ...s, content: e.target.value }))}
                    />
                    <input
                      className="border rounded px-3 py-2 text-sm md:col-span-2"
                      placeholder="Tags (comma separated)"
                      value={articleForm.tags}
                      onChange={(e) => setArticleForm((s) => ({ ...s, tags: e.target.value }))}
                    />
                    <div className="md:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={creatingArticle}
                        className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white ${creatingArticle ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                      >
                        {creatingArticle ? 'Creating...' : 'Quick Create Article'}
                      </button>
                    </div>
                  </form>
                </div>
                {articles.map((a) => (
                  <div key={a._id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{a.title || 'Untitled Article'}</p>
                      <p className="text-xs text-gray-500">{Array.isArray(a.tags) ? a.tags.join(', ') : ''}</p>
                    </div>
                    <button
                      onClick={async () => {
                        if (!a._id) return;
                        if (!window.confirm('Delete this article?')) return;
                        try {
                          setDeletingId(a._id);
                          await adminService.deleteArticle(a._id);
                          setArticles((prev) => prev.filter((x) => x._id !== a._id));
                          setStats((prev) => prev ? { ...prev, articles: Math.max(0, prev.articles - 1) } : prev);
                        } catch (e) {
                          console.error('Delete article failed', e);
                          alert('Failed to delete article');
                        } finally {
                          setDeletingId(null);
                        }
                      }}
                      className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white ${deletingId === a._id ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                      disabled={deletingId === a._id}
                    >
                      {deletingId === a._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                ))}
                {articles.length === 0 && (
                  <div className="px-6 py-6 text-sm text-gray-500">No articles found</div>
                )}
              </div>
            </div>
            )}

            {/* Reviews */}
            {(!isSectionView || section === 'reviews') && (
            <div id="reviews" className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Reviews</h3>
                <span className="text-xs text-gray-500">{reviews.length} shown</span>
              </div>
              <div className="divide-y divide-gray-200">
                {/* Inline create Review (requires enrollment) */}
                <div className="px-6 py-4">
                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!reviewForm.course || !reviewForm.rating) {
                        alert('Course ID and Rating are required');
                        return;
                      }
                      const ratingNum = Number(reviewForm.rating);
                      if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
                        alert('Rating must be a number between 1 and 5');
                        return;
                      }
                      try {
                        setCreatingReview(true);
                        const payload: any = {
                          course: reviewForm.course,
                          rating: ratingNum,
                          comment: reviewForm.comment || undefined
                        };
                        const res = await adminService.createReview(payload);
                        const created = res?.data?.review || res?.review || res?.data || res;
                        if (created?._id) {
                          setReviews((prev) => [created, ...prev].slice(0, 5));
                          setStats((prev) => (prev ? { ...prev, reviews: prev.reviews + 1 } : prev));
                          setReviewForm({ course: '', rating: '', comment: '' });
                        }
                      } catch (err: any) {
                        console.error('Create review failed', err);
                        alert(err?.response?.data?.message || 'Failed to create review (are you enrolled in this course?)');
                      } finally {
                        setCreatingReview(false);
                      }
                    }}
                  >
                    <input className="border rounded px-3 py-2 text-sm" placeholder="Course ID" value={reviewForm.course} onChange={(e) => setReviewForm((s) => ({ ...s, course: e.target.value }))} />
                    <input className="border rounded px-3 py-2 text-sm" placeholder="Rating (1-5)" value={reviewForm.rating} onChange={(e) => setReviewForm((s) => ({ ...s, rating: e.target.value }))} />
                    <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Comment (optional)" value={reviewForm.comment} onChange={(e) => setReviewForm((s) => ({ ...s, comment: e.target.value }))} />
                    <div className="md:col-span-2 flex justify-end">
                      <button type="submit" disabled={creatingReview} className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white ${creatingReview ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                        {creatingReview ? 'Creating...' : 'Quick Create Review'}
                      </button>
                    </div>
                  </form>
                </div>
                {reviews.map((r) => (
                  <div key={r._id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{r.title || r.comment?.slice(0, 40) || 'Review'}</p>
                      <p className="text-xs text-gray-500">Rating: {r.rating ?? '-'}</p>
                    </div>
                    <button
                      onClick={async () => {
                        if (!r._id) return;
                        if (!window.confirm('Delete this review?')) return;
                        try {
                          setDeletingId(r._id);
                          await adminService.deleteReview(r._id);
                          setReviews((prev) => prev.filter((x) => x._id !== r._id));
                          setStats((prev) => prev ? { ...prev, reviews: Math.max(0, prev.reviews - 1) } : prev);
                        } catch (e) {
                          console.error('Delete review failed', e);
                          alert('Failed to delete review');
                        } finally {
                          setDeletingId(null);
                        }
                      }}
                      className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white ${deletingId === r._id ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                      disabled={deletingId === r._id}
                    >
                      {deletingId === r._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="px-6 py-6 text-sm text-gray-500">No reviews found</div>
                )}
              </div>
            </div>
            )}
            {/* Queries */}
            {(!isSectionView || section === 'queries') && (
            <div id="queries" className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Queries</h3>
                <span className="text-xs text-gray-500">{queries.length} shown</span>
              </div>
              <div className="divide-y divide-gray-200">
                {/* Inline create Query */}
                <div className="px-6 py-4">
                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!queryForm.subject || !queryForm.message) {
                        alert('Subject and Message are required');
                        return;
                      }
                      try {
                        setCreatingQuery(true);
                        const payload: any = {
                          subject: queryForm.subject,
                          message: queryForm.message,
                          name: queryForm.name || undefined,
                          email: queryForm.email || undefined,
                          phone: queryForm.phone || undefined
                        };
                        const res = await adminService.createQuery(payload);
                        const created = res?.data?.query || res?.query || res?.data || res;
                        if (created?._id) {
                          setQueries((prev) => [created, ...prev].slice(0, 5));
                          setStats((prev) => (prev ? { ...prev, queries: prev.queries + 1 } : prev));
                          setQueryForm({ subject: '', message: '', name: '', email: '', phone: '' });
                        }
                      } catch (err: any) {
                        console.error('Create query failed', err);
                        alert(err?.response?.data?.message || 'Failed to create query');
                      } finally {
                        setCreatingQuery(false);
                      }
                    }}
                  >
                    <input className="border rounded px-3 py-2 text-sm" placeholder="Subject" value={queryForm.subject} onChange={(e) => setQueryForm((s) => ({ ...s, subject: e.target.value }))} />
                    <input className="border rounded px-3 py-2 text-sm" placeholder="Name (optional)" value={queryForm.name} onChange={(e) => setQueryForm((s) => ({ ...s, name: e.target.value }))} />
                    <input className="border rounded px-3 py-2 text-sm" placeholder="Email (optional)" value={queryForm.email} onChange={(e) => setQueryForm((s) => ({ ...s, email: e.target.value }))} />
                    <input className="border rounded px-3 py-2 text-sm" placeholder="Phone (optional)" value={queryForm.phone} onChange={(e) => setQueryForm((s) => ({ ...s, phone: e.target.value }))} />
                    <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Message" value={queryForm.message} onChange={(e) => setQueryForm((s) => ({ ...s, message: e.target.value }))} />
                    <div className="md:col-span-2 flex justify-end">
                      <button type="submit" disabled={creatingQuery} className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white ${creatingQuery ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                        {creatingQuery ? 'Creating...' : 'Quick Create Query'}
                      </button>
                    </div>
                  </form>
                </div>
                {queries.map((q) => (
                  <div key={q._id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{q.subject || 'Query'}</p>
                      <p className="text-xs text-gray-500">{q.status || 'new'}</p>
                    </div>
                    <button
                      onClick={async () => {
                        if (!q._id) return;
                        if (!window.confirm('Delete this query?')) return;
                        try {
                          setDeletingId(q._id);
                          await adminService.deleteQuery(q._id);
                          setQueries((prev) => prev.filter((x) => x._id !== q._id));
                          setStats((prev) => prev ? { ...prev, queries: Math.max(0, prev.queries - 1) } : prev);
                        } catch (e) {
                          console.error('Delete query failed', e);
                          alert('Failed to delete query');
                        } finally {
                          setDeletingId(null);
                        }
                      }}
                      className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white ${deletingId === q._id ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                      disabled={deletingId === q._id}
                    >
                      {deletingId === q._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                ))}
                {queries.length === 0 && (
                  <div className="px-6 py-6 text-sm text-gray-500">No queries found</div>
                )}
              </div>
            </div>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        
        {stats && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Users Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md p-3 bg-indigo-500">
                      <UsersIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{stats.users}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="/admin/users" className="font-medium text-indigo-600 hover:text-indigo-900">View all</a>
                  </div>
                </div>
              </div>
              
              {/* Jobs Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md p-3 bg-green-500">
                      <UsersIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Jobs</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{stats.jobs}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="/admin/jobs" className="font-medium text-indigo-600 hover:text-indigo-900">View all</a>
                  </div>
                </div>
              </div>
              
              {/* Courses Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md p-3 bg-yellow-500">
                      <UsersIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Courses</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{stats.courses}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="/admin/courses" className="font-medium text-indigo-600 hover:text-indigo-900">View all</a>
                  </div>
                </div>
              </div>
              
              {/* Queries Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md p-3 bg-red-500">
                      <UsersIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Queries</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{stats.queries}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                {/* No external page link; managed inline below */}
              </div>
            </div>
          </div>
        )}
        
        {/* Recent Activity */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Recent Users */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">New Users</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {(stats?.recentUsers ?? []).map((u) => (
                  <div key={u._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <UsersIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{u.name}</p>
                          <p className="text-sm text-gray-500">{u.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          if (!u._id) return;
                          const ok = window.confirm('Delete this user?');
                          if (!ok) return;
                          try {
                            setDeletingId(u._id);
                            await adminService.deleteUser(u._id);
                            setStats((prev) => prev ? {
                              ...prev,
                              users: Math.max(0, prev.users - 1),
                              recentUsers: prev.recentUsers.filter((x) => x._id !== u._id)
                            } : prev);
                          } catch (e) {
                            console.error('Delete user failed', e);
                            alert('Failed to delete user');
                          } finally {
                            setDeletingId(null);
                          }
                        }}
                        className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white ${deletingId === u._id ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                        disabled={deletingId === u._id}
                      >
                        {deletingId === u._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Queries */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Queries</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {(stats?.recentQueries ?? []).slice(0, 5).map((q) => (
                  <div key={q._id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UsersIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{q.subject}</p>
                          <p className="text-sm text-gray-500">{q.message}</p>
                          <p className="text-xs text-gray-400 mt-1">From: {q.user?.name || 'Unknown'}</p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          if (!q._id) return;
                          const ok = window.confirm('Delete this query?');
                          if (!ok) return;
                          try {
                            setDeletingId(q._id);
                            await adminService.deleteQuery(q._id);
                            setStats((prev) => prev ? {
                              ...prev,
                              queries: Math.max(0, prev.queries - 1),
                              recentQueries: prev.recentQueries.filter((x) => x._id !== q._id)
                            } : prev);
                          } catch (e) {
                            console.error('Delete query failed', e);
                            alert('Failed to delete query');
                          } finally {
                            setDeletingId(null);
                          }
                        }}
                        className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white ${deletingId === q._id ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                        disabled={deletingId === q._id}
                      >
                        {deletingId === q._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Recent Bookings */}
        <div id="bookings" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {/* Inline create Appointment */}
              <div className="px-6 py-4">
                <form
                  className="grid grid-cols-1 md:grid-cols-3 gap-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    // Booking model requires name, email, phone, date, timeSlot
                    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.date || !bookingForm.timeSlot) {
                      alert('Name, Email, Phone, Date and Time Slot are required');
                      return;
                    }
                    try {
                      setCreatingBooking(true);
                      const payload: any = {
                        name: bookingForm.name,
                        email: bookingForm.email,
                        phone: bookingForm.phone,
                        message: bookingForm.message || undefined,
                        date: bookingForm.date,
                        timeSlot: bookingForm.timeSlot,
                        type: bookingForm.type
                      };
                      const res = await adminService.createBooking(payload);
                      if (res?.data?.booking || res?.booking) {
                        // Optimistically notify and clear form
                        setBookingForm({ name: '', email: '', phone: '', message: '', date: '', timeSlot: '', type: 'consultation' });
                        alert('Booking created');
                      }
                    } catch (err: any) {
                      console.error('Create booking failed', err);
                      alert(err?.response?.data?.message || 'Failed to create booking');
                    } finally {
                      setCreatingBooking(false);
                    }
                  }}
                >
                  <input className="border rounded px-3 py-2 text-sm" placeholder="Name" value={bookingForm.name} onChange={(e) => setBookingForm((s) => ({ ...s, name: e.target.value }))} />
                  <input className="border rounded px-3 py-2 text-sm" placeholder="Email" value={bookingForm.email} onChange={(e) => setBookingForm((s) => ({ ...s, email: e.target.value }))} />
                  <input className="border rounded px-3 py-2 text-sm" placeholder="Phone" value={bookingForm.phone} onChange={(e) => setBookingForm((s) => ({ ...s, phone: e.target.value }))} />
                  <input type="date" className="border rounded px-3 py-2 text-sm" value={bookingForm.date} onChange={(e) => setBookingForm((s) => ({ ...s, date: e.target.value }))} />
                  <input className="border rounded px-3 py-2 text-sm" placeholder="Time Slot (e.g., 10:00)" value={bookingForm.timeSlot} onChange={(e) => setBookingForm((s) => ({ ...s, timeSlot: e.target.value }))} />
                  <select className="border rounded px-3 py-2 text-sm" value={bookingForm.type} onChange={(e) => setBookingForm((s) => ({ ...s, type: e.target.value }))}>
                    <option value="consultation">Consultation</option>
                    <option value="demo">Demo</option>
                    <option value="support">Support</option>
                    <option value="other">Other</option>
                  </select>
                  <input className="border rounded px-3 py-2 text-sm md:col-span-3" placeholder="Message (optional)" value={bookingForm.message} onChange={(e) => setBookingForm((s) => ({ ...s, message: e.target.value }))} />
                  <div className="md:col-span-3 flex justify-end">
                    <button type="submit" disabled={creatingBooking} className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white ${creatingBooking ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                      {creatingBooking ? 'Creating...' : 'Quick Create Booking'}
                    </button>
                  </div>
                </form>
              </div>
              {(appointments.length ? appointments : (stats?.recentAppointments ?? [])).slice(0, 5).map((appt) => (
                <div key={appt._id} className="px-6 py-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <UsersIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{appt.type || 'Appointment'}</p>
                      <p className="text-sm text-gray-500">With: {appt.user?.name || appt.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400 mt-1">On: {appt.date ? new Date(appt.date).toLocaleString() : '-'}</p>
                      <p className="text-xs mt-1">
                        Status: <span className="inline-flex items-center rounded px-2 py-0.5 text-white text-[11px] capitalize" style={{ backgroundColor: appt.status === 'confirmed' ? '#16a34a' : appt.status === 'cancelled' ? '#dc2626' : '#6b7280' }}>{appt.status || 'pending'}</span>
                      </p>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          type="url"
                          placeholder="Meeting link (Zoom/Google Meet)"
                          className="border rounded px-3 py-2 text-sm md:col-span-2"
                          value={apptActionState[appt._id]?.meetingLink ?? appt.meetingLink ?? ''}
                          onChange={(e) => setApptActionState((s) => ({ ...s, [appt._id]: { ...s[appt._id], meetingLink: e.target.value } }))}
                        />
                        <input
                          type="text"
                          placeholder="Message to user (optional)"
                          className="border rounded px-3 py-2 text-sm md:col-span-1"
                          value={apptActionState[appt._id]?.message ?? ''}
                          onChange={(e) => setApptActionState((s) => ({ ...s, [appt._id]: { ...s[appt._id], message: e.target.value } }))}
                        />
                        <div className="md:col-span-3 flex gap-2">
                          <button
                            className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white ${apptActionState[appt._id]?.loading === 'accept' ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                            disabled={apptActionState[appt._id]?.loading === 'accept'}
                            onClick={async () => {
                              try {
                                setApptActionState((s) => ({ ...s, [appt._id]: { ...s[appt._id], loading: 'accept' } }));
                                const payload: any = {
                                  status: 'confirmed',
                                  meetingLink: apptActionState[appt._id]?.meetingLink || appt.meetingLink,
                                  message: apptActionState[appt._id]?.message,
                                };
                                const res = await adminService.updateBookingStatus(appt._id, payload);
                                const updated = res?.data?.booking || res?.booking || res?.data || res;
                                setAppointments((prev) => prev.map((b) => (b._id === appt._id ? { ...b, ...updated } : b)));
                              } catch (e) {
                                console.error('Accept booking failed', e);
                                alert('Failed to accept booking');
                              } finally {
                                setApptActionState((s) => ({ ...s, [appt._id]: { ...s[appt._id], loading: null } }));
                              }
                            }}
                          >
                            {apptActionState[appt._id]?.loading === 'accept' ? 'Accepting...' : 'Accept'}
                          </button>
                          <button
                            className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white ${apptActionState[appt._id]?.loading === 'reject' ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                            disabled={apptActionState[appt._id]?.loading === 'reject'}
                            onClick={async () => {
                              const confirm = window.confirm('Reject (cancel) this booking? The user will be notified.');
                              if (!confirm) return;
                              try {
                                setApptActionState((s) => ({ ...s, [appt._id]: { ...s[appt._id], loading: 'reject' } }));
                                const payload: any = {
                                  status: 'cancelled',
                                  message: apptActionState[appt._id]?.message,
                                };
                                const res = await adminService.updateBookingStatus(appt._id, payload);
                                const updated = res?.data?.booking || res?.booking || res?.data || res;
                                setAppointments((prev) => prev.map((b) => (b._id === appt._id ? { ...b, ...updated } : b)));
                              } catch (e) {
                                console.error('Reject booking failed', e);
                                alert('Failed to reject booking');
                              } finally {
                                setApptActionState((s) => ({ ...s, [appt._id]: { ...s[appt._id], loading: null } }));
                              }
                            }}
                          >
                            {apptActionState[appt._id]?.loading === 'reject' ? 'Rejecting...' : 'Reject'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-6 py-3 text-right">
              <a href="/admin/bookings" className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                View all bookings
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
