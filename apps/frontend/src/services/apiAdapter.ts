import { HotelFormValues, AgentResult } from "../../../../shared/types";
// In a real deployment, this would use fetch() to call the Backend API Gateway.
// For this environment, we bridge directly to the backend logic.
import { runRoaAgent as backendAgentRun } from "../../../backend/src/agent/geminiAgent";

export const runRoaAgent = async (
  formData: HotelFormValues, 
  onStatusUpdate: (status: string) => void
): Promise<AgentResult> => {
  return await backendAgentRun(formData, onStatusUpdate);
};