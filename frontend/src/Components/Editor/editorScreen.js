import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createTemplate } from "./createTemplate";

import { MdOutlineUploadFile } from "react-icons/md";
import { GrNext, GrPrevious } from "react-icons/gr";

import Navbar from "../UI/navbar";

export default function EditorScreen() {
  const [editorContent, setEditorContent] = useState(
    localStorage.getItem("editorContent") || ""
  );
  const [error, setError] = useState("");
  const [originalFormat, setOriginalFormat] = useState();
  const [currentDataIndex, setCurrentDataIndex] = useState(0);

  const [jsonData, setJsonData] = useState(
    JSON.parse(localStorage.getItem("jsonData")) || []
  );
  const [currentEmailContent, setCurrentEmailContent] = useState("");
  const [saveChanges, setSaveChanges] = useState(false);
  const [upload, setUpload] = useState(false);
  const [message, setMessage] = useState("");
  const [enableNext, setEnableNext] = useState(false);
  const [enablePrev, setEnablePrev] = useState(false);
  const errorTimeoutRef = useRef(null);
  useEffect(() => {
    localStorage.setItem("editorContent", editorContent);
  }, [editorContent]);

  useEffect(() => {
    if (currentDataIndex === 0) {
      setEnablePrev(false);
    } else {
      setEnablePrev(true);
    }

    if (currentDataIndex === jsonData.length - 1) {
      setEnableNext(false);
    } else {
      setEnableNext(true);
    }
  }, [currentDataIndex, jsonData]);

  useEffect(() => {
    if (error) {
      errorTimeoutRef.current = setTimeout(() => {
        setError("");
      }, 10000);
    }
    return () => {
      clearTimeout(errorTimeoutRef.current);
    };
  }, [error]);

  const handleEditorChange = (newContent) => {
    setEditorContent(newContent);
    setSaveChanges(false);
  };

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    let fileName = "";
    if (file && file.type === "application/json") {
      setError("");
      console.log(file.name);
      fileName = file.name;
      const reader = new FileReader();
      reader.onload = function (e) {
        setJsonData(JSON.parse(reader.result));
        localStorage.setItem("jsonData", JSON.stringify(jsonData));
        setUpload(true);
        setMessage(`"${fileName}" is uploaded`);
      };

      reader.readAsText(file);
    } else {
      setError("Please select a valid .json file.");
      setUpload(false);
      setMessage("");
    }
  }

  const handleDownloadTemplate = () => {
    const htmlContent = createTemplate(currentEmailContent);
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "docupilot_email_template.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerateTemplates = (originalFormat, data) => {
    console.log(originalFormat);
    const keys = Object.keys(data);
    let updatedContent = originalFormat;
    keys.forEach((key) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      updatedContent = updatedContent.replace(regex, data[key]);
    });
    console.log(updatedContent);
    setCurrentEmailContent(updatedContent);
  };

  const handleNext = () => {
    if (currentDataIndex >= 0 && /{{[^{}]+}}/.test(editorContent)) {
      setEnableNext(true);
      const nextIndex =
        currentDataIndex < jsonData.length - 1
          ? currentDataIndex + 1
          : currentDataIndex;

      handleGenerateTemplates(originalFormat, jsonData[nextIndex]);
      setCurrentDataIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (currentDataIndex > 0 && /{{[^{}]+}}/.test(editorContent)) {
      const prevIndex =
        currentDataIndex > 0 ? currentDataIndex - 1 : currentDataIndex;
      handleGenerateTemplates(originalFormat, jsonData[prevIndex]);
      setCurrentDataIndex(prevIndex);
      setEnablePrev(true);
    }
  };

  const handleGenerate = (editorContent) => {
    const hasPlaceholders = /{{[^{}]+}}/.test(editorContent);
    if (!hasPlaceholders) {
      setError("Content does not contain any placeholders.");
      return;
    }

    if (jsonData.length > 0) {
      const dataIndex = currentDataIndex >= 0 ? currentDataIndex : 0;
      const data = jsonData[dataIndex];
      try {
        if (data) {
          handleGenerateTemplates(originalFormat, data);
          setEnableNext(true);
        } else {
          setError("No data provided to generate templates.");
        }
      } catch {
        setError("JSON file not uploaded.");
      }
    }
  };

  const handleSaveChanges = (editorContent) => {
    setOriginalFormat(editorContent);
    console.log(jsonData);
    if (jsonData !== null && jsonData.length > 0) {
      setSaveChanges(true);
    }
  };

  return (
    <div>
      <Navbar />

      <div className=" bg-opaqueBlue m-2 p-2">
        <h1 className="text-xl font-sans font-semibold italic ">
          Email Template Editor
        </h1>
        <div>
          <div className="container mx-auto ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-28 m-4">
              <div className="relative md:w-[calc(50% - 2rem)] lg:w-[calc(50% - 4rem)]] h-96 border-0 shadow-lg bg-white">
                <div className="mb-10">
                  <ReactQuill
                    className="w-full h-72"
                    value={editorContent}
                    onChange={handleEditorChange}
                  />
                </div>
                <button
                  onClick={() => handleGenerate(editorContent)}
                  className={`absolute bottom-0 right-0 m-2 w-25 ${
                    saveChanges
                      ? "bg-green hover:bg-darkGreen"
                      : "bg-gray cursor-not-allowed"
                  } text-white py-2 px-4 rounded-full text-center text-sm`}
                >
                  Generate
                </button>
                <button
                  onClick={() => handleSaveChanges(editorContent)}
                  className="absolute bottom-0 left-0 flex flex-row m-2 w-25 bg-orange hover:bg-darkOrange text-white py-2 px-4 rounded-full text-sm"
                >
                  Save Changes
                </button>

                <div className="mt-32">
                  <div className="flex flex-row justify-center items-center">
                    <span className="text-darkBlue m-2 italic ">{message}</span>
                    <label className=" flex flex-row w-30 py-2 px-4 shadow-lg bg-blue hover:bg-darkBlue rounded-lg cursor-pointer text-white">
                      {upload ? "Change File" : "Upload JSON File"}
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
                  {error && (
                    <span className="mt-2 text-red font-semibold italic">
                      {error}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full h-96 border-1 shadow-lg p-2 bg-white">
                <div
                  className="text-left text-sm text-wrap h-96 overflow-scroll break-word"
                  dangerouslySetInnerHTML={{ __html: currentEmailContent }}
                />
                <div className="flex flex-end justify-center items-center gap-10 m-4">
                  <button
                    onClick={handlePrevious}
                    className={`flex flex-row w-20 m-2 justify-center items-center text-white font-bold rounded-lg ${
                      enablePrev
                        ? "bg-gray-dark"
                        : " bg-gray cursor-not-allowed"
                    }`}
                  >
                    Prev
                    <GrPrevious className="ml-2 size-4 " />
                  </button>
                  <button
                    onClick={handleNext}
                    className={`flex flex-row w-20 m-2 justify-center items-center text-white font-bold rounded-lg ${
                      enableNext
                        ? "bg-gray-dark"
                        : " bg-gray cursor-not-allowed"
                    }`}
                  >
                    Next
                    <GrNext className="ml-2 size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center m-2">
            <button
              onClick={handleDownloadTemplate}
              className="block mt-20 w-25 bg-blue  hover:bg-darkBlue text-white py-2 px-4 rounded-full text-center text-sm"
            >
              Download Email Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
