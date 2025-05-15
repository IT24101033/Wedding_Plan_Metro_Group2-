
package backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import backend.BookingSystem;
import backend.model.Booking;

@Service
public class BookingService {
    
    private final BookingSystem bookingSystem = new BookingSystem();
    
    public List<Booking> getAllBookings() {
        return bookingSystem.getAllBookings();
    }
    
    public List<Booking> getUserBookings(String userId) {
        return bookingSystem.getUserBookings(userId);
    }
    
    public Booking getBookingById(String bookingId) {
        return bookingSystem.getBookingById(bookingId);
    }
    
    public List<Booking> getVendorBookings(String vendorId) {
        return bookingSystem.getVendorBookings(vendorId);
    }
    
    public String createBooking(Booking booking) {
        return bookingSystem.createBooking(booking);
    }
    
    public boolean updateBooking(String bookingId, Booking updates) {
        return bookingSystem.updateBooking(bookingId, updates);
    }
    
    public boolean deleteBooking(String bookingId) {
        return bookingSystem.deleteBooking(bookingId);
    }
}
