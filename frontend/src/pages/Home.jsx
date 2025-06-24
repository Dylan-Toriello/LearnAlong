import { HeroSection } from "../components/Herosection";
import { FeatureList } from "../components/FeatureCards";

export const Home = () => {
  return (
    <main className=" flex flex-col px-4 overflow-x-hidden">

      <HeroSection/>
      <FeatureList />
    </main>
  );
};
