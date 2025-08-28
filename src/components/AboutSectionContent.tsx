import React from 'react';
import { Users, Rocket, Target, Heart } from 'lucide-react';
import MentorsCarousel from './MentorsCarousel';

const AboutSectionContent: React.FC = () => {
  return (
    <div className="bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="relative text-white text-center py-20 md:py-32 px-4 overflow-hidden">
        {/* Background image */}
        <img src="/about.jpg" alt="About Career Redefine" className="absolute inset-0 w-full h-full object-cover" />
        {/* Soft overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-fadeInDown">We're Redefining Careers, Together.</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto animate-fadeInUp">
            Our mission is to empower every professional to find not just a job, but a fulfilling career path.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="prose prose-lg text-gray-700">
              <h2 className="text-3xl font-extrabold text-gray-900">Our Story</h2>
              <p>
                Founded in 2023, Career Redefine was born from a simple yet powerful idea: that everyone deserves to love what they do. Our founders, Jane and John, experienced firsthand the frustrations of navigating the modern job market. They saw a need for a more intelligent, personalized, and supportive approach to career development.
              </p>
              <p>
                We started as a small team of passionate innovators, and have grown into a global platform that has helped thousands of individuals transform their careers. We believe in the power of technology to create opportunities and the power of human connection to guide them.
              </p>
            </div>
            <div className="relative h-96">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Our team" className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-lg" />
            </div>
          </div>
          {/* Dynamic Mentors Slider */}
          <div className="mt-14">
            <MentorsCarousel featuredOnly />
          </div>
        </div>
      </div>

      {/* Mentor Section 
      <div className="relative py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="text-sm tracking-wider text-emerald-600 font-semibold">My Mission With Career Redefine</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">A Mentor’s Promise to You</h2>
              <p className="text-gray-700 leading-relaxed">
                I’ve seen careers transform when professionals stop chasing tools and start mastering real analytics, AI workflows, and product thinking. My mission with this course is simple: to help you unlock that transformation and lead in the AI-driven future without burning lakhs on overpriced programs. Learning should be premium, but it should never be expensive.
              </p>
              <div className="mt-6 p-4 rounded-xl bg-white/70 backdrop-blur border border-gray-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] transform-gpu hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-all">
                <p className="text-lg font-semibold text-gray-900">Shivam Yadav</p>
                <p className="text-sm text-gray-600">AI-ML Instructor–Mentor | ex-DataScience Instructor @Scaler | IIT Kanpur</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group perspective-[1000px]">
                <div className="relative p-2 rounded-2xl bg-gradient-to-br from-gray-100 to-white border border-gray-200 shadow-xl transform-gpu transition-transform duration-300 group-hover:rotate-x-1 group-hover:-rotate-y-1">
                  <img src="/mentor.png" alt="Mentor" className="w-full h-auto rounded-xl object-cover" />
          
                  <div className="absolute -top-4 -right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow text-xs text-gray-700 border border-gray-200">Mentor</div>
                  <div className="absolute -bottom-4 -left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow text-xs text-gray-700 border border-gray-200">AI • Analytics • Product</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>*/}

      {/* Our Values Section */}
      <div className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Core Values</h2>
            <p className="mt-4 text-lg text-gray-600">The principles that guide everything we do.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-8">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">User-Centric</h3>
              <p className="mt-2 text-gray-600">We put our users at the heart of every decision we make.</p>
            </div>
            <div className="p-8">
              <Rocket className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Innovation-Driven</h3>
              <p className="mt-2 text-gray-600">We constantly push the boundaries of technology to create better solutions.</p>
            </div>
            <div className="p-8">
              <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Results-Oriented</h3>
              <p className="mt-2 text-gray-600">We are committed to helping our users achieve tangible career outcomes.</p>
            </div>
            <div className="p-8">
              <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Community-Focused</h3>
              <p className="mt-2 text-gray-600">We foster a supportive community where everyone can grow together.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Visionaries (CEO) */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Meet the Visionaries</h2>
            <p className="mt-4 text-lg text-gray-600">The leader driving our mission forward.</p>
          </div>
          <div className="grid grid-cols-1 gap-12">
            <div className="relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-200 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                <div className="lg:col-span-1 p-8 flex items-center justify-center bg-gradient-to-b from-gray-100 to-white">
                  <img src="/ceo.png" alt="Siddu Mathapati" className="h-48 w-48 object-cover rounded-2xl shadow-lg" />
                </div>
                <div className="lg:col-span-2 p-8">
                  <h3 className="text-2xl font-bold text-gray-900">Siddu Mathapati</h3>
                  <p className="text-indigo-600 font-semibold">Founder & CEO, Career Redefine</p>
                  <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      I’m Siddu Mathapati — Founder & CEO of Career Redefine, a platform built to empower professionals with the right skills, mindset, and direction to thrive in today’s fast-changing tech world.
                    </p>
                    <p>
                      Over the years, I’ve worked across roles ranging from data science to leadership, collaborating with top industry minds, executive leaders, and fellow entrepreneurs.
                    </p>
                    <p>
                      My journey has involved building AI-powered solutions for real-world challenges, including modern policing initiatives to support smarter decision-making in public systems.
                    </p>
                    <p>
                      As an author and columnist, I regularly share insights on career growth, technology, and the future of work.
                    </p>
                    <p>
                      Through Career Redefine, I’ve helped hundreds of individuals successfully transition into tech careers — offering structured programs in Data Science, Machine Learning, and AI-powered analytics, backed by practical projects, expert mentoring, and complete career support.
                    </p>
                    <p>
                      My mission is simple: to redefine careers with clarity, confidence, and capability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSectionContent;
