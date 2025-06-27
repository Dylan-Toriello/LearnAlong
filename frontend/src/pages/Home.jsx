import { useState } from "react";
import { HeroSection } from "../components/Herosection";
import { FeatureList } from "../components/FeatureCards";
import Loader from "../components/Loading";

export const Home = () => {
  const [loading, setLoading] = useState(false); 

  if (loading) {
    return <Loader />; 
  }

  return (
    <main className="flex flex-col px-4 overflow-x-hidden">
      <HeroSection setLoading={setLoading} />
      <FeatureList />
    </main>
  );
};
