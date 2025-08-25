import React, { useState } from 'react';
import { Search, MessageCircle, FileText, TrendingUp, BadgeCheck, Bot, Sparkles, X } from 'lucide-react';
import CareerTool from './ai-tools/CareerTool';
import InterviewTool from './ai-tools/InterviewTool';
import SkillGapTool from './ai-tools/SkillGapTool';
import SalaryTool from './ai-tools/SalaryTool';
import ResumeTool from './ai-tools/ResumeTool';
import MentorTool from './ai-tools/MentorTool';

const tools = [
  {
    id: 'career-path',
    icon: <Search className="w-10 h-10 text-blue-600" />,
    title: 'AI-Powered Career Pathfinding',
    description: 'Uncover your true potential. Our AI analyzes your skills and passions to reveal career paths you’re destined to excel in.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
    cta: 'Discover Your Path',
  },
  {
    id: 'interview',
    icon: <MessageCircle className="w-10 h-10 text-purple-600" />,
    title: 'Dynamic Interview Simulator',
    description: 'Walk into any interview with unshakable confidence. Practice with an AI that adapts to your target role and provides instant feedback.',
    image: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
    cta: 'Start Practicing',
  },
  {
    id: 'skill-gap',
    icon: <BadgeCheck className="w-10 h-10 text-green-600" />,
    title: 'Skill Gap Identifier',
    description: 'Stay ahead of the curve. Pinpoint the exact skills you need for your dream job and get a personalized roadmap to acquire them.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    cta: 'Assess Your Skills',
  },
  {
    id: 'salary',
    icon: <TrendingUp className="w-10 h-10 text-pink-600" />,
    title: 'Salary Negotiation Advisor',
    description: 'Know your worth and get paid for it. Our AI provides data-driven insights to help you negotiate the salary you deserve.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    cta: 'Maximize Your Offer',
  },
  {
    id: 'resume',
    icon: <FileText className="w-10 h-10 text-yellow-600" />,
    title: 'Resume & Cover Letter Builder',
    description: 'Create application materials that get noticed. Generate ATS-friendly resumes and compelling cover letters in minutes.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    cta: 'Build Your Resume',
  },
  {
    id: 'mentor',
    icon: <Bot className="w-10 h-10 text-indigo-600" />,
    title: '24/7 AI Career Mentor',
    description: 'Never get stuck again. Get instant, confidential advice on any career challenge, anytime, from your personal AI mentor.',
    image: 'https://images.unsplash.com/photo-1589386426121-6931593a8a35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    cta: 'Ask Your Mentor',
  },
];

const ToolsSection = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const renderTool = () => {
    if (!activeTool) return null;
    const close = () => setActiveTool(null);
    const map: Record<string, React.ReactNode> = {
      'career-path': <CareerTool onClose={close} />,
      interview: <InterviewTool onClose={close} />,
      'skill-gap': <SkillGapTool onClose={close} />,
      salary: <SalaryTool onClose={close} />,
      resume: <ResumeTool onClose={close} />,
      mentor: <MentorTool onClose={close} />,
    };
    const node = map[activeTool];
    if (!node) return null;
    return (
      <div className="max-w-5xl mx-auto mt-10">
        <div className="bg-white rounded-xl shadow-lg p-6 border">
          {node}
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-blue-100 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-down">
          <div className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            <Sparkles className="w-10 h-10 inline-block mr-2" />
            <span className="text-2xl font-bold">Your Future, Amplified by AI</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Unlock Your Career Superpowers
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Stop guessing, start growing. Our suite of intelligent tools provides the data-driven clarity and strategic advantage you need to conquer your career goals.
          </p>
        </div>
        
        {!activeTool && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {tools.map((tool, idx) => (
            <div
              key={tool.title}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-transparent hover:border-blue-300 transform hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="relative">
                <img src={tool.image} alt={tool.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-500"></div>
                <div className="absolute top-4 left-4 bg-white p-3 rounded-full shadow-md">
                  {tool.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-gray-600 mb-6 h-24">{tool.description}</p>
                <button onClick={() => setActiveTool(tool.id)} className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  {tool.cta}
                </button>
              </div>
            </div>
          ))}
          </div>
        )}

        {activeTool && (
          <div className="animate-fade-in">
            {renderTool()}
            <div className="max-w-5xl mx-auto mt-4 flex justify-end">
              <button onClick={() => setActiveTool(null)} className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50 inline-flex items-center">
                <X size={18} className="mr-2"/> Close
              </button>
            </div>
          </div>
        )}

        {!activeTool && (
        <div className="text-center mt-20 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Redefine Your Career?</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Join thousands of professionals who are building their dream careers with our AI-powered tools. Get started for free—no credit card required.
          </p>
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
            <span className="relative px-8 py-4 text-lg font-semibold transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Unlock All Tools Now
            </span>
          </button>
        </div>
        )}
      </div>
    </section>
  );
};

export default ToolsSection;
