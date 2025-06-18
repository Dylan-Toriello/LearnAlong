export const About = () => {
  return (
    <div>
      {/* About us Section*/}
      <div className="hero bg-base-200  flex min-h-screen justify-center items-center pb-50 px-4 text-center ">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold mb-6">About The Project</h1>
          <p className="py-4 text-lg">
            This app transforms YouTube videos into interactive quizzes, making
            learning more engaging and effective.
          </p>
          <p className="py-4 text-lg">
            By turning video content into questions and challenges, it helps
            users test their knowledge and retain information better.
          </p>
          <p className="py-4 text-lg">
            Whether you’re a student, educator, or lifelong learner, this tool
            makes it easy to learn actively from your favorite videos.
          </p>
          <button className="btn btn-primary">Contact Us</button>
        </div>
      </div>
    </div>
  );
};
