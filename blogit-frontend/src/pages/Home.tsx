import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import Feed from './Feed';
import { FiUsers, FiShield, FiTrendingUp, FiImage } from 'react-icons/fi';

const Home: React.FC = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  if (isAuthenticated) {
    // If user is authenticated, show the feed
    return <Feed />;
  }

  // If user is not authenticated, show landing page
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-24 -z-10 transform-gpu overflow-hidden blur-2xl sm:-top-40">
          <svg
            className="relative left-1/2 -z-10 h-64 w-[80vw] -translate-x-1/2 rotate-12 sm:h-96"
            viewBox="0 0 1155 678"
          >
            <path
              fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
              fillOpacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
              <linearGradient
                id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
                x1="1155.49"
                x2="-78.208"
                y1=".177"
                y2="474.645"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0EA5E9" />
                <stop offset={1} stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Share your thoughts with the world
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Join Blogit today and connect with like-minded individuals. Share your stories, ideas, and experiences with a community that values authentic content.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="btn-primary"
              >
                Get started
              </Link>
              <Link to="/login" className="btn-ghost">
                Sign in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <svg
            className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
          >
            <path
              fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
              fillOpacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
              <linearGradient
                id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                x1="1155.49"
                x2="-78.208"
                y1=".177"
                y2="474.645"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0EA5E9" />
                <stop offset={1} stopColor="#60A5FA" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-sky-600">Blog Better</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to express yourself
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Blogit provides all the tools you need to create, share, and engage with content that matters to you.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600">
                    <FiImage className="h-6 w-6 text-white" />
                  </div>
                  Rich Media Support
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  Upload images, embed videos, and format your content exactly how you want it to look.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600">
                    <FiUsers className="h-6 w-6 text-white" />
                  </div>
                  Community Engagement
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  Connect with other writers and readers through comments, likes, and follows.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600">
                    <FiTrendingUp className="h-6 w-6 text-white" />
                  </div>
                  Personalized Feed
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  Discover content tailored to your interests and from the people you follow.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600">
                    <FiShield className="h-6 w-6 text-white" />
                  </div>
                  Privacy Controls
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  Choose who can see your content with flexible privacy settings for each post.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;