import React from "react";
import Column from "../../components/Column";

const BoardPage: React.FC = () => {
  const columns = [
    {
      title: "To Do",
      cards: [
        { id: 1, title: "Setup project" },
        { id: 2, title: "Design UI" },
      ],
    },
    {
      title: "In Progress",
      cards: [
        { id: 3, title: "Develop login page" },
        { id: 4, title: "Connect API" },
      ],
    },
    {
      title: "Done",
      cards: [
        { id: 5, title: "Project setup completed" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-indigo-800 to-blue-900 p-6 flex gap-4 overflow-x-auto">
      {columns.map((col, idx) => (
        <Column key={idx} title={col.title} cards={col.cards} />
      ))}
    </div>
  );
};

export default BoardPage;
