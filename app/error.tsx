'use client'
const ErrorPage = ({error}:{error:unknown}) => {
  return ( 
    <div>
      {error?.toString()}
    </div>
   );
}
 
export default ErrorPage;