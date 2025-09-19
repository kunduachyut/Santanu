import React from "react";

const Footer = () => {
  return <footer className="w-full bg-white py-0">
      <div className="section-container">
        <p className="text-center text-gray-600 text-sm">
          This Website is made by{" "}
          <a href="https://github.com/kunduachyut/" target="_blank" rel="noopener noreferrer" className="text-pulse-500 hover:underline">
            Achyut
          </a>{" "}
          a Fullstack Developer, also me a UI/UX designer & Fullstack Developer {" "}
          <a href="https://portfolio-anirbans-projects-ac4662ed.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-pulse-500 hover:underline">
            Anirban
          </a>
        </p>
      </div>
    </footer>;
};

export default Footer;