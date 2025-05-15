
package backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; //This imports all the necessary annotations for defining RESTful APIs

import java.math.BigDecimal;

import backend.model.PaymentBreakdown;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    
    // Define service fee rates
    private static final double PLATFORM_FEE_PERCENTAGE = 0.05; // 5% platform fee
    private static final double TAX_RATE = 0.08; // 8% tax
    
    @PostMapping("/calculate")
    public ResponseEntity<?> calculatePayment(
            @RequestParam double baseAmount,
            @RequestParam(required = false) String discountCode,
            @RequestParam boolean applyTax) {
        
        try {
            // Calculate breakdown
            PaymentBreakdown breakdown = calculatePaymentBreakdown(baseAmount, discountCode, applyTax);
            
            // Return response
            return ResponseEntity.ok(breakdown);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Error calculating payment: " + e.getMessage()));
        }
    }
    
    /**
     * Calculate payment breakdown with all fees and discounts
     */
    private PaymentBreakdown calculatePaymentBreakdown(double baseAmount, String discountCode, boolean applyTax) {
        PaymentBreakdown breakdown = new PaymentBreakdown();
        
        BigDecimal baseAmountBd = BigDecimal.valueOf(baseAmount);
        breakdown.setBaseAmount(baseAmountBd);
        
        // Apply discount if valid code is provided
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (discountCode != null && !discountCode.isEmpty()) {
            discountAmount = calculateDiscount(baseAmountBd, discountCode);
        }
        breakdown.setDiscountAmount(discountAmount);
        
        // Calculate subtotal after discount
        BigDecimal subtotal = baseAmountBd.subtract(discountAmount);
        breakdown.setSubtotal(subtotal);
        
        // Calculate platform fee
        BigDecimal platformFee = subtotal.multiply(BigDecimal.valueOf(PLATFORM_FEE_PERCENTAGE));
        breakdown.setPlatformFee(platformFee);
        
        // Calculate tax if applicable
        BigDecimal taxAmount = BigDecimal.ZERO;
        if (applyTax) {
            taxAmount = subtotal.multiply(BigDecimal.valueOf(TAX_RATE));
        }
        breakdown.setTaxAmount(taxAmount);
        
        // Calculate total
        BigDecimal totalAmount = subtotal.add(platformFee).add(taxAmount);
        breakdown.setTotalAmount(totalAmount);
        
        return breakdown;
    }
    
    /**
     * Calculate discount based on code
     */
    private BigDecimal calculateDiscount(BigDecimal amount, String code) {
        // Simple discount logic - can be expanded to use a database
        switch (code.toUpperCase()) {
            case "WEDDING10":
                return amount.multiply(BigDecimal.valueOf(0.1)); // 10% off
            case "WEDDING20":
                return amount.multiply(BigDecimal.valueOf(0.2)); // 20% off
            case "WELCOME":
                return BigDecimal.valueOf(50.0); // $50 flat discount
            default:
                return BigDecimal.ZERO; // Invalid code, no discount
        }
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
