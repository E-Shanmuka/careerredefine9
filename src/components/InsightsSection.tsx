import { useEffect, useState } from 'react';
import { Calendar, Clock, User, ArrowRight, BookOpen } from 'lucide-react';
import { articleService, Article } from '../services/articleService';

const InsightsSection = () => {
  const categories = ["All"]; // Backend tags can be wired later
  const [activeCategory, setActiveCategory] = useState("All");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await articleService.getFeatured();
        if (mounted) setArticles(data);
      } catch (e) {
        console.error('Failed to load featured articles', e);
        if (mounted) setError('Failed to load articles');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50" id="insights">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            <span>Knowledge Hub</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Latest
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Insights & Articles
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay ahead with expert insights, industry trends, and practical guidance to accelerate your career growth.
          </p>
        </div>

        {/* Category Filter (placeholder for future tags) */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center text-gray-500">Loading articles...</div>
        )}
        {error && (
          <div className="text-center text-red-600">{error}</div>
        )}

        {/* Insights Grid */}
        {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((insight, index) => (
            <article
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={insight.image || 'https://via.placeholder.com/600x300?text=Article'}
                  alt={insight.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  {(insight.tags && insight.tags[0]) || 'General'}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {insight.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {insight.summary}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Author</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>~5 min</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{insight.publishedAt ? new Date(insight.publishedAt).toLocaleDateString() : ''}</span>
                  </div>
                </div>

                {/* Read More Button */}
                <button className="group/btn flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>
        )}

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Load More Articles
          </button>
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;