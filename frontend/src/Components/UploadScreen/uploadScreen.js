import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../UI/navbar";
import { MdOutlineUploadFile } from "react-icons/md";

export default function UplaodScreen() {
  const [errorMessage, setErrorMessage] = useState("");
  let navigate = useNavigate();

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file && file.type === "application/json") {
      setErrorMessage("");
      const reader = new FileReader();
      reader.onload = function (e) {
        const jsonData = JSON.parse(reader.result);
        localStorage.setItem("jsonData", JSON.stringify(jsonData));
        navigate("/editorScreen", { state: { jsonData } });
      };
      reader.readAsText(file); // Start reading the file
    } else {
      setErrorMessage("Please select a valid .json file.");
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col h-auto bg-opaqueBlue mt-2 mx-2 p-4">
        <div>
          <p className="text-3xl text-bold italic">Upload a JSON file.</p>
          <br />
          <p className="text-center font-sans italic">
            To generate numerous templates simultaneously, simply upload a JSON
            file containing the parameters required for customization in each
            template.
          </p>
          <br />
          <p>Following is a sample json file format:</p>

          <div className="container mx-auto ">
            <div
              className="h-auto w-full md:w-2xl mx-auto bg-grayLight p-4 text-left overflow-auto"
              style={{ wordWrap: "break-word" }}
            >
              <p className="text-left">Sample.json</p>
              <pre>
                {`
[
  {
    "name": "John Doe",
    "contract": "Software Development",
    "terms_conditions": "These are the terms and conditions...",
    "sender_name": "Jane Doe"
  },
  {
    "name": "Jane Smith",
    "contract": "Consulting Agreement",
    "terms_conditions": "Herein are the consulting agreement terms...",
    "sender_name": "John Smith"
  }
]
`}
              </pre>
            </div>
          </div>
        </div>
        <br />

        <div className="flex flex-row justify-center items-center">
          <label className=" flex flex-row w-30 py-2 px-4 shadow-lg bg-blue hover:bg-darkBlue rounded-lg cursor-pointer text-white">
            Upload
            <MdOutlineUploadFile className="mx-2 mt-1" />
            <input
              id="upload"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
        {errorMessage && <span className="text-red  py-2">{errorMessage}</span>}
      </div>
    </div>
  );
}
