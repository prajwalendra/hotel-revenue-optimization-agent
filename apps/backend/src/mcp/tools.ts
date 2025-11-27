
import { HotelOperatingData, MarketDemandData } from '../../../../shared/types';
import { fetchStrTrendReport } from '../mocks/strGlobalMock';
import { fetchPredictHqEvents } from '../mocks/predictHqMock';

/**
 * Tool 1: internal_data_client
 * Gateway to: Property Management System (PMS) + STR Global (Benchmarking)
 * 
 * In a Bedrock Agent architecture, this would be the Lambda function that 
 * orchestrates calls to the PMS and the Market Intelligence API (STR).
 */
export const get_hotel_operating_data = async (
  hotel_name: string,
  location: string,
  days_in_past: number = 30
): Promise<HotelOperatingData> => {
  console.log(`[MCP Gateway] internal_data_client invoked for ${hotel_name}...`);
  
  // Call the STR Global Mock Server
  // In production, this would be an HTTP GET to api.str.com/v2.1/data
  const strData = await fetchStrTrendReport(hotel_name, location, 'Luxury'); // Defaulting category for mock
  
  // Synthesize PMS data (Internal) with STR data (External Benchmark)
  // We use the STR mock's "my_property" as the source of truth for "Actuals" to ensure consistency
  
  return {
    last_30_days: {
      adr: strData.kpis.my_property.adr,
      revpar: strData.kpis.my_property.revpar,
      occupancy: strData.kpis.my_property.occupancy,
      bookings_mtd: Math.floor(strData.kpis.my_property.occupancy * 450 * 30), // Derived
      cancellation_rate: 0.04
    },
    room_inventory: {
      total_rooms: 450,
      available_by_type: { 
        "standard": 200, 
        "suite": 50,
        "deluxe": 150,
        "penthouse": 5
      },
      forecasted_demand: strData.kpis.comp_set.occupancy // Using Comp Set occ as proxy for market demand
    }
  };
};

/**
 * Tool 2: external_market_client
 * Gateway to: PredictHQ (Events & Demand Intelligence)
 * 
 * In a Bedrock Agent architecture, this would be the Lambda function that
 * queries the PredictHQ API to find demand anomalies.
 */
export const get_market_demand_drivers = async (
  location: string,
  date_range_days: number = 90,
  category: string
): Promise<MarketDemandData> => {
  console.log(`[MCP Gateway] external_market_client invoked for ${location}...`);

  // Call the PredictHQ Mock Server
  // In production, this would be an HTTP GET to api.predicthq.com/v1/events
  const phqData = await fetchPredictHqEvents(location);
  
  // Also fetch Comp Set data again (lightweight) to fulfill the return type requirement
  // In a real app, we might cache the STR response from the previous tool call
  const strData = await fetchStrTrendReport("MarketQuery", location, category);

  // Transform PredictHQ response to our internal MarketDemandData schema
  const transformedEvents = phqData.results.map(evt => ({
    name: evt.title,
    dates: `${evt.start} to ${evt.end}`,
    attendee_count_estimate: evt.phq_attendance,
    distance_from_hotel_km: 2.5 // Mock distance logic
  }));

  // Determine Impact Score based on total attendance in the window
  const totalAttendance = transformedEvents.reduce((sum, evt) => sum + evt.attendee_count_estimate, 0);
  const impactScore = totalAttendance > 50000 ? "HIGH" : totalAttendance > 10000 ? "MEDIUM" : "LOW";

  return {
    demand_impact_score: impactScore,
    events_upcoming: transformedEvents,
    competitive_set_metrics_simulated: {
      adr_average: strData.kpis.comp_set.adr,
      revpar_average: strData.kpis.comp_set.revpar
    }
  };
};
