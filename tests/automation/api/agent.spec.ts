
// Type definitions for test runner globals to resolve TS errors
declare const describe: (name: string, callback: () => void) => void;
declare const test: (name: string, callback: () => void | Promise<void>) => void;
declare const expect: (actual: any) => any;

import { get_hotel_operating_data, get_market_demand_drivers } from '../../../apps/backend/src/mcp/tools';
import { buildSystemInstruction, ROA_AGENT_CONFIG } from '../../../apps/backend/src/config/agentConfig';
import { AgentTone } from '../../../shared/types';

describe('Backend Logic & MCP Tools', () => {
  
  describe('MCP Tool: get_hotel_operating_data', () => {
    test('returns valid operating data structure', async () => {
      const data = await get_hotel_operating_data('Grand Hyatt', 'Nashville, TN');
      
      expect(data).toBeDefined();
      expect(data.last_30_days).toBeDefined();
      expect(data.room_inventory).toBeDefined();
    });

    test('validates numerical constraints', async () => {
        const data = await get_hotel_operating_data('Test Hotel', 'Test Loc');
        
        // Logical constraints based on mock logic
        expect(data.last_30_days.adr).toBeGreaterThan(0);
        expect(data.last_30_days.occupancy).toBeLessThanOrEqual(1.0); // Decimal format
        expect(data.last_30_days.occupancy).toBeGreaterThanOrEqual(0);
        expect(data.room_inventory.total_rooms).toBeGreaterThan(0);
    });
  });

  describe('MCP Tool: get_market_demand_drivers', () => {
    test('identifies high demand for Nashville context', async () => {
      const data = await get_market_demand_drivers('Nashville, TN', 90, 'Luxury');
      
      expect(data.events_upcoming.length).toBeGreaterThan(0);
      // Based on mock data for Nashville, at least one event should be large
      const hasMajorEvent = data.events_upcoming.some(e => e.attendee_count_estimate > 10000);
      expect(hasMajorEvent).toBe(true);
      expect(data.demand_impact_score).toBe('HIGH');
    });

    test('returns valid impact scores schema', async () => {
        const data = await get_market_demand_drivers('Nowhere City', 90, 'Economy');
        const validScores = ['HIGH', 'MEDIUM', 'LOW'];
        expect(validScores).toContain(data.demand_impact_score);
    });
  });

  describe('Agent Configuration Builder', () => {
      test('buildSystemInstruction includes tone-specific style', () => {
          const instruction = buildSystemInstruction('Optimization', AgentTone.URGENT);
          expect(instruction).toContain(ROA_AGENT_CONFIG.tones[AgentTone.URGENT].style);
          expect(instruction).toContain('CURRENT PERSONA SETTING: Urgent & Action-Oriented');
      });

      test('buildSystemInstruction includes mandatory formatting rules', () => {
          const instruction = buildSystemInstruction('Forecast');
          expect(instruction).toContain('Ensure you include both the opening and closing parentheses');
          expect(instruction).toContain('0-100'); // Occupancy rule
      });
  });
});
