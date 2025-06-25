import { Github, Linkedin, Globe } from "lucide-react";

export const About = () => {
  return (
    <section className="w-full px-10 md:px-12 lg:px-20 py-20 bg-base-100 text-base-content overflow-x-hidden">
      <div className="space-y-6 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-primary">
          What is Learn Along?
        </h1>
        <p className="text-lg">
          Learn Along is a tool that helps you learn from YouTube videos using
          AI. You can upload any educational video link, chat with an AI to ask
          questions, and take dynamic quizzes based on the video and your
          conversation.
        </p>
      </div>

      <div className="mt-20 max-w-4xl mx-auto space-y-8">
        <h2 className="text-2xl font-bold text-primary text-center">
          How It Works
        </h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <span className="text-primary font-bold text-lg">1.</span>
            <p className="text-base">
              Paste a YouTube video link into our uploader.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-primary font-bold text-lg">2.</span>
            <p className="text-base">
              The backend fetches the video’s transcript using{" "}
              <code className="text-sm font-mono bg-base-200 px-1 py-0.5 rounded">
                youtube-transcript-api
              </code>
              .
            </p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-primary font-bold text-lg">3.</span>
            <p className="text-base">
              The transcript is embedded into a vector database and queried
              using Retrieval-Augmented Generation (RAG).
            </p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-primary font-bold text-lg">4.</span>
            <p className="text-base">
              The AI answers your questions using the video’s content as
              context.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-primary font-bold text-lg">5.</span>
            <p className="text-base">
              You get a quiz based on the video and your conversation to help
              reinforce learning.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          Meet the Creators
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto">
          <div className="bg-base-200 p-6 rounded-xl shadow space-y-3">
            <h3 className="text-xl font-semibold">Rishik Yesgari</h3>
            <div className="flex gap-4 mt-2">
              <a
                href="https://github.com/Rishik15"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5 hover:text-primary transition" />
              </a>
              <a
                href="https://www.linkedin.com/in/rishikreddyyesgari/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5 hover:text-primary transition" />
              </a>
              <a
                href="https://rishik-portfolio-chi.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="w-5 h-5 hover:text-primary transition" />
              </a>
            </div>
          </div>

          {/* Dylan */}
          <div className="bg-base-200 p-6 rounded-xl shadow space-y-3">
            <h3 className="text-xl font-semibold">Dylan Toriello</h3>
            <div className="flex gap-4 mt-2">
              <a
                href="https://github.com/Dylan-Toriello"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5 hover:text-primary transition" />
              </a>
              <a
                href="https://www.linkedin.com/in/dylan-toriello1/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5 hover:text-primary transition" />
              </a>
              <a
                href="https://dylan-toriello.github.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="w-5 h-5 hover:text-primary transition" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
