import { SignedOut, SignedIn } from "@clerk/nextjs";
import LandingPage from "./components/LandingPage";
import ProductPage from "./components/Productpage";

export default function Home() {
  return (
    <main>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <ProductPage />
      </SignedIn>
    </main>
  );
}
