import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Award, Trophy, Star } from 'lucide-react';

const AwardsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const awards = [
    {
      title: "Best GenAI Training Partner",
      organization: "UBS Forums",
      description: "Recognized as the premier training partner for Generative AI education and implementation across enterprise clients.",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600",
      year: "2024",
      icon: Trophy
    },
    {
      title: "Guinness World Record",
      organization: "Guinness World Records",
      description: "Achieved the record for the most users to take an Artificial Intelligence lesson in 24 hours, demonstrating our massive reach and impact.",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600",
      year: "2023",
      icon: Award
    },
    {
      title: "Excellence in EdTech Innovation",
      organization: "Tech Excellence Awards",
      description: "Awarded for outstanding innovation in educational technology and personalized learning experiences.",
      image: "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=600",
      year: "2024",
      icon: Star
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % awards.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, awards.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % awards.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + awards.length) % awards.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section 
      className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 right-20 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-purple-300 rounded-full opacity-40 animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            <span>Recognition & Awards</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Awards &
            <span className="block bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Achievements
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Recognition from industry leaders and record-breaking achievements that showcase our commitment to excellence.
          </p>
        </div>

        {/* Awards Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="relative h-96 md:h-[500px]">
              {awards.map((award, index) => {
                const IconComponent = award.icon;
                return (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                      index === currentSlide
                        ? 'translate-x-0 opacity-100 scale-100'
                        : index < currentSlide
                        ? '-translate-x-full opacity-0 scale-95'
                        : 'translate-x-full opacity-0 scale-95'
                    }`}
                  >
                    <div className="grid md:grid-cols-2 h-full">
                      {/* Content Side */}
                      <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
                        <div className="mb-6">
                          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 uppercase tracking-widest mb-4">
                            <IconComponent className="w-5 h-5" />
                            <span>Awards & Achievements</span>
                          </div>
                          
                          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            {award.title}
                          </h3>
                          
                          <div className="flex items-center space-x-3 mb-6">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {award.year}
                            </div>
                            <span className="text-gray-600 font-medium">{award.organization}</span>
                          </div>
                        </div>

                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                          {award.description}
                        </p>

                        {/* Achievement Badge */}
                        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 w-fit">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">Excellence Award</div>
                            <div className="text-sm text-gray-600">{award.organization}</div>
                          </div>
                        </div>
                      </div>

                      {/* Image Side */}
                      <div className="relative order-1 md:order-2">
                        <img
                          src={award.image}
                          alt={award.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        
                        {/* Floating Award Icon */}
                        <div className="absolute top-6 right-6 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
                          <IconComponent className="w-8 h-8 text-yellow-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center mt-8 space-x-6">
            <button
              onClick={prevSlide}
              className="p-3 bg-white shadow-lg rounded-full hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 group"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-3">
              {awards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? 'w-12 h-3 bg-gradient-to-r from-blue-500 to-purple-500'
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 bg-white shadow-lg rounded-full hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 group"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;