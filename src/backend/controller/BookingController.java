
package backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import backend.model.Booking;
import backend.service.BookingService;

@RestController
@RequestMapping("/api/vendor/bookings")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> allBookings = bookingService.getAllBookings();
        return ResponseEntity.ok(allBookings);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable String userId) {
        List<Booking> userBookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(userBookings);
    }
    
    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingById(@PathVariable String bookingId) {
        Booking booking = bookingService.getBookingById(bookingId);
        if (booking != null) {
            return ResponseEntity.ok(booking);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("Booking not found: " + bookingId));
        }// ekko 200 OK eketa nathnam 404 eket yanna Get booking by ID
    }
    
    @GetMapping("/vendor/{vendorId}") // get vendor bookings
    public ResponseEntity<List<Booking>> getVendorBookings(@PathVariable String vendorId) {
        // Normalize vendor ID format if needed
        if (!vendorId.startsWith("vendor")) {
            vendorId = "vendor" + vendorId;
        }
        List<Booking> vendorBookings = bookingService.getVendorBookings(vendorId);
        return ResponseEntity.ok(vendorBookings);
    }
    
    @PostMapping // aluth book ekke hadanna
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        // Normalize vendor ID format
        if (!booking.getVendorId().startsWith("vendor")) {
            booking.setVendorId("vendor" + booking.getVendorId());
        }
        
        String bookingId = bookingService.createBooking(booking); // aluth bookign ekek booking  service eke hadanwa
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new SuccessResponse("Booking created successfully", bookingId));
    }
    
    @PutMapping("/{bookingId}") //updat the booking
    public ResponseEntity<?> updateBooking( //This maps PUT requests for updating an existing booking identified by its bookingId.
            @PathVariable String bookingId,
            @RequestBody Booking updates) { //The bookingId is extracted from the URL, and the updated booking data is passed in the request body.


        boolean updated = bookingService.updateBooking(bookingId, updates);
        if (updated) {
            return ResponseEntity.ok(new SuccessResponse("Booking updated successfully", bookingId));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("Booking not found with ID: " + bookingId));
        }
    }
    
    @DeleteMapping("/{bookingId}") // delete Booking
    public ResponseEntity<?> deleteBooking(@PathVariable String bookingId) {
        boolean deleted = bookingService.deleteBooking(bookingId);
        if (deleted) {
            return ResponseEntity.ok(new SuccessResponse("Booking deleted successfully", bookingId));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("Booking not found with ID: " + bookingId));
        }
    }
    
    // Response classes for JSON formatting
    static class SuccessResponse {
        private String message;
        private String id;
        
        public SuccessResponse(String message, String id) {
            this.message = message;
            this.id = id;
        }
        
        public String getMessage() {
            return message;
        }
        
        public String getId() {
            return id;
        }
    }
    
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


//This program is a Spring Boot RESTful API controller that manages bookings for a vendor in an online system.
