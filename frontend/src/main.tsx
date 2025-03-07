import React, {useEffect, useState} from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/app.css";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";
import { QueryClient, QueryClientProvider } from "react-query";
import { PersistGate } from "redux-persist/integration/react";
import {loadConfig} from "./config.ts";

const queryClient = new QueryClient();

const RootComponent = () => {
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  useEffect(() => {
    loadConfig().then(() => setIsConfigLoaded(true));
  }, []);

  if (!isConfigLoaded) {
    return <div>Loading configuration...</div>; // Prevent rendering until config is ready
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

createRoot(document.getElementById("root")!).render(<RootComponent />);