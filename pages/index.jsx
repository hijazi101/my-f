import Image from "next/image";
import Nav from '../components/Nav';
import Hero from "../components/Hero";
import Myvideo from "../components/Myvideo";
import Footer from "../components/Footer";



export default function Home() {
  return (
    
     <div>
      <Nav/>
      <Myvideo/>
    
      <Hero/>
      <Footer/>
     </div>
  )
}
