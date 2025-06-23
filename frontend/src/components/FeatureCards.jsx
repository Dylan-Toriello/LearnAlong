import { MessageSquare, ClipboardList, ListVideo } from "lucide-react";

export const FeatureList = () => {
  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 text-primary" />,
      title: "Chat with AI",
      description: "Ask anything about the video and get smart answers.",
    },
    {
      icon: <ClipboardList className="w-6 h-6 text-primary" />,
      title: "Quiz Yourself",
      description: "Take dynamic quizzes to reinforce what you’ve learned.",
    },
    {
      icon: <ListVideo className="w-6 h-6 text-primary" />,
      title: "Learn in Chunks",
      description: "Break videos into smaller, digestible segments.",
    },
  ];

  return (
    <section className="w-full px-6 md:px-12 lg:px-20 pt-10 pb-20">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="p-6 bg-base-200 rounded-xl shadow flex flex-col items-start gap-4 hover:shadow-lg transition"
          >
            <div className="bg-primary/10 p-2 rounded-full">{feature.icon}</div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-base-content">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
