import { Route } from "react-router-dom";
import { Routes, BrowserRouter } from "react-router-dom";
import { useAppSelector } from "../redux";
import PrivateRoutes from "./privateRoutes";
import { Home } from "../features/Home";
import { Login } from "../features/Login";

const AppRoutes = () => {
	const userStore = useAppSelector((v) => v.user);

	return (
		<BrowserRouter>
			{userStore.user === null ? (
				<Routes>
					<Route path="*" element={<Login />}></Route>
				</Routes>
			) : (
				<PrivateRoutes />
			)}
		</BrowserRouter>
	);
};

export default AppRoutes;
