import Link from "next/link";

const NotFoundPage = () => {
  return ( 
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        404
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        no page here
      </p>
      <Link className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" href='/'>
        Go Back Home
      </Link>
    </div>  
  );
}
 
export default NotFoundPage;