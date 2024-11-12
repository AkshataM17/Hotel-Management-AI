import { NextResponse } from 'next/server';
import { searchHotels, getHotelDetails } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  try {
    let response;
    
    // If hotelId is provided, get hotel details
    const hotelId = searchParams.get('hotelId');
    if (hotelId) {
      response = await getHotelDetails(hotelId);
    } else {
      // Otherwise, search hotels
      response = await searchHotels({
        location: searchParams.get('location') || '',
        checkIn: searchParams.get('checkIn') || '',
        checkOut: searchParams.get('checkOut') || '',
        roomType: searchParams.get('roomType') || 'single',
        guests: Number(searchParams.get('guests')) || 2
      });
    }
    
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch hotels' },
      { status: 500 }
    );
  }
}