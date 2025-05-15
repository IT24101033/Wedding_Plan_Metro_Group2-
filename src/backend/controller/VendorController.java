
package backend.controller;

import java.util.List; //For working with collections of vendors.
import java.util.stream.Collectors; // Used for stream-based operations like filtering and collecting results from a list of vendors.

import org.springframework.beans.factory.annotation.Autowired; // This allows the injection of dependencies
import org.springframework.http.ResponseEntity; //Used to return HTTP responses with data and status codes.
import org.springframework.web.bind.annotation.*; //Imports annotations used for RESTful API functionality

import backend.VendorSystem;
import backend.model.Vendor; //The Vendor class represents a vendor entity with properties like name, category, location, rating, etc.

@RestController
@RequestMapping("/api/vendors")
public class VendorController {
    
    private final VendorSystem vendorSystem = new VendorSystem(); //Vendor System Initialization
    
    @GetMapping("/search") //This handles GET
    public ResponseEntity<?> searchVendors(
            @RequestParam(required = false) String query, //A text search query to match vendor names or descriptions.
            @RequestParam(required = false) String category, // The category of the vendor (e.g., "photographer", "florist")
            @RequestParam(required = false) String location, //The location of the vendor.
            @RequestParam(required = false) String priceRange, //The price range (in the format "min-max").
            @RequestParam(required = false) String sortBy, //Sorting criteria, such as by price or rating
            @RequestParam(required = false) String minRating) { //Minimum rating to filter vendors
        
        try {
            // Get all vendors as base list
            List<Vendor> results = vendorSystem.getAllVendors();
            
            // Apply filters
            results = applyFilters(results, query, category, location, priceRange, minRating);
            
            // Apply sorting
            results = applySorting(results, sortBy);
            
            // Return results
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ErrorResponse("Error searching vendors: " + e.getMessage()));
        }
    }
    
    /**
     * Apply all filters to the vendor list
     */
    private List<Vendor> applyFilters(List<Vendor> vendors, String query, String category, 
                                     String location, String priceRange, String minRatingStr) {
        List<Vendor> filtered = vendors;
        
        // Filter by search query (name or description)
        if (query != null && !query.isEmpty()) {
            String lowercaseQuery = query.toLowerCase();
            filtered = filtered.stream()
                .filter(v -> v.getName().toLowerCase().contains(lowercaseQuery) || 
                         (v.getDescription() != null && v.getDescription().toLowerCase().contains(lowercaseQuery)))
                .collect(Collectors.toList());
        }
        
        // Filter by category
        if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("all")) {
            filtered = filtered.stream()
                .filter(v -> v.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
        }
        
        // Filter by location (note: this might need adjustment since the model may not have a location field)
        if (location != null && !location.isEmpty() && !location.equalsIgnoreCase("all")) {
            // We would need to adjust this if Vendor doesn't have a getLocation method
            // This is just a placeholder for the concept
        }
        
        // Filter by price range
        if (priceRange != null && !priceRange.isEmpty()) {
            filtered = filterByPriceRange(filtered, priceRange);
        }
        
        // Filter by minimum rating
        if (minRatingStr != null && !minRatingStr.isEmpty()) {
            try {
                double minRating = Double.parseDouble(minRatingStr);
                filtered = filtered.stream()
                    .filter(v -> v.getRating() >= minRating)
                    .collect(Collectors.toList());
            } catch (NumberFormatException e) {
                // Ignore invalid rating parameter
            }
        }
        
        return filtered;
    }
    
    /**
     * Filter vendors by price range
     */
    private List<Vendor> filterByPriceRange(List<Vendor> vendors, String priceRange) {
        // Parse price range format: min-max (e.g., "100-500")
        try {
            String[] range = priceRange.split("-");
            if (range.length == 2) {
                int minPrice = Integer.parseInt(range[0]);
                int maxPrice = Integer.parseInt(range[1]);
                
                // We would need to adjust this if Vendor doesn't have getMinPrice and getMaxPrice methods
                // This is just a placeholder for the concept
                return vendors;
            }
        } catch (Exception e) {
            // Ignore invalid price range parameter
        }
        
        return vendors;
    }
    
    /**
     * Apply sorting to the vendor list
     */
    private List<Vendor> applySorting(List<Vendor> vendors, String sortBy) {
        if (sortBy != null) {
            switch (sortBy) {
                case "priceAsc":
                    // We would need to adjust this if Vendor doesn't have getMinPrice method
                    break;
                case "priceDesc":
                    // We would need to adjust this if Vendor doesn't have getMinPrice method
                    break;
                case "rating":
                    vendors.sort((a, b) -> Double.compare(b.getRating(), a.getRating()));
                    break;
                case "reviewCount":
                    // We would need to adjust this if Vendor doesn't have getReviewCount method
                    break;
                default:
                    // Default, no sorting changes
            }
        }
        
        return vendors;
    }
    
    /**
     * Error response class
     */
    static class ErrorResponse {
        private String error;
        
        public ErrorResponse(String error) {
            this.error = error;
        }
        
        public String getError() {
            return error;
        }
    }
}
