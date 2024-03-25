import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createTemplate } from "./createTemplate";
import { useLocation } from "react-router-dom";
import { MdPreview } from "react-icons/md";
import { GrNext, GrPrevious } from "react-icons/gr";
import Navbar from "../UI/navbar";

export default function EditorScreen() {
  const [content, setContent] = useState(
    localStorage.getItem("editorContent") || ""
  );
  const [error, setError] = useState("");
  const [originalContent, setOriginalContent] = useState();
  const [currentDataIndex, setCurrentDataIndex] = useState(0);

  const location = useLocation();
  const jsonData = location.state?.jsonData;
  const errorTimeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("editorContent", content);
  }, [content]);

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
    setContent(newContent);
  };

  const handleDownloadTemplate = () => {
    const htmlContent = createTemplate(content);
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

  const handleGenerateTemplates = (content, data) => {
    const keys = Object.keys(data);
    let updatedContent = content;
    keys.forEach((key) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      updatedContent = updatedContent.replace(regex, data[key]);
    });
    setContent(updatedContent);
  };

  const handleNext = () => {
    if (currentDataIndex === jsonData.length - 1) {
      setError("JSON list completed.");
      return;
    }
    if (currentDataIndex >= 0 && !/{{[^{}]+}}/.test(content)) {
      const nextIndex =
        currentDataIndex < jsonData.length - 1
          ? currentDataIndex + 1
          : currentDataIndex;
      handleGenerateTemplates(originalContent, jsonData[nextIndex]);
      setCurrentDataIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (currentDataIndex >= 0 && !/{{[^{}]+}}/.test(content)) {
      const prevIndex =
        currentDataIndex > 0 ? currentDataIndex - 1 : currentDataIndex;
      handleGenerateTemplates(originalContent, jsonData[prevIndex]);
      setCurrentDataIndex(prevIndex);
    }
  };

  const handleGenerate = (content) => {
    const hasPlaceholders = /{{[^{}]+}}/.test(content);
    if (!hasPlaceholders) {
      setError("Content does not contain any placeholders.");
      return;
    }

    setOriginalContent(content);

    if (jsonData.length > 0) {
      const dataIndex = currentDataIndex >= 0 ? currentDataIndex : 0;
      const data = jsonData[dataIndex];
      if (data) {
        handleGenerateTemplates(originalContent || content, data);
      } else {
        setError("No data found for the current index.");
      }
    } else {
      setError("No data provided to generate templates.");
    }
  };

  const handlePreview = (content) => {
    const htmlContent = createTemplate(content);
    const file = new Blob([htmlContent], { type: "text/html" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  };

  return (
    <div>
      <Navbar />

      <div className=" bg-opaqueBlue m-2 p-2">
        <h1 className="text-xl font-sans font-semibold italic ">
          {" "}
          Email Template Editor
        </h1>
        <div>
          <div className="container mx-auto ">
            <div className="grid grid-cols-1 lg:grid-cols-2  gap-10 m-4 ">
              <div className="relative w-full h-96 border-0 shadow-lg bg-white">
                <ReactQuill
                  className="border-0 h-72"
                  value={content}
                  onChange={handleEditorChange}
                />
                <button
                  onClick={() => handleGenerate(content)}
                  className="absolute bottom-0 right-0 m-2 w-25 bg-green hover:bg-darkGreen text-white py-2 px-4 rounded-full text-center text-sm"
                >
                  Generate
                </button>
                <button
                  onClick={() => handlePreview(content)}
                  className="absolute bottom-0 left-0 flex flex-row m-2 w-25 bg-blue  hover:bg-darkBlue text-white py-2 px-4 rounded-full text-sm"
                >
                  Preview
                  <MdPreview className="m-1" />
                </button>
              </div>
              <div className="w-full h-96 border-1 shadow-lg p-2 bg-white">
                <div
                  className="text-left text-sm h-96 text-wrap overflow-scroll break-word"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-10">
              <button
                onClick={handlePrevious}
                className="flex flex-row w-20 m-2 justify-center items-center bg-gray-dark hover:bg-gray text-white font-bold rounded-lg"
              >
                Prev
                <GrPrevious className="ml-2 size-4 " />
              </button>
              <button
                onClick={handleNext}
                className="flex flex-row w-20 justify-center items-center bg-gray-dark hover:bg-gray text-white font-bold rounded-lg"
              >
                Next
                <GrNext className="ml-2 size-4" />
              </button>
            </div>
            {error && (
              <span className="mt-2 text-red font-semibold italic">
                {error}
              </span>
            )}
          </div>
          <div className="flex flex-row justify-center items-center m-2">
            <button
              onClick={handleDownloadTemplate}
              className="block mt-4 w-25 bg-blue  hover:bg-darkBlue text-white py-2 px-4 rounded-full text-center text-sm"
            >
              Download Email Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
