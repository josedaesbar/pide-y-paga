import { Route } from "react-router-dom";
import { Routes, BrowserRouter } from "react-router-dom";
import { useAppSelector } from "../redux";
import PrivateRoutes from "./privateRoutes";
import { Home } from "../features/Home";
import { Menu } from "../features/Menu";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/menu/:id" element={<Menu />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
