import { Briefcase, Zap, Users, BarChart, GraduationCap, LifeBuoy, Award, Code } from 'lucide-react';

const services = [
  {
    icon: <GraduationCap className="w-10 h-10 text-blue-600" />,
    title: 'Courses on Emerging Technologies',
    description: 'Stay ahead of the curve with our expert-led courses on AI, Data Science, Web3, and more. Practical, hands-on learning to make you industry-ready.',
    image: 'https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: <Briefcase className="w-10 h-10 text-blue-600" />,
    title: 'Strategic Job Search & Profile Optimization',
    description: 'Navigate the job market with a winning strategy. We help you optimize your resume, LinkedIn, and GitHub to attract top recruiters.',
    image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: <LifeBuoy className="w-10 h-10 text-blue-600" />,
    title: 'Continuous Support',
    description: 'Your career journey doesn’t end with a job. We provide continuous support for your professional growth and career transitions.',
    image: 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: <BarChart className="w-10 h-10 text-blue-600" />,
    title: 'Leadership Development',
    description: 'Cultivate the leader within you. Our programs focus on communication, decision-making, and team management skills for future leaders.',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: <Users className="w-10 h-10 text-blue-600" />,
    title: 'College Workshops',
    description: 'We partner with colleges to deliver impactful workshops on career readiness, technical skills, and industry insights for students.',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: <Zap className="w-10 h-10 text-blue-600" />,
    title: 'Mock Interviews & Hackathons',
    description: 'Gain confidence and real-world experience with our mock interview sessions and competitive hackathons, designed to sharpen your skills.',
    image: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: <Award className="w-10 h-10 text-blue-600" />,
    title: 'Certification Programs',
    description: 'Earn industry-recognized certifications that validate your skills and enhance your credibility in the job market.',
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: <Code className="w-10 h-10 text-blue-600" />,
    title: 'Project-Based Learning',
    description: 'Build a strong portfolio by working on real-world projects that showcase your abilities to potential employers.',
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export const ServicesSection = () => {
  return (
    <section className="py-20 bg-gray-50" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-down">
            Our Comprehensive Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up">
            We provide a wide range of services to support your career growth and success at every step.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
