import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux";
import AppRoutes from "./router";

function App() {
	return (
		<>
			<Provider store={store}>
				<AppRoutes />
			</Provider>
		</>
	);
}

export default App;
