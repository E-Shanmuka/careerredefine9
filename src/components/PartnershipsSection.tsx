import styles from './PartnershipsSection.module.css';

const PartnershipsSection = () => {
  // Using placeholder logos - replace with actual partner logos
  const partners = [
    { name: 'Google', logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Microsoft', logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Amazon', logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'IBM', logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Meta', logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Netflix', logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Adobe', logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Spotify', logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=200' },
  ];

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-gray-600">
            Our accreditations & partnerships with top companies worldwide
          </p>
        </div>

        {/* Infinite Scroll Animation */}
        <div className="relative">
          <div className={`flex ${styles.animateMarquee} space-x-16`}>
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 flex items-center justify-center w-32 h-20 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 grayscale hover:grayscale-0"
              >
                <div className="w-24 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-700">{partner.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipsSection;