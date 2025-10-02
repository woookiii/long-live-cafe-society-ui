import Link from "next/link";

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 text-center">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
          Welcome to 
        </h1>
        <span className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-600">literature Society</span>
        <p className="text-lg md:text-xl text-gray-700 mt-6 mb-8">
          Discover, discuss, and share your love for literature, movie, and painting
        </p>
        <Link
          href="/talks"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 transition"
        >
          Explore Talks
        </Link>
      </div>
    </section>
  );
};

export default Hero;