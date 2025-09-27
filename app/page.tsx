import Link from "next/link";
import InfoBoxes from "@/components/InfoBoxes";
import Hero from "@/components/Hero";

const HomePage = () => {//app/page.tsx is home page
  return (<div>
    <Hero />
    {/* <InfoBoxes /> */}
    {/* <Link href='talks'
      // {{
      // pathname: 'talks',
      // query: { name: 'test'}
      // }}
    >Go to talks</Link> */}
    
  </div> );
}
 
export default HomePage;