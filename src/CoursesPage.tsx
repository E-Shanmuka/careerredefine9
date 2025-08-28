import AllCoursesSection from './components/AllCoursesSection';
import FeaturedCourseSection from './components/FeaturedCourseSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import TestimonialsSection from './components/TestimonialsSection';
import OfferBanner from './components/OfferBanner';

const CoursesPage = () => {
  return (
    <>
      {/* CTA Intro Section */}
      <section className="bg-gray-50 py-6">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <p className="text-lg text-gray-800">
            For working professionals & learners with strong academic foundations, ready to grow into AI-powered decision-makers.
          </p>
          <p className="mt-2 inline-flex items-center gap-2 text-sm text-gray-700 bg-white border rounded-full px-4 py-1 shadow-sm">
            Only 30 Seats | Interview-Based Shortlisting
          </p>
          <h2 className="mt-6 text-2xl md:text-3xl font-bold text-gray-900">Book Your Free Interview Slot Today</h2>

          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/support#booking" className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:shadow-md">
              Book Interview
            </a>
            <a href="/support#booking" className="inline-flex items-center justify-center px-5 py-3 rounded-lg border font-semibold hover:bg-white">
              Book Interview
            </a>
            <a href="/support#booking" className="inline-flex items-center justify-center px-5 py-3 rounded-lg border font-semibold hover:bg-white">
              Book Interview
            </a>
          </div>
        </div>
      </section>
      <FeaturedCourseSection />
      <OfferBanner />
      <AllCoursesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
    </>
  );
};

export default CoursesPage;
