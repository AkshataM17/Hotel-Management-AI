import axios from 'axios';

export interface HotelSearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests?: number;
}

// Initialize axios instance for RapidAPI
const rapidApiClient = axios.create({
  baseURL: 'https://booking-com.p.rapidapi.com/v1',
  headers: {
    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_API_KEY,
    'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
  }
});

export const searchLocations = async (query: string) => {
  try {
    const response = await rapidApiClient.get('/hotels/locations', {
      params: {
        name: query,
        locale: 'en-us'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
};

export const searchHotels = async (params: HotelSearchParams) => {
  try {
    // First, get the destination ID
    const locations = await searchLocations(params.location);
    const destinationId = locations[0]?.dest_id;

    if (!destinationId) {
      throw new Error('Location not found');
    }

    // Search for hotels
    const response = await rapidApiClient.get('/hotels/search', {
      params: {
        dest_id: destinationId,
        checkin_date: params.checkIn,
        checkout_date: params.checkOut,
        room_number: params.roomType === 'single' ? 1 : 2,
        adults_number: params.guests || 2,
        units: 'metric',
        order_by: 'popularity',
        locale: 'en-us',
        currency: 'USD'
      }
    });

    // Transform the API response to match our interface
    return response.data.result.map((hotel: any) => ({
      id: hotel.hotel_id,
      name: hotel.hotel_name,
      location: hotel.address,
      rating: hotel.review_score || 0,
      price: hotel.min_total_price,
      image: hotel.max_photo_url,
      amenities: parseAmenities(hotel.facilities),
      reviewScore: hotel.review_score,
      reviewCount: hotel.review_nr,
      stars: hotel.class,
      address: hotel.address,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      url: hotel.url,
    }));

  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error;
  }
};

export const getHotelDetails = async (hotelId: string) => {
  try {
    const response = await rapidApiClient.get(`/hotels/details`, {
      params: {
        hotel_id: hotelId,
        locale: 'en-us'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching hotel details:', error);
    throw error;
  }
};

function parseAmenities(facilities: any[]): string[] {
  const amenityMap: { [key: string]: string } = {
    'wifi': 'wifi',
    'parking': 'parking',
    'breakfast': 'breakfast',
    'pool': 'pool',
    'spa': 'spa',
    'fitness': 'gym',
    'restaurant': 'restaurant',
    'room_service': 'roomService',
    'bar': 'bar',
    'air_conditioning': 'ac'
  };

  return facilities
    .map(facility => amenityMap[facility.facility_name.toLowerCase()])
    .filter(Boolean);
}