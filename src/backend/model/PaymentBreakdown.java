
package backend.model;

import java.math.BigDecimal;

public class PaymentBreakdown {
    private BigDecimal baseAmount;
    private BigDecimal discountAmount;
    private BigDecimal subtotal;
    private BigDecimal platformFee;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    
    public PaymentBreakdown() {
        // Default constructor
    }
    
    // Getters and setters
    public BigDecimal getBaseAmount() {
        return baseAmount;
    }
    
    public void setBaseAmount(BigDecimal baseAmount) {
        this.baseAmount = baseAmount;
    }
    
    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }
    
    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }
    
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
    
    public BigDecimal getPlatformFee() {
        return platformFee;
    }
    
    public void setPlatformFee(BigDecimal platformFee) {
        this.platformFee = platformFee;
    }
    
    public BigDecimal getTaxAmount() {
        return taxAmount;
    }
    
    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}
