import React, { useState } from 'react';
import { Search, MessageSquare, BarChart3, FileText, Award, MessageCircle, X, Code as CodeIcon, Image as ImageIcon, Music as MusicIcon, Video as VideoIcon } from 'lucide-react';
import CodeTool from '../components/ai-tools/CodeTool';
import CareerTool from '../components/ai-tools/CareerTool';
import InterviewTool from '../components/ai-tools/InterviewTool';
import SkillGapTool from '../components/ai-tools/SkillGapTool';
import SalaryTool from '../components/ai-tools/SalaryTool';
import ResumeTool from '../components/ai-tools/ResumeTool';
import MentorTool from '../components/ai-tools/MentorTool';
import ImageTool from '../components/ai-tools/ImageTool';
import DocumentTool from '../components/ai-tools/DocumentTool';
import MusicTool from '../components/ai-tools/MusicTool';
import VideoTool from '../components/ai-tools/VideoTool';

interface ToolCardProps {
  title: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  buttonText,
  icon,
  color,
  onClick,
}) => (
  <div className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300`}>
    <div className="p-6">
      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <button
        onClick={onClick}
        className={`${color} text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity`}
      >
        {buttonText}
      </button>
    </div>
  </div>
);

const AIToolsPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools = [
    {
      id: 'career-path',
      title: 'AI-Powered Career Pathfinding',
      description: 'Uncover your true potential. Our AI analyzes your skills and passions to reveal career paths you\'re destined to excel in.',
      buttonText: 'Discover Your Path',
      icon: <Search size={24} />,
      color: 'bg-blue-500'
    },
    {
      id: 'interview',
      title: 'Dynamic Interview Simulator',
      description: 'Walk into any interview with unshakable confidence. Practice with an AI that adapts to your target role and provides instant feedback.',
      buttonText: 'Start Practicing',
      icon: <MessageSquare size={24} />,
      color: 'bg-green-500'
    },
    {
      id: 'skill-gap',
      title: 'Skill Gap Identifier',
      description: 'Stay ahead of the curve. Pinpoint the exact skills you need for your dream job and get a personalized roadmap to acquire them.',
      buttonText: 'Assess Your Skills',
      icon: <BarChart3 size={24} />,
      color: 'bg-purple-500'
    },
    {
      id: 'salary',
      title: 'Salary Negotiation Advisor',
      description: 'Know your worth and get paid for it. Our AI provides data-driven insights to help you negotiate the salary you deserve.',
      buttonText: 'Maximize Your Offer',
      icon: <Award size={24} />,
      color: 'bg-yellow-500'
    },
    {
      id: 'resume',
      title: 'Resume & Cover Letter Builder',
      description: 'Create application materials that get noticed. Generate ATS-friendly resumes and compelling cover letters in minutes.',
      buttonText: 'Build Your Resume',
      icon: <FileText size={24} />,
      color: 'bg-red-500'
    },
    {
      id: 'mentor',
      title: '24/7 AI Career Mentor',
      description: 'Never get stuck again. Get instant, confidential advice on any career challenge, anytime, from your personal AI mentor.',
      buttonText: 'Ask Your Mentor',
      icon: <MessageCircle size={24} />,
      color: 'bg-indigo-500'
    },
    // Core AI utilities
    {
      id: 'code',
      title: 'Code Generator',
      description: 'Generate code snippets in multiple languages from natural language prompts.',
      buttonText: 'Open Code Tool',
      icon: <CodeIcon size={24} />,
      color: 'bg-blue-600'
    },
    {
      id: 'image',
      title: 'Image Generator',
      description: 'Create stunning AI images from detailed prompts in various styles.',
      buttonText: 'Open Image Tool',
      icon: <ImageIcon size={24} />,
      color: 'bg-purple-600'
    },
    {
      id: 'document',
      title: 'Document Assistant',
      description: 'Summarize, extract key points, and analyze documents or pasted text.',
      buttonText: 'Open Document Tool',
      icon: <FileText size={24} />,
      color: 'bg-yellow-600'
    },
    {
      id: 'music',
      title: 'Music Generator',
      description: 'Generate short music clips based on mood and style prompts.',
      buttonText: 'Open Music Tool',
      icon: <MusicIcon size={24} />,
      color: 'bg-pink-600'
    },
    {
      id: 'video',
      title: 'Video Generator',
      description: 'Prototype video concepts from prompts and style guides.',
      buttonText: 'Open Video Tool',
      icon: <VideoIcon size={24} />,
      color: 'bg-teal-600'
    },
  ];

  const renderToolContent = () => {
    const tool = tools.find(t => t.id === activeTool);
    if (!tool) return null;

    const close = () => setActiveTool(null);

    // Render real tools for known utility IDs
    const realToolMap: Record<string, React.ReactNode> = {
      'career-path': <CareerTool onClose={close} />,
      interview: <InterviewTool onClose={close} />,
      'skill-gap': <SkillGapTool onClose={close} />,
      salary: <SalaryTool onClose={close} />,
      resume: <ResumeTool onClose={close} />,
      mentor: <MentorTool onClose={close} />,
      code: <CodeTool onClose={close} />,
      image: <ImageTool onClose={close} />,
      document: <DocumentTool onClose={close} />,
      music: <MusicTool onClose={close} />,
      video: <VideoTool onClose={close} />,
    };

    const realTool = realToolMap[tool.id];

    return (
      <div className="bg-white rounded-xl shadow-lg max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{tool.title}</h2>
            <p className="text-gray-600 mt-2">{tool.description}</p>
          </div>
          <button
            onClick={close}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close tool"
          >
            <X size={24} />
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-0 min-h-[400px]">
          {realTool ? (
            <div className="h-full">
              {realTool}
            </div>
          ) : (
            <div className="p-6 min-h-[400px] flex items-center justify-center">
              <p className="text-lg text-gray-500 text-center">
                {tool.title} feature will be available here. This is a preview of how the tool will look when implemented.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Career Tools</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empower your career journey with our suite of AI-powered tools designed to help you succeed.
          </p>
        </div>

        {activeTool ? (
          renderToolContent()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                title={tool.title}
                description={tool.description}
                buttonText={tool.buttonText}
                icon={tool.icon}
                color={tool.color}
                onClick={() => setActiveTool(tool.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIToolsPage;
