import React from "react";
import ImageUpload from "./_components/ImageUpload";

function Dashboard() {
  return (
    <div className="xl:px-20">
      <h1 className="text-3xl font-bold">Convert Wireframe to Code</h1>
      <ImageUpload />
    </div>
  );
}

export default Dashboard;
