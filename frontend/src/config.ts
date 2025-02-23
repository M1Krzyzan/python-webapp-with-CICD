interface Config {
  backendUrl: string;
}

export let BACKEND_URL: string = "";

export const loadConfig = async (): Promise<void> => {
  try {
    const response = await fetch("/config.json");
    const data: Config = await response.json();
    BACKEND_URL = data.backendUrl;
    console.log("Loaded BACKEND_URL:", BACKEND_URL);
  } catch (error) {
    console.error("Failed to load config.json", error);
  }
};
