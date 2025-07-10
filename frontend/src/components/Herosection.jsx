import { LinkUploader } from "./LinkUploader";
import heroIllustration from "../assets/hero-illustration.png";

export const HeroSection = ({ setLoading }) => {
  return (
    <section className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 px-6 md:px-12 lg:px-20 py-20 bg-base-100">
      <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary">
          Learn smarter with video-powered AI
        </h1>
        <p className="text-base-content text-lg max-w-xl mx-auto lg:mx-0">
          Upload any YouTube video. Chat with an AI to ask questions and take quizzes to reinforce learning.
        </p>
        <div className="flex justify-center lg:justify-start">
          <LinkUploader setLoading={setLoading} />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex justify-center">
        <img
          src={heroIllustration}
          alt="AI learning"
          className="w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px] drop-shadow-xl"
        />
      </div>
    </section>
  );
};
