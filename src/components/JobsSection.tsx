import React, { useEffect, useState } from 'react';
import { MapPin, Briefcase, Building, Globe, Zap, Target } from 'lucide-react';
import { jobService } from '../services/jobService';

type BackendJob = {
  _id: string;
  title: string;
  company: string;
  location?: string;
  type?: string;
  applicationUrl?: string;
};

const features = [
    {
      icon: <Zap className="h-8 w-8 text-white" />,
      title: 'AI-Powered Matching',
      description: 'Our smart algorithm connects you with roles that perfectly match your skills, experience, and career ambitions.',
    },
    {
      icon: <Globe className="h-8 w-8 text-white" />,
      title: 'Global Opportunities',
      description: 'Explore thousands of listings from top companies and innovative startups across the globe.',
    },
    {
      icon: <Target className="h-8 w-8 text-white" />,
      title: 'Simplified Applications',
      description: 'Apply to jobs with a single click and track your application status all in one place.',
    },
  ];

const JobsSection: React.FC = () => {
  const [jobs, setJobs] = useState<BackendJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await jobService.getJobs({ limit: 12 });
        if (mounted) setJobs(data as BackendJob[]);
      } catch (e) {
        console.error('Failed to load featured jobs', e);
        if (mounted) setError('Failed to load jobs');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="relative text-white text-center py-20 md:py-32 px-4 overflow-hidden">
        {/* Background image */}
        <img src="/jobs.jpg" alt="Jobs at Career Redefine" className="absolute inset-0 w-full h-full object-cover" />
        {/* Subtle overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-fadeInDown">Find Your Next Big Opportunity</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto animate-fadeInUp">
            Your dream job is closer than you think. Apply with confidence using our powerful tools.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Why Job Seekers Love Us</h2>
            <p className="mt-4 text-lg text-gray-600">We provide the tools you need to succeed.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-600 text-white mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                <p className="mt-4 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */
      }
      <div className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Featured Job Openings</h2>
            <p className="mt-4 text-lg text-gray-600">Explore curated roles from leading companies worldwide.</p>
          </div>
          {loading && (
            <div className="text-center text-gray-500">Loading jobs...</div>
          )}
          {error && (
            <div className="text-center text-red-600">{error}</div>
          )}
          {!loading && !error && jobs.length === 0 && (
            <div className="text-center text-gray-500">No jobs found. Please check back later.</div>
          )}
          {!loading && !error && jobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job) => (
                <div key={job._id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 mr-4 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {(job.company || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center"><Building className="h-4 w-4 mr-2" />{job.company}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-2">
                      {job.location && (
                        <p className="flex items-center"><MapPin className="h-4 w-4 mr-2" />{job.location}</p>
                      )}
                      {job.type && (
                        <p className="flex items-center"><Briefcase className="h-4 w-4 mr-2" />{job.type}</p>
                      )}
                    </div>
                    <div className="mt-6">
                      <a
                        href={job.applicationUrl || '#'}
                        target={job.applicationUrl ? '_blank' : undefined}
                        rel="noreferrer"
                        className="w-full text-center block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        View & Apply
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <a href="#" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
              View All Jobs
            </a>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-indigo-600">Create your profile today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Get started
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsSection;
