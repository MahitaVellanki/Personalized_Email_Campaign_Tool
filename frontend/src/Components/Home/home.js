import React from "react";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../UI/navbar";

export default function Home() {
  let navigate = useNavigate();
  return (
    <div>
      <Navbar />

      <div className="flex justify-center bg-opaqueBlue items-center p-16 m-2 bg-blue-opaque">
        <img src="assets/docupilotLogo.png" className="max-w-full max-h-full" />
      </div>
      <div className="h-auto">
        <div>
          <h1 className="text-3xl py-2 font-mono font-extrabold">
            Personalized Email Campaign Tool
          </h1>
          <div
            className="mx-10 mt-4"
            // style={{ "@media (max-width: 768px)": { margin: "0 2px" } }}
          >
            <p className="text-xl text-center">
              Explore this intuitive tool for creating personalized email
              templates effortlessly in just three simple steps:
            </p>
            <br />
            <p className="text-center italic my-2">
              <u>
                <strong>STEP-1</strong>
              </u>
              <br />
              Upload your JSON file containing the parameters to customize
              individual recipient details.
            </p>
            <img
              src="assets/Step-1.png"
              className="mx-auto max-w-full m-2 border-1 shadow-lg rounded-lg"
            ></img>
            <br />
            <p className="text-center italic my-2">
              <u>
                <strong> STEP-2</strong>
              </u>
              <br />
              Customize your template to align with your preferences and needs,
              with the option to review each template individually.
            </p>
            <img
              src="assets/Step-2.png"
              className="mx-auto max-w-full m-2 border-1 shadow-lg rounded-lg"
            ></img>
            <br />
            <p className="text-center italic my-2">
              <u>
                <strong> STEP-3</strong>
              </u>{" "}
              <br />
              Generate your customized templates with ease.
            </p>
            <img
              src="assets/Step-3.png"
              className="mx-auto max-w-full m-2 border-1 shadow-lg rounded-lg"
            ></img>
            <br />
            <div className="flex flex-row justify-center items-center">
              <button
                className="flex flex-row w-30 mt-2 py-2 px-4 shadow-lg bg-blue hover:bg-darkBlue rounded-lg cursor-pointer text-white"
                onClick={() => {
                  navigate("/uploadScreen");
                }}
              >
                <span>Get Started</span>
                <FaPlay className="mx-2 mt-1" />
              </button>
            </div>
            <br />

            <p className="my-2 font-serif text-xl italic">
              "Experience the convenience of bulk email template creation
              tailored to your requirements, all in one user-friendly platform."
            </p>
            <br />
          </div>
        </div>
        <div className="bg-blue h-10 mx-2 "></div>
      </div>
    </div>
  );
}
