import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  GraduationCap,
  Briefcase,
  Users,
  Zap
} from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Welcome to Career Redefine!\n\nI'm here to help you explore our career transformation services. We provide:\n\n🎓 Industry-relevant courses in Data Science, AI, Web Development, UI/UX\n👨‍🏫 Personalized mentorship from industry experts\n💼 Job assistance and placement support\n📝 Resume building & interview preparation\n🛠️ Real-time projects and hands-on training\n🤖 AI-powered career tools and mock interviews\n📜 Professional certifications upon completion\n💰 Affordable pricing with high ROI\n\nHow can I help you with your career transformation journey today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "🎓 Our Courses",
    "👨‍🏫 Mentorship",
    "💼 Job Placement",
    "🤖 AI Tools"
  ];

  const responses: Record<string, string> = {
    "courses": "We offer comprehensive courses in:\n\n📊 Data Science & AI\n💻 Full Stack Web Development\n🎨 UI/UX Design\n☁️ Cloud Computing & DevOps\n📱 Mobile App Development\n📈 Digital Marketing\n\nAll courses include:\n✅ Live sessions with experts\n✅ Hands-on projects\n✅ Industry certifications\n✅ Job placement assistance\n\nWould you like to know more about any specific course?",
    
    "mentorship": "Our mentorship program includes:\n\n👥 1-on-1 sessions with industry experts\n📋 Personalized career roadmaps\n🎯 Goal setting and progress tracking\n📝 Resume and portfolio reviews\n🤝 Mock interviews and feedback\n📞 Regular check-ins and support\n\nOur mentors are from top companies like:\n🏢 Google, Microsoft, Amazon, Meta\n\nReady to connect with a mentor?",
    
    "job placement": "Our job placement assistance includes:\n\n🎯 100% Job Placement Support\n📊 95% Success Rate\n💼 Partner network of 500+ companies\n📝 Resume optimization\n🗣️ Interview preparation\n💰 Salary negotiation guidance\n🌐 Both domestic and international opportunities\n\nAverage salary increase: 150-200%\n\nShall I help you get started?",
    
    "ai tools": "Our AI-powered career tools:\n\n🤖 AI Resume Builder\n🎤 Mock Interview AI\n📊 Skill Assessment Platform\n🎯 Career Path Analyzer\n💼 Job Match Algorithm\n📈 Performance Analytics\n🔍 Industry Insights Dashboard\n\nAll tools are free for our students!\n\nWant to try our AI tools?"
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Generate AI response
    setTimeout(() => {
      let response = "Thank you for your question! Our team of experts can provide detailed information about all our programs. Here are some quick highlights:\n\n🚀 Industry-leading curriculum\n⭐ Expert mentorship\n💼 100% job placement support\n🏆 Proven track record\n\nWould you like to schedule a free consultation call to discuss your specific career goals?";

      // Check for keyword matches
      const lowerText = messageText.toLowerCase();
      if (lowerText.includes('course') || lowerText.includes('program') || lowerText.includes('training')) {
        response = responses.courses;
      } else if (lowerText.includes('mentor') || lowerText.includes('guidance')) {
        response = responses.mentorship;
      } else if (lowerText.includes('job') || lowerText.includes('placement') || lowerText.includes('career')) {
        response = responses['job placement'];
      } else if (lowerText.includes('ai') || lowerText.includes('tool') || lowerText.includes('technology')) {
        response = responses['ai tools'];
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    const keywordMap: Record<string, string> = {
      "🎓 Our Courses": "What courses do you provide?",
      "👨‍🏫 Mentorship": "Tell me about your mentorship program",
      "💼 Job Placement": "How does your job placement work?",
      "🤖 AI Tools": "What AI tools do you offer?"
    };
    
    handleSendMessage(keywordMap[suggestion] || suggestion);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="relative w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group transform hover:scale-110"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
          
          {/* Notification Badge */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              💬
            </div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 transition-all duration-300 transform ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      }`}>
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Career Redefine AI</h3>
                <p className="text-xs text-blue-100">Your Career Transformation Guide</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.isUser ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isUser 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                }`}>
                  {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`px-4 py-2 rounded-2xl ${
                  message.isUser
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md shadow-md border border-gray-100'
                }`}>
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {message.text}
                  </p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-md shadow-md border border-gray-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="px-4 py-2 border-t border-gray-200 bg-white">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about courses, mentorship, job assistance..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatAssistant;