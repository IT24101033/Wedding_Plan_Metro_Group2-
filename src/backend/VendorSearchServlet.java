
package com.weddingvendor.backend;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Servlet for advanced vendor search and filtering
 */
@WebServlet("/api/vendors/search")
public class VendorSearchServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final VendorSystem vendorSystem = new VendorSystem();
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    
    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        PrintWriter out = response.getWriter();
        
        try {
            // Extract search parameters
            String query = request.getParameter("query");
            String category = request.getParameter("category");
            String location = request.getParameter("location");
            String priceRange = request.getParameter("priceRange");
            String sortBy = request.getParameter("sortBy");
            String minRatingStr = request.getParameter("minRating");
            
            System.out.println("Search parameters - query: " + query + 
                              ", category: " + category + 
                              ", location: " + location + 
                              ", priceRange: " + priceRange + 
                              ", sortBy: " + sortBy +
                              ", minRating: " + minRatingStr);
            
            // Get all vendors as base list
            List<Vendor> results = vendorSystem.getAllVendors();
            
            // Apply filters
            results = applyFilters(results, query, category, location, priceRange, minRatingStr);
            
            // Apply sorting
            results = applySorting(results, sortBy);
            
            System.out.println("Found " + results.size() + " vendors after filtering");
            
            // Return results
            out.print(gson.toJson(results));
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error searching vendors: " + e.getMessage())));
            e.printStackTrace();
        }
        
        out.flush();
    }
    
    /**
     * Apply all filters to the vendor list
     */
    private List<Vendor> applyFilters(List<Vendor> vendors, String query, String category, 
                                     String location, String priceRange, String minRatingStr) {
        List<Vendor> filtered = new ArrayList<>(vendors);
        
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
        
        // Filter by location
        if (location != null && !location.isEmpty() && !location.equalsIgnoreCase("all")) {
            filtered = filtered.stream()
                .filter(v -> v.getLocation() != null && v.getLocation().contains(location))
                .collect(Collectors.toList());
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
                
                return vendors.stream()
                    .filter(v -> (v.getMinPrice() >= minPrice && v.getMinPrice() <= maxPrice) ||
                             (v.getMaxPrice() >= minPrice && v.getMaxPrice() <= maxPrice))
                    .collect(Collectors.toList());
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
                    vendors.sort((a, b) -> Double.compare(a.getMinPrice(), b.getMinPrice()));
                    break;
                case "priceDesc":
                    vendors.sort((a, b) -> Double.compare(b.getMinPrice(), a.getMinPrice()));
                    break;
                case "rating":
                    vendors.sort((a, b) -> Double.compare(b.getRating(), a.getRating()));
                    break;
                case "reviewCount":
                    vendors.sort((a, b) -> Integer.compare(b.getReviewCount(), a.getReviewCount()));
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
    class ErrorResponse {
        private String error;
        
        public ErrorResponse(String error) {
            this.error = error;
        }
    }
}
