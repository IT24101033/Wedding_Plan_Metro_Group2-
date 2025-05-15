
package backend.servlet;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import backend.model.PaymentBreakdown;

@WebServlet("/payment-calculator")
public class PaymentCalculatorServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Display the payment calculator form
        request.getRequestDispatcher("/WEB-INF/views/payment-calculator.jsp").forward(request, response);
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        try {
            // Parse form parameters
            BigDecimal baseAmount = new BigDecimal(request.getParameter("baseAmount"));
            String discountCode = request.getParameter("discountCode");
            boolean applyTax = "true".equalsIgnoreCase(request.getParameter("applyTax"));
            
            // Calculate payment breakdown
            PaymentBreakdown breakdown = calculatePayment(baseAmount, discountCode, applyTax);
            
            // Add the breakdown to the request
            request.setAttribute("breakdown", breakdown);
            request.setAttribute("calculationComplete", true);
            
            // Forward back to the form to display results
            request.getRequestDispatcher("/WEB-INF/views/payment-calculator.jsp").forward(request, response);
        } catch (Exception e) {
            request.setAttribute("error", "Failed to calculate payment: " + e.getMessage());
            request.getRequestDispatcher("/WEB-INF/views/payment-calculator.jsp").forward(request, response);
        }
    }
    
    private PaymentBreakdown calculatePayment(BigDecimal baseAmount, String discountCode, boolean applyTax) {
        // Apply discount if code is provided
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (discountCode != null && !discountCode.isEmpty()) {
            // Simple discount logic - different codes give different discounts
            if ("WEDDING10".equals(discountCode)) {
                discountAmount = baseAmount.multiply(new BigDecimal("0.10"));
            } else if ("WEDDING20".equals(discountCode)) {
                discountAmount = baseAmount.multiply(new BigDecimal("0.20"));
            } else if ("WELCOME".equals(discountCode)) {
                discountAmount = baseAmount.multiply(new BigDecimal("0.05"));
            }
        }
        
        // Calculate subtotal after discount
        BigDecimal subtotal = baseAmount.subtract(discountAmount);
        
        // Calculate platform fee (5%)
        BigDecimal platformFee = subtotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);
        
        // Calculate tax if applicable (8%)
        BigDecimal taxAmount = BigDecimal.ZERO;
        if (applyTax) {
            taxAmount = subtotal.multiply(new BigDecimal("0.08")).setScale(2, RoundingMode.HALF_UP);
        }
        
        // Calculate total
        BigDecimal totalAmount = subtotal.add(platformFee).add(taxAmount);
        
        // Create and return the payment breakdown
        PaymentBreakdown breakdown = new PaymentBreakdown();
        breakdown.setBaseAmount(baseAmount);
        breakdown.setDiscountAmount(discountAmount);
        breakdown.setSubtotal(subtotal);
        breakdown.setPlatformFee(platformFee);
        breakdown.setTaxAmount(taxAmount);
        breakdown.setTotalAmount(totalAmount);
        
        return breakdown;
    }
}
