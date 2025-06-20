import { LinkUploader } from "../components/LinkUploader";

export const Home = () => {
  return (
    <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4">
      <h2 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 text-shadow-s mb-10">
        LearnAlong
      </h2>
      <LinkUploader />
    </main>
  );
};
