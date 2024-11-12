export interface Hotel {
    id: number;
    name: string;
    location: string;
    rating: number;
    price: number;
    image: string;
    amenities: string[];
    reviewScore?: number;
    reviewCount?: number;
    stars?: number;
    address?: string;
    latitude?: number;
    longitude?: number;
    url?: string;
  }
  
  export interface SearchParams {
    location: string;
    checkIn: string;
    checkOut: string;
    roomType: string;
    guests?: number;
  }
  
  export interface HotelResponse {
    result: Hotel[];
    total: number;
    error?: string;
  }
  
  export interface LocationResponse {
    dest_id: string;
    name: string;
    type: string;
    city_name?: string;
    country_name?: string;
  }