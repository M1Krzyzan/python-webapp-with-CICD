import axios from "axios";
import {BACKEND_URL} from "../../../src/App";

const api = axios.create({
  baseURL: BACKEND_URL.toString()
});

export default api;
