import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Home } from "../features/Home";

const PrivateRoutes = () => {
	return (
		<Routes>
			<Route index path="/" element={<Home />} />
		</Routes>
	);
};

export default PrivateRoutes;
