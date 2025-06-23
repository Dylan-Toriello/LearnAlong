import { HeroSection } from "../components/Herosection";
import { FeatureList } from "../components/FeatureCards";

export const Home = () => {
  return (
    <main className="min-h-[calc(100vh-80px)] flex flex-col px-4 overflow-x-hidden">

      <HeroSection/>
      <FeatureList />
    </main>
  );
};
