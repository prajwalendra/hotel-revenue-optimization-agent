
import { GoogleGenAI, FunctionDeclaration, Type, Tool, Part } from "@google/genai";
import { HotelFormValues, AgentResult, HotelOperatingData, MarketDemandData, AgentTone, OptimizationGoal } from "../../../../shared/types";
import { get_hotel_operating_data, get_market_demand_drivers } from "../mcp/tools";
import { buildSystemInstruction } from "../config/agentConfig";

// Define the function declarations for the model
const toolDeclarations: FunctionDeclaration[] = [
  {
    name: "get_hotel_operating_data",
    description: "Retrieve fundamental, internal hotel operating data including ADR, RevPAR, Occupancy (0.0 to 1.0 scale), and Inventory.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        hotel_name: { type: Type.STRING, description: "The name of the hotel" },
        location: { type: Type.STRING, description: "The city and state of the hotel" },
        days_in_past: { type: Type.INTEGER, description: "Number of days in the past to retrieve data for (default 30)" }
      },
      required: ["hotel_name", "location"]
    }
  },
  {
    name: "get_market_demand_drivers",
    description: "Identify macro and local demand drivers (events, conferences, holidays) and competitive set metrics.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        location: { type: Type.STRING, description: "The city and state" },
        date_range_days: { type: Type.INTEGER, description: "Forward looking window in days (default 90)" },
        category: { type: Type.STRING, description: "Hotel category (e.g., Luxury, Midscale)" }
      },
      required: ["location", "category"]
    }
  }
];

const tools: Tool[] = [{ functionDeclarations: toolDeclarations }];

export const runRoaAgent = async (
  formData: HotelFormValues, 
  onStatusUpdate: (status: string) => void
): Promise<AgentResult> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Using gemini-3-pro-preview for advanced reasoning capabilities
  const modelId = 'gemini-3-pro-preview'; 

  // Generate system instruction from config using user's selected tone
  const systemInstruction = buildSystemInstruction(formData.goal, formData.agentTone || AgentTone.ANALYTICAL);

  const chat = ai.chats.create({
    model: modelId,
    config: {
      tools: tools,
      systemInstruction: systemInstruction,
      temperature: 0.2, // Low temperature for analytical precision
    }
  });

  // Inject specific requirements based on the goal
  let specificRequirements = "";
  if (formData.goal === OptimizationGoal.OCCUPANCY_FORECASTING) {
    specificRequirements = `
    SPECIFIC REQUIREMENT: Your output MUST include a 7-Day and 30-Day Forecast Table.
    This table MUST include a calculated "Confidence Interval" column (e.g., ±5%) for each time horizon, based on the volatility of the STR data and upcoming events.
    `;
  }

  const userPrompt = `
  Perform a ${formData.goal} for the following property:
  
  Hotel: ${formData.hotelName}
  Location: ${formData.location}
  Category: ${formData.category}
  Current Metrics (User Provided):
  - ADR: $${formData.currentAdr}
  - RevPAR: $${formData.currentRevPar}
  - Occupancy: ${formData.currentOccupancy}%
  - Total Rooms: ${formData.numberOfRooms}
  
  ${specificRequirements}

  Execute the necessary tools to validate this data and check market conditions, then provide your final output.
  `;

  onStatusUpdate("Initializing Agent...");

  // Send initial message
  let result = await chat.sendMessage({ message: userPrompt });
  
  // Track the data we fetched to return it for UI visualization
  let capturedOperatingData: HotelOperatingData | null = null;
  let capturedMarketData: MarketDemandData | null = null;

  const MAX_TURNS = 5;
  let turnCount = 0;

  while (turnCount < MAX_TURNS) {
    const candidate = result.candidates?.[0];
    const functionCalls = candidate?.content?.parts?.filter(part => part.functionCall)?.map(part => part.functionCall);

    if (functionCalls && functionCalls.length > 0) {
        onStatusUpdate(`Agent is consulting external data sources...`);
        
        const functionResponses: Part[] = [];

        for (const call of functionCalls) {
            if (!call || !call.name) continue;

            console.log("Executing Tool:", call.name);
            let toolResult: any;

            // Safe argument access
            const args = (call.args as any) || {};

            if (call.name === 'get_hotel_operating_data') {
                const hName = args.hotel_name || formData.hotelName;
                const hLoc = args.location || formData.location;
                
                toolResult = get_hotel_operating_data(hName, hLoc, args.days_in_past);
                capturedOperatingData = toolResult;
                onStatusUpdate(`Retrieved internal data for ${hName}...`);
            } else if (call.name === 'get_market_demand_drivers') {
                const hLoc = args.location || formData.location;
                const hCat = args.category || formData.category;

                toolResult = get_market_demand_drivers(hLoc, args.date_range_days, hCat);
                capturedMarketData = toolResult;
                onStatusUpdate(`Identified market drivers in ${hLoc}...`);
            }

            functionResponses.push({
                functionResponse: {
                    id: call.id,
                    name: call.name,
                    response: { result: toolResult }
                }
            });
        }

        onStatusUpdate("Synthesizing strategies...");
        result = await chat.sendMessage({ message: functionResponses });
    } else {
        break;
    }
    turnCount++;
  }

  const finalAnalysis = result.text || "Analysis generation failed.";

  return {
    analysis: finalAnalysis,
    operatingData: capturedOperatingData,
    marketData: capturedMarketData
  };
};