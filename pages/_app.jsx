import "../styles/globals.css";
import Nav from '../components/Nav'
import Hero from "../components/Hero";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

function app({ Component,  
  pageProps: { session, ...pageProps } }) {
  return (
    <div>
         <ClerkProvider {...pageProps}>
       
      <Component {...pageProps} />
    </ClerkProvider>
  </div>
  )
}

export default app