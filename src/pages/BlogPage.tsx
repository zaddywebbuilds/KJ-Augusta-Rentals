import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import PageMeta from '../components/PageMeta';

interface PostSummary {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  publishedAt: string;
  keywords: string[];
  readingMinutes: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/posts/index.json')
      .then(r => r.json())
      .then((data: PostSummary[]) => setPosts(data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'KJ Augusta Rentals — Travel Guide & Local Tips',
    description: 'Your insider guide to Augusta, GA — from Masters Week planning to Savannah River adventures.',
    url: 'https://kjaugustarentals.com/blog',
    publisher: {
      '@type': 'LocalBusiness',
      name: 'KJ Augusta Rentals',
      url: 'https://kjaugustarentals.com',
    },
  };

  return (
    <>
      <PageMeta
        title="Augusta GA Travel Guide & Local Tips | KJ Augusta Rentals Blog"
        description="Your insider guide to Augusta, GA. Masters Week tips, Savannah River activities, local dining, and everything you need for the perfect stay."
        path="/blog"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-ink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            className="font-manrope text-[10px] tracking-[0.35em] uppercase text-champagne mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Local Knowledge
          </motion.p>
          <motion.h1
            className="font-cormorant text-5xl sm:text-6xl text-ivory leading-tight mb-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Augusta Travel Guide
          </motion.h1>
          <motion.p
            className="font-manrope text-base text-ivory/60 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Insider tips on Masters Week, Savannah River adventures, local dining,
            and everything you need to plan the perfect Augusta stay.
          </motion.p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16 bg-linen min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-24">
              <BookOpen size={40} className="text-champagne mx-auto mb-4 opacity-50" />
              <p className="font-manrope text-sage">First post coming soon.</p>
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <motion.article
                  key={post.slug}
                  className="bg-ivory border border-champagne/20 rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  {/* Category chip */}
                  <div className="px-6 pt-6">
                    <span className="inline-block font-manrope text-[9px] tracking-[0.25em] uppercase text-champagne border border-champagne/30 px-2 py-1 rounded-sm">
                      Augusta Guide
                    </span>
                  </div>

                  <div className="px-6 pt-4 pb-6 flex flex-col flex-1">
                    <h2 className="font-cormorant text-2xl text-ink leading-snug mb-3 flex-1">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="hover:text-champagne transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    <p className="font-manrope text-sm text-sage leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-linen">
                      <div className="flex items-center gap-1.5 text-sage/60">
                        <Calendar size={12} />
                        <span className="font-manrope text-[11px]">
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })}
                        </span>
                        <span className="text-sage/40 mx-1">·</span>
                        <span className="font-manrope text-[11px]">{post.readingMinutes} min read</span>
                      </div>

                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 font-manrope text-[11px] tracking-wider uppercase text-champagne hover:text-clay transition-colors"
                      >
                        Read <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
