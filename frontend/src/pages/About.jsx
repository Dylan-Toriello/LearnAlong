export const About = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
      <div className="w-full max-w-2xl space-y-6">
        <p className="text-base sm:text-lg md:text-xl leading-relaxed">
          This app transforms YouTube videos into interactive quizzes, making
          learning more engaging and effective.
        </p>
        <p className="text-base sm:text-lg md:text-xl leading-relaxed">
          By turning video content into questions and challenges, it helps
          users test their knowledge and retain information better.
        </p>
        <p className="text-base sm:text-lg md:text-xl leading-relaxed">
          Whether you’re a student, educator, or lifelong learner, this tool
          makes it easy to learn actively from your favorite videos.
        </p>
      </div>
    </div>
  );
};
