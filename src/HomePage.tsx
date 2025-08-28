import CoursesSection from './components/CoursesSection';
import PartnershipsSection from './components/PartnershipsSection';
import TestimonialsSection from './components/TestimonialsSection';
import StatisticsSection from './components/StatisticsSection';
import CorporateSection from './components/CorporateSection';
import AboutSection from './components/AboutSection';
import AwardsSection from './components/AwardsSection';
import InsightsSection from './components/InsightsSection';
import HeroSection from './components/HeroSection';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <CoursesSection />
      <PartnershipsSection />
      <TestimonialsSection />
      <StatisticsSection />
      <CorporateSection />
      <AboutSection />
      <AwardsSection />
      <InsightsSection />
    </>
  );
};

export default HomePage;
