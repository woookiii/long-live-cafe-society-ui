'use client';
import { useRouter, useParams, useSearchParams, usePathname } from "next/navigation";

const TalkPage = (/*this is where sever component write params and search params */) => {
  const router = useRouter();
  //fuction set of routing like redirect
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();//show all thing after domain talks/1 it dont have any attribute, but itself pathname i can use this value when I write ternary to make navebar change according to its pathname
  // Example: Conditional rendering based on pathname
  // const isTalksPage = pathname.startsWith('/talks');

  return (<div>
    <h2 className="text-2xl">{params.id} {searchParams.get('name')}</h2>
    {/* [slug] can get by params.slug and it is not number, but string */}
    
    <button onClick={() => router.replace('/')}>Go Home</button>
  </div> );
}
 
export default TalkPage;