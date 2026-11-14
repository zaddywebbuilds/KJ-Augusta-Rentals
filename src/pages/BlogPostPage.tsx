import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, ArrowRight, Clock, Home } from 'lucide-react';
import PageMeta from '../components/PageMeta';

interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  keywords: string[];
  readingMinutes: number;
  schema: Record<string, unknown>;
}

interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingMinutes: number;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    // Load the individual post
    fetch(`/posts/${slug}.json`)
      .then(r => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then((data: BlogPost) => {
        setPost(data);
        // Load related posts from index
        return fetch('/posts/index.json');
      })
      .then(r => r.json())
      .then((index: PostSummary[]) => {
        setRelated(index.filter(p => p.slug !== slug).slice(0, 3));
      })
      .catch(err => {
        if (err.message === 'not found') setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-linen">
        <div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linen gap-4">
        <p className="font-cormorant text-3xl text-ink">Post not found</p>
        <button onClick={() => navigate('/blog')} className="font-manrope text-sm text-champagne underline">
          Back to blog
        </button>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={post.metaTitle}
        description={post.metaDescription}
        path={`/blog/${post.slug}`}
        jsonLd={post.schema}
      />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-ink">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 font-manrope text-[11px] tracking-widest uppercase text-champagne hover:text-ivory transition-colors mb-8"
            >
              <ArrowLeft size={12} /> Blog
            </Link>

            <div className="flex items-center gap-3 mb-5">
              <span className="font-manrope text-[9px] tracking-[0.25em] uppercase text-champagne border border-champagne/30 px-2 py-1 rounded-sm">
                Augusta Guide
              </span>
            </div>

            <h1 className="font-cormorant text-4xl sm:text-5xl text-ivory leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-ivory/50">
              <span className="flex items-center gap-1.5 font-manrope text-xs">
                <Calendar size={13} className="text-champagne" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5 font-manrope text-xs">
                <Clock size={13} className="text-champagne" />
                {post.readingMinutes} min read
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article body */}
      <section className="py-14 bg-linen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="prose-blog"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Keywords */}
          {post.keywords?.length > 0 && (
            <div className="mt-10 pt-8 border-t border-champagne/20">
              <div className="flex flex-wrap gap-2">
                {post.keywords.map(kw => (
                  <span
                    key={kw}
                    className="font-manrope text-[11px] tracking-wide text-sage/70 bg-champagne/10 border border-champagne/20 px-2.5 py-1 rounded-sm"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-14 p-8 bg-ink rounded-sm text-center">
            <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-champagne mb-3">
              Ready to visit Augusta?
            </p>
            <p className="font-cormorant text-3xl text-ivory mb-6">
              Stay on the Savannah River.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/#stays"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-champagne text-ink font-manrope text-xs tracking-widest uppercase font-semibold hover:bg-clay hover:text-ivory transition-colors rounded-sm"
              >
                <Home size={14} /> View Stays
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-ivory/30 text-ivory font-manrope text-xs tracking-widest uppercase hover:border-champagne hover:text-champagne transition-colors rounded-sm"
              >
                More Articles <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="py-14 bg-ivory border-t border-champagne/15">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-cormorant text-3xl text-ink mb-8">More from the Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(rel => (
                <article
                  key={rel.slug}
                  className="border border-champagne/20 rounded-sm p-5 bg-linen hover:shadow-md transition-shadow"
                >
                  <h3 className="font-cormorant text-xl text-ink leading-snug mb-2">
                    <Link to={`/blog/${rel.slug}`} className="hover:text-champagne transition-colors">
                      {rel.title}
                    </Link>
                  </h3>
                  <p className="font-manrope text-xs text-sage leading-relaxed mb-4 line-clamp-2">
                    {rel.excerpt}
                  </p>
                  <Link
                    to={`/blog/${rel.slug}`}
                    className="inline-flex items-center gap-1 font-manrope text-[11px] tracking-wider uppercase text-champagne hover:text-clay"
                  >
                    Read <ArrowRight size={11} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
