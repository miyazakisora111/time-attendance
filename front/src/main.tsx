
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
    import { BrowserRouter } from "react-router-dom"; // ← 追加✨
    import "./shared/styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  