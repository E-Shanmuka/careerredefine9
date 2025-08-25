import React from 'react';
import { Users, Rocket, Target, Heart } from 'lucide-react';

const teamMembers = [
  {
    name: 'Jane Doe',
    role: 'Co-Founder & CEO',
    avatar: 'https://randomuser.me/api/portraits/women/60.jpg',
    bio: 'Jane is a visionary leader with over 15 years of experience in the tech and HR industries. She is passionate about leveraging technology to solve complex career challenges and empower individuals to reach their full potential.',
  },
  {
    name: 'John Smith',
    role: 'Co-Founder & CTO',
    avatar: 'https://randomuser.me/api/portraits/men/60.jpg',
    bio: 'John is the technical genius behind our platform. With a background in AI and machine learning, he leads our engineering team in building innovative tools that redefine the job search and career development landscape.',
  },
];

const AboutSectionContent: React.FC = () => {
  return (
    <div className="bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center py-20 md:py-32 px-4">
        <div className="absolute inset-0 bg-black opacity-50"></div>
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
        </div>
      </div>

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

      {/* Meet the Founders Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Meet the Visionaries</h2>
            <p className="mt-4 text-lg text-gray-600">The leaders driving our mission forward.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-lg text-center">
                <img src={member.avatar} alt={member.name} className="h-32 w-32 rounded-full mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-indigo-600 font-semibold">{member.role}</p>
                <p className="mt-4 text-gray-700">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSectionContent;
