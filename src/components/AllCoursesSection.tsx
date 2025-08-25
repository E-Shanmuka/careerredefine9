import { useEffect, useState } from 'react';
import { ExternalLink, Globe, Clock, Users, Star } from 'lucide-react';
import { courseService, Course } from '../services/courseService';
import QueryForm from './queries/QueryForm';

const AllCoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQueryCourse, setActiveQueryCourse] = useState<Course | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourses({ limit: 12 });
        if (mounted) setCourses(data);
      } catch (e) {
        console.error('Failed to load courses', e);
        if (mounted) setError('Failed to load courses');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="py-24 bg-gray-50" id="all-courses">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-down">
            Explore Our Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up">
            Find the perfect course to launch or advance your career in technology.
          </p>
        </div>
        {loading && (
          <div className="text-center text-gray-500">Loading courses...</div>
        )}
        {error && (
          <div className="text-center text-red-600">{error}</div>
        )}
        {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className="group flex-none w-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={course.image || 'https://via.placeholder.com/800x450?text=Course'}
                  alt={course.title || 'Course'}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{(course as any).ratingsAverage ?? course.rating ?? 0}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {course.title || 'Untitled Course'}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                  <Globe className="w-4 h-4" />
                  <span>{course.category || 'General'}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{typeof course.duration === 'number' ? `${course.duration} weeks` : 'Flexible duration'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{Array.isArray(course.enrolledStudents) ? `${course.enrolledStudents.length}` : '0'}</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <a
                    href={(course as any).pageLink || '#'}
                    target={((course as any).pageLink ? '_blank' : undefined) as any}
                    rel={((course as any).pageLink ? 'noopener noreferrer' : undefined) as any}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <span>View More</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setActiveQueryCourse(course)}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-medium rounded-xl transition-all duration-300 shadow-sm"
                  >
                    Query
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
        {/* Query Modal */}
        {activeQueryCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
              <button
                onClick={() => setActiveQueryCourse(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold mb-4">Course Query</h3>
              <QueryForm
                courseId={activeQueryCourse._id}
                courseName={activeQueryCourse.title}
                defaultSubject={`Query about ${activeQueryCourse.title}`}
                onSuccess={() => setActiveQueryCourse(null)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllCoursesSection;
