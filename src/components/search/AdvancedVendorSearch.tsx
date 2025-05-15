
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchIcon, FilterIcon, ArrowDownAZ, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  image: string;
  minPrice: number;
  maxPrice: number;
  priceDisplay: string;
  location: string;
  description: string;
}

const AdvancedVendorSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Vendor[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  
  const { toast } = useToast();

  // Load initial data and extract filter options
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch('/api/vendors');
        if (!response.ok) {
          throw new Error('Failed to fetch vendor data');
        }
        
        const data: Vendor[] = await response.json();
        
        // Extract unique categories and locations
        const categories = ['all', ...new Set(data.map(vendor => vendor.category))];
        const locations = ['all', ...new Set(data.map(vendor => vendor.location))];
        
        setAvailableCategories(categories);
        setAvailableLocations(locations);
        
        // Find min and max price across all vendors
        const minPrice = Math.min(...data.map(vendor => vendor.minPrice));
        const maxPrice = Math.max(...data.map(vendor => vendor.maxPrice));
        setPriceRange([minPrice, maxPrice]);
        
        // Set initial results
        setSearchResults(data);
        
      } catch (error) {
        console.error('Error fetching initial vendor data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load vendor data. Please try again later.',
          variant: 'destructive',
        });
      }
    };
    
    fetchInitialData();
  }, [toast]);
  
  const handleSearch = async () => {
    setIsLoading(true);
    
    try {
      // Build search parameters
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedLocation && selectedLocation !== 'all') params.append('location', selectedLocation);
      params.append('priceRange', `${priceRange[0]}-${priceRange[1]}`);
      params.append('minRating', minRating.toString());
      if (sortBy) params.append('sortBy', sortBy);
      
      // Make request to the search servlet
      const response = await fetch(`/api/vendors/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const results = await response.json();
      setSearchResults(results);
      
      toast({
        title: 'Search Complete',
        description: `Found ${results.length} vendors matching your criteria`,
      });
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search Failed',
        description: 'An error occurred while searching. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSortBy('rating');
    setMinRating(0);
    
    // Reset price range to original values
    const minPrice = Math.min(...searchResults.map(vendor => vendor.minPrice));
    const maxPrice = Math.max(...searchResults.map(vendor => vendor.maxPrice));
    setPriceRange([minPrice, maxPrice]);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search vendors by name, description or services..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4"
          />
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center mb-4">
            <FilterIcon className="h-4 w-4 mr-2" />
            <h3 className="font-medium">Advanced Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select 
                value={selectedLocation} 
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {availableLocations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location === 'all' ? 'All Locations' : location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="price-range">Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
              </div>
              <Slider
                id="price-range"
                min={0}
                max={15000}
                step={100}
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="min-rating">Minimum Rating: {minRating}</Label>
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
              <Slider
                id="min-rating"
                min={0}
                max={5}
                step={0.5}
                value={[minRating]}
                onValueChange={(value) => setMinRating(value[0])}
                className="py-4"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <ArrowDownAZ className="h-4 w-4 mr-2" />
                <Label htmlFor="sort-by">Sort By</Label>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-by">
                  <SelectValue placeholder="Select sorting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating (High to Low)</SelectItem>
                  <SelectItem value="priceAsc">Price (Low to High)</SelectItem>
                  <SelectItem value="priceDesc">Price (High to Low)</SelectItem>
                  <SelectItem value="reviewCount">Most Reviewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search Vendors'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Search Results Display */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {searchResults.length} vendors found
          </h2>
        </div>
        
        {/* Results would be displayed here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map(vendor => (
            <Card key={vendor.id} className="overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img 
                  src={vendor.image} 
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{vendor.name}</h3>
                <p className="text-sm text-gray-500">{vendor.category} • {vendor.location}</p>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 text-sm">{vendor.rating.toFixed(1)}</span>
                  <span className="ml-1 text-xs text-gray-500">({vendor.reviewCount} reviews)</span>
                </div>
                <p className="mt-2 text-sm font-medium">{vendor.priceDisplay}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedVendorSearch;
