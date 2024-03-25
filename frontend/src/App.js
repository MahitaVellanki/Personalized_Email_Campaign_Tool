import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/Home/home";
import UplaodScreen from "./Components/UploadScreen/uploadScreen";

import EditorScreen from "./Components/Editor/editorScreen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/uploadScreen",
    element: <UplaodScreen />,
  },

  {
    path: "/editorScreen",
    element: <EditorScreen />,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
