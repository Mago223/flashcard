"use client";
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import Spinner from "./components/Spinner";
import LandingPage from "./components/LandingPage";
import ProductPage from "./components/Productpage";

export default function Page() {
  const [authState, setAuthState] = useState("loading");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthState("authenticated");
      } else {
        setAuthState("unauthenticated");
      }
    });
    return () => unsubscribe();
  }, []);

  if (authState === "loading") {
    return <Spinner />;
  }

  if (authState === "unauthenticated") {
    return <LandingPage />;
  }

  return <ProductPage />;
}
