
import { HotelFormValues, OptimizationGoal, HotelCategory, AgentTone } from '../../../shared/types';

// Replicating the validation logic from InputForm.tsx for unit testing purposes
const validateForm = (values: HotelFormValues): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (values.currentAdr <= 0) errors.currentAdr = "Must be positive";
    if (values.currentRevPar <= 0) errors.currentRevPar = "Must be positive";
    if (values.currentRevPar > values.currentAdr) errors.currentRevPar = "RevPAR cannot exceed ADR";
    if (values.currentOccupancy < 0 || values.currentOccupancy > 100) errors.currentOccupancy = "Must be 0-100";
    if (!Number.isInteger(values.numberOfRooms) || values.numberOfRooms <= 0) errors.numberOfRooms = "Must be positive integer";
    if (!values.hotelName.trim()) errors.hotelName = "Required";
    if (!values.location.trim()) errors.location = "Required";

    return errors;
};

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
        const errors = validateForm(baseValues);
        expect(Object.keys(errors).length).toBe(0);
    });

    test('Negative Scenario: Rejects negative ADR', () => {
        const errors = validateForm({ ...baseValues, currentAdr: -10 });
        expect(errors.currentAdr).toBeDefined();
    });

    test('Negative Scenario: Rejects RevPAR > ADR (Logical Impossibility)', () => {
        // RevPAR = ADR * Occupancy. Since Occ <= 100%, RevPAR cannot be > ADR.
        const errors = validateForm({ ...baseValues, currentAdr: 100, currentRevPar: 120 });
        expect(errors.currentRevPar).toBeDefined();
    });

    test('Negative Scenario: Rejects Occupancy out of range', () => {
        const errorsHigh = validateForm({ ...baseValues, currentOccupancy: 105 });
        expect(errorsHigh.currentOccupancy).toBeDefined();

        const errorsLow = validateForm({ ...baseValues, currentOccupancy: -5 });
        expect(errorsLow.currentOccupancy).toBeDefined();
    });

    test('Negative Scenario: Rejects decimal Room counts', () => {
        const errors = validateForm({ ...baseValues, numberOfRooms: 100.5 });
        expect(errors.numberOfRooms).toBeDefined();
    });

    test('Negative Scenario: Rejects empty strings', () => {
        const errors = validateForm({ ...baseValues, hotelName: "   ", location: "" });
        expect(errors.hotelName).toBeDefined();
        expect(errors.location).toBeDefined();
    });
});
