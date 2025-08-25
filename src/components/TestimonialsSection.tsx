import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star, Briefcase, TrendingUp } from 'lucide-react';

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: "Padmini Kadhirvel",
      company: "TachoMind",
      beforeRole: "Online Support Associate",
      afterRole: "Automation Testing Engineer",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
      testimonial: "Career Redefine completely transformed my career trajectory. The personalized mentorship and hands-on projects helped me transition from support to engineering.",
      rating: 5,
      salaryIncrease: "150%"
    },
    {
      name: "Rajesh Kumar",
      company: "Tech Innovations",
      beforeRole: "Data Entry Clerk",
      afterRole: "Full Stack Developer",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=200",
      testimonial: "The comprehensive curriculum and industry mentors helped me build a strong foundation in web development. Now I'm working on exciting projects!",
      rating: 5,
      salaryIncrease: "200%"
    },
    {
      name: "Priya Sharma",
      company: "DataFlow Solutions",
      beforeRole: "Marketing Assistant",
      afterRole: "Data Scientist",
      image: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=200",
      testimonial: "The AI and Machine Learning course was exceptional. The real-world projects and career guidance helped me land my dream job in data science.",
      rating: 5,
      salaryIncrease: "180%"
    },
    {
      name: "Arjun Patel",
      company: "Cloud Systems Inc",
      beforeRole: "IT Support",
      afterRole: "DevOps Engineer",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200",
      testimonial: "The cloud computing and DevOps program was incredibly comprehensive. The hands-on labs and certification prep were invaluable for my career growth.",
      rating: 5,
      salaryIncrease: "160%"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-bounce"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>Success Stories</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Journey of Our
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Career Champions
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories of professionals who transformed their careers and achieved their dreams with our programs.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 items-center">
            {/* Main Featured Card */}
            <div className="md:col-span-2 order-2 md:order-1">
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-105">
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="w-12 h-12 text-blue-500 opacity-50" />
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                  "{testimonials[activeIndex].testimonial}"
                </blockquote>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Author Info */}
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonials[activeIndex].image}
                    alt={testimonials[activeIndex].name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonials[activeIndex].name}</h4>
                    <p className="text-blue-600 font-medium">{testimonials[activeIndex].company}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Transformation Card */}
            <div className="md:col-span-2 order-1 md:order-2">
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl">
                <div className="text-center mb-8">
                  <img
                    src={testimonials[activeIndex].image}
                    alt={testimonials[activeIndex].name}
                    className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white/30 object-cover"
                  />
                  <h3 className="text-2xl font-bold mb-2">{testimonials[activeIndex].name}</h3>
                  <p className="text-blue-100">{testimonials[activeIndex].company}</p>
                </div>

                {/* Career Progress */}
                <div className="space-y-6">
                  {/* Before */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Briefcase className="w-5 h-5 text-blue-200" />
                      <span className="text-blue-200 font-medium">Before Training</span>
                    </div>
                    <p className="text-white font-semibold">{testimonials[activeIndex].beforeRole}</p>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <TrendingUp className="w-8 h-8 text-green-300" />
                  </div>

                  {/* After */}
                  <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-300/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <Briefcase className="w-5 h-5 text-green-300" />
                      <span className="text-green-300 font-medium">After Training</span>
                    </div>
                    <p className="text-white font-semibold text-lg">{testimonials[activeIndex].afterRole}</p>
                    <div className="mt-2 inline-flex items-center space-x-2 bg-green-500/30 rounded-lg px-3 py-1">
                      <TrendingUp className="w-4 h-4 text-green-300" />
                      <span className="text-green-300 font-bold">{testimonials[activeIndex].salaryIncrease} Salary Increase</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center mt-12 space-x-8">
            <button
              onClick={prevSlide}
              className="p-3 bg-white shadow-lg rounded-full hover:shadow-xl transition-shadow border border-gray-200 hover:border-blue-300"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 bg-white shadow-lg rounded-full hover:shadow-xl transition-shadow border border-gray-200 hover:border-blue-300"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;