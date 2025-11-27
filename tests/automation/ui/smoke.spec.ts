
// Type definitions for test runner globals to resolve TS errors
declare const describe: (name: string, callback: () => void) => void;
declare const test: (name: string, callback: () => void | Promise<void>) => void;
declare const expect: (actual: any) => any;

import { HotelFormValues, OptimizationGoal, HotelCategory, AgentTone } from '../../../shared/types';
import { validateHotelForm } from '../../../shared/validation';

describe('UI Validation Logic (Error Handling)', () => {
    const baseValues: HotelFormValues = {
        goal: OptimizationGoal.REVENUE_OPTIMIZATION,
        hotelName: "Test Hotel",
        location: "Test City",
        category: HotelCategory.LUXURY,
        currentAdr: 200,
        currentRevPar: 150,
        currentOccupancy: 75,
        numberOfRooms: 100,
        agentTone: AgentTone.ANALYTICAL
    };

    test('Positive Scenario: Accepts valid inputs', () => {
        const errors = validateHotelForm(baseValues);
        expect(Object.keys(errors).length).toBe(0);
    });

    test('Negative Scenario: Rejects negative ADR', () => {
        const errors = validateHotelForm({ ...baseValues, currentAdr: -10 });
        expect(errors.currentAdr).toBeDefined();
    });

    test('Negative Scenario: Rejects RevPAR > ADR (Logical Impossibility)', () => {
        // RevPAR = ADR * Occupancy. Since Occ <= 100%, RevPAR cannot be > ADR.
        const errors = validateHotelForm({ ...baseValues, currentAdr: 100, currentRevPar: 120 });
        expect(errors.currentRevPar).toBeDefined();
    });

    test('Negative Scenario: Rejects Occupancy out of range', () => {
        const errorsHigh = validateHotelForm({ ...baseValues, currentOccupancy: 105 });
        expect(errorsHigh.currentOccupancy).toBeDefined();

        const errorsLow = validateHotelForm({ ...baseValues, currentOccupancy: -5 });
        expect(errorsLow.currentOccupancy).toBeDefined();
    });

    test('Negative Scenario: Rejects decimal Room counts', () => {
        const errors = validateHotelForm({ ...baseValues, numberOfRooms: 100.5 });
        expect(errors.numberOfRooms).toBeDefined();
    });

    test('Negative Scenario: Rejects empty strings', () => {
        const errors = validateHotelForm({ ...baseValues, hotelName: "   ", location: "" });
        expect(errors.hotelName).toBeDefined();
        expect(errors.location).toBeDefined();
    });
});
