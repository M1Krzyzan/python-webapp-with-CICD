let config = { backendUrl: "http://localhost:8002" }; // Default value

export const loadConfig = async () => {
  try {
    const response = await fetch("/config.json");
    const json = await response.json();
    config = json; // Store the config globally
  } catch (error) {
    console.error("Failed to load config.json, using defaults", error);
  }
};

export const getBackendUrl = () => config.backendUrl;