import { ReactNode } from "react";
import '@/assets/styles/globals.css'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QProvider from "@/context/QueryClientContext";
import AuthProvider from "@/context/AuthContext";

export const metadata = {
  title: 'Literature society',
  keywords: 'literature debate, novel, poetry, Shakespeare',
  description: 'Find the literature friends',
}

const MainLayout = ({ children }: { children: ReactNode }) => {
  return ( 
    <html>
      <body>
        <AuthProvider>
          <QProvider>
            <div className="min-h-screen flex flex-col">
              <main className="flex-1">
                <Navbar/>
                { children }
              </main>
              <Footer/>
            </div>
          </QProvider>
        </AuthProvider>
      </body>
    </html>
   );
}
 
export default MainLayout;