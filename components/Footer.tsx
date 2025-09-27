const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-6 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="mb-4 md:mb-0">
          <span className="font-bold text-lg">Literature Society</span>
          <span className="block text-sm text-gray-400">© {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="flex space-x-6">
          
          <div className="hover:text-white transition">Contact: mr4454@naver.com</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;