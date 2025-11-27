
export enum HotelCategory {
  LUXURY = 'Luxury',
  MIDSCALE = 'Midscale',
  ECONOMY = 'Economy'
}

export enum OptimizationGoal {
  REVENUE_OPTIMIZATION = 'Revenue Optimization Recommendation & Action Plan',
  OCCUPANCY_FORECASTING = 'Occupancy Forecasting (7-Day & 30-Day)',
  METRIC_ANALYSIS = 'Occupancy Rate & Metric Analysis'
}

export enum AgentTone {
  ANALYTICAL = 'Analytical & Precise',
  URGENT = 'Urgent & Action-Oriented',
  EDUCATIONAL = 'Consultative & Educational'
}

export interface HotelFormValues {
  goal: OptimizationGoal;
  
  /** 
   * The name of the property. 
   * Validation: Must be a non-empty string. 
   */
  hotelName: string;
  
  /** 
   * The city and state (e.g., "New York, NY"). 
   * Validation: Must be a non-empty string. 
   */
  location: string;
  
  category: HotelCategory;
  
  /** 
   * Average Daily Rate. 
   * Validation: Must be a strictly positive number (> 0). 
   */
  currentAdr: number;
  
  /** 
   * Revenue Per Available Room. 
   * Validation: Must be a strictly positive number (> 0) and logically should not exceed ADR. 
   */
  currentRevPar: number;
  
  /** 
   * Occupancy Percentage. 
   * Validation: Must be between 0 and 100 inclusive. 
   */
  currentOccupancy: number;
  
  /** 
   * Total Room Inventory. 
   * Validation: Must be a strictly positive integer (> 0). 
   */
  numberOfRooms: number;

  /**
   * The desired persona/tone for the agent's output.
   * Defaults to ANALYTICAL if not specified.
   */
  agentTone?: AgentTone;
}

// Data structures for Tool Responses
export interface HotelOperatingData {
  last_30_days: {
    adr: number;
    revpar: number;
    occupancy: number;
    bookings_mtd: number;
    cancellation_rate: number;
  };
  room_inventory: {
    total_rooms: number;
    available_by_type: { [key: string]: number };
    forecasted_demand: number;
  };
}

export interface MarketEvent {
  name: string;
  dates: string;
  attendee_count_estimate: number;
  distance_from_hotel_km: number;
}

export interface MarketDemandData {
  demand_impact_score: 'HIGH' | 'MEDIUM' | 'LOW';
  events_upcoming: MarketEvent[];
  competitive_set_metrics_simulated: {
    adr_average: number;
    revpar_average: number;
  };
}

export interface AgentResult {
  analysis: string;
  operatingData: HotelOperatingData | null;
  marketData: MarketDemandData | null;
}
