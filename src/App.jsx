import { BrowserRouter } from "react-router-dom";
import Rutas from "./routes/Rutas.jsx";
import AsistenteFlotante from "@/components/chatbot/AsistenteFlotante";

function App() {
  return (
    <BrowserRouter>
      <Rutas />
      <AsistenteFlotante />
    </BrowserRouter>
  );
}

export default App;
