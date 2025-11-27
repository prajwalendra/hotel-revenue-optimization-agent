
import { HotelFormValues } from './types';

export const validateHotelForm = (values: HotelFormValues): Partial<Record<keyof HotelFormValues, string>> => {
  const errors: Partial<Record<keyof HotelFormValues, string>> = {};

  if (!values.hotelName.trim()) {
    errors.hotelName = 'Hotel Name is required.';
  }

  if (!values.location.trim()) {
    errors.location = 'Location is required.';
  }

  if (isNaN(values.currentAdr) || values.currentAdr <= 0) {
    errors.currentAdr = 'ADR must be a positive number greater than 0.';
  }

  if (isNaN(values.currentRevPar) || values.currentRevPar <= 0) {
    errors.currentRevPar = 'RevPAR must be a positive number greater than 0.';
  } else if (values.currentRevPar > values.currentAdr) {
    errors.currentRevPar = 'RevPAR cannot exceed the Average Daily Rate (ADR).';
  }

  if (isNaN(values.currentOccupancy) || values.currentOccupancy < 0 || values.currentOccupancy > 100) {
    errors.currentOccupancy = 'Occupancy must be between 0 and 100.';
  }

  if (isNaN(values.numberOfRooms) || values.numberOfRooms <= 0 || !Number.isInteger(values.numberOfRooms)) {
    errors.numberOfRooms = 'Number of Rooms must be a positive integer.';
  }

  return errors;
};
