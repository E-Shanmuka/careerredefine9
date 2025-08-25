import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Globe, Clock, Users, Star } from 'lucide-react';
import { courseService, Course } from '../services/courseService';
import QueryForm from './queries/QueryForm';

const CoursesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQueryCourse, setActiveQueryCourse] = useState<Course | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourses({ limit: 10 });
        if (mounted) setCourses(data);
      } catch (e) {
        console.error('Failed to load courses', e);
        if (mounted) setError('Failed to load courses');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden" id="courses">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 -left-20 w-40 h-40 bg-blue-100 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 -right-20 w-60 h-60 bg-purple-100 rounded-full opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Globe className="w-4 h-4" />
            <span>Popular Courses</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Transform Your Career with
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Industry-Leading Courses
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from industry experts with hands-on projects, personalized mentorship, 
            and job placement assistance in multiple languages.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mb-8">
          <div className="hidden md:block">
            <p className="text-gray-600">Swipe to explore our courses</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 bg-white shadow-md rounded-full hover:shadow-lg transition-shadow border border-gray-200 hover:border-gray-300"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 bg-white shadow-md rounded-full hover:shadow-lg transition-shadow border border-gray-200 hover:border-gray-300"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-500">Loading courses...</div>
        )}
        {error && (
          <div className="text-center text-red-600">{error}</div>
        )}
        {!loading && !error && (
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {courses.map((course, index) => (
            <div
              key={index}
              className="group flex-none w-80 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
            >
              {/* Course Image */}
              <div className="relative overflow-hidden">
                <img
                  src={(course as any).image || 'https://via.placeholder.com/400x240?text=Course'}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{(course as any).averageRating || 4.8}</span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                    <Globe className="w-4 h-4" />
                    <span>{(course as any).languages || 'English'}</span>
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{(course as any).duration || 'Self-paced'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{(course as any).enrolledCount ? `${(course as any).enrolledCount}+` : '—'}</span>
                    </div>
                  </div>

                  {/* Features */}
                  {(course as any).highlights && Array.isArray((course as any).highlights) && (
                    <div className="space-y-1 mb-6">
                      {(course as any).highlights.slice(0, 2).map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
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

        {/* View All Courses Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            View All Courses
          </button>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;