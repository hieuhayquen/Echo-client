import React, { Fragment } from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./global.css";

let persistor = persistStore(store);

createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<BrowserRouter>
					<Fragment>
					<App />
					<ToastContainer
						position="bottom-center"
						autoClose={2000}
						hideProgressBar={true}
						closeButton={false}
						theme="colored"
						icon={false}
					/>
					</Fragment>
				</BrowserRouter>
			</PersistGate>
		</Provider>
	</React.StrictMode>
);

