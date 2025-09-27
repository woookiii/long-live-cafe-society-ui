import { ReactNode } from "react";
import Link from "next/link";

type InfoBoxProps = {
  heading: string;
  textColor: string;
  buttonInfo: {
    text: string;
    link: string;
    backGroundColor: string;
  };
  children: string;//only children is reserved attribute and 
};

const InfoBox = ({
  heading,
  textColor = 'text-gray-600 text-2xl font-bold',
  buttonInfo,
  children
}: InfoBoxProps) => {
  return (<div className={`${textColor}`}>
    {heading}
    <Link href={buttonInfo.link} className={`${buttonInfo.backGroundColor}`}>
      {buttonInfo.text}
    </Link>
    {children}
  </div> );
}
 
export default InfoBox;