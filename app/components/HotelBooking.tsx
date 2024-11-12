'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Location {
  dest_id: string;
  name: string;
  city_name?: string;
  country_name: string;
}

export default function HotelBooking() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
    roomType: 'single'
  });
  const [locations, setLocations] = useState<Location[]>([]);
  const [showLocations, setShowLocations] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get tomorrow's date
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  // Initialize dates
  useEffect(() => {
    setSearchData(prev => ({
      ...prev,
      checkIn: today,
      checkOut: tomorrow
    }));
  }, []);

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setLocations([]);
      return;
    }

    try {
      setLoading(true);
      // Using mock data for now
      const mockLocations = [
        {
          dest_id: '1',
          name: `${query} City Center`,
          city_name: query,
          country_name: 'United States'
        },
        {
          dest_id: '2',
          name: `${query} Downtown`,
          city_name: query,
          country_name: 'United Kingdom'
        },
        {
          dest_id: '3',
          name: `${query} Beach Area`,
          city_name: query,
          country_name: 'Spain'
        }
      ];
      setLocations(mockLocations);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchData.location) {
        searchLocations(searchData.location);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchData.location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryString = new URLSearchParams(searchData).toString();
    router.push(`/search-results?${queryString}`);
  };

  const handleLocationSelect = (location: Location) => {
    setSearchData({
      ...searchData,
      location: `${location.city_name || location.name}, ${location.country_name}`
    });
    setShowLocations(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById('search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowLocations(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold">AI Hotel Booking</span>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            Smart Hotel Bookings
          </h1>
          <p className="text-xl mb-8">
            AI-powered hotel search and instant confirmations
          </p>
          
          {/* Search Form */}
          <div className="bg-white text-black p-6 rounded-lg">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative" id="search-container">
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-black"
                  value={searchData.location}
                  onChange={(e) => {
                    setSearchData({...searchData, location: e.target.value});
                    setShowLocations(true);
                  }}
                  onFocus={() => setShowLocations(true)}
                  required
                />
                
                {/* Location Suggestions Dropdown */}
                {showLocations && searchData.location.length >= 2 && (
                  <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg max-h-60 overflow-auto">
                    {loading ? (
                      <div className="p-2 text-gray-500">Loading...</div>
                    ) : locations.length > 0 ? (
                      locations.map((location) => (
                        <div
                          key={location.dest_id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <div className="font-medium">
                            {location.city_name || location.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {location.country_name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">No locations found</div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <input
                  type="date"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-black"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                  min={today}
                  required
                />
              </div>
              
              <div>
                <input
                  type="date"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-black"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                  min={searchData.checkIn || today}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="bg-black text-white p-2 rounded hover:bg-gray-800"
              >
                Search Hotels
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Book With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-2 hover:border-black transition-colors p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">AI-Powered Search</h3>
              <p className="text-gray-600">Smart filtering and personalized recommendations</p>
            </div>
            <div className="border-2 hover:border-black transition-colors p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Best Rates</h3>
              <p className="text-gray-600">Direct integration with hotels for competitive prices</p>
            </div>
            <div className="border-2 hover:border-black transition-colors p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Instant Booking</h3>
              <p className="text-gray-600">Real-time availability and immediate confirmation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}