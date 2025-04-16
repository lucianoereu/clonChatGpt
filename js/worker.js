import { MLCEngineHandler, MLCEngine } from "Llama-3.2-1B-Instruct-q4f16_1-MLC";

const engine = new MLCEngine();
const handler = new MLCEngineWorkerHandler(engine);

onmessage = msg => {
    handler.onmessage(msg);
}