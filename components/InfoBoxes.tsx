import InfoBox from './InfoBox'

const InfoBoxes = () => {
  return (<div>
    <InfoBox heading='this is heading' textColor='text-sm'
      buttonInfo={{
        text: 'Browse talks',
        link: '/talks',
        backGroundColor: 'bg-red-600'
    }}>
      this will be children
    </InfoBox>
  </div> );
}
 
export default InfoBoxes;