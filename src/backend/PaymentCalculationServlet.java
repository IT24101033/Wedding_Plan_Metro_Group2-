
package com.weddingvendor.backend;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Servlet to handle payment calculations for the Wedding Vendor system
 */
@WebServlet("/api/payment/calculate")
public class PaymentCalculationServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    
    // Define service fee rates
    private static final double PLATFORM_FEE_PERCENTAGE = 0.05; // 5% platform fee
    private static final double TAX_RATE = 0.08; // 8% tax
    
    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        PrintWriter out = response.getWriter();
        
        try {
            // Parse request parameters
            double baseAmount = Double.parseDouble(request.getParameter("baseAmount"));
            String discountCode = request.getParameter("discountCode");
            boolean applyTax = Boolean.parseBoolean(request.getParameter("applyTax"));
            
            // Calculate breakdown
            PaymentBreakdown breakdown = calculatePaymentBreakdown(baseAmount, discountCode, applyTax);
            
            // Return response
            out.print(gson.toJson(breakdown));
            System.out.println("Payment calculation complete: " + gson.toJson(breakdown));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(new ErrorResponse("Error calculating payment: " + e.getMessage())));
            e.printStackTrace();
        }
        
        out.flush();
    }
    
    /**
     * Calculate payment breakdown with all fees and discounts
     */
    private PaymentBreakdown calculatePaymentBreakdown(double baseAmount, String discountCode, boolean applyTax) {
        PaymentBreakdown breakdown = new PaymentBreakdown();
        breakdown.baseAmount = baseAmount;
        
        // Apply discount if valid code is provided
        double discountAmount = 0.0;
        if (discountCode != null && !discountCode.isEmpty()) {
            discountAmount = calculateDiscount(baseAmount, discountCode);
        }
        breakdown.discountAmount = discountAmount;
        
        // Calculate subtotal after discount
        double subtotal = baseAmount - discountAmount;
        breakdown.subtotal = subtotal;
        
        // Calculate platform fee
        double platformFee = subtotal * PLATFORM_FEE_PERCENTAGE;
        breakdown.platformFee = platformFee;
        
        // Calculate tax if applicable
        double taxAmount = 0.0;
        if (applyTax) {
            taxAmount = subtotal * TAX_RATE;
        }
        breakdown.taxAmount = taxAmount;
        
        // Calculate total
        double totalAmount = subtotal + platformFee + taxAmount;
        breakdown.totalAmount = totalAmount;
        
        return breakdown;
    }
    
    /**
     * Calculate discount based on code
     */
    private double calculateDiscount(double amount, String code) {
        // Simple discount logic - can be expanded to use a database
        switch (code.toUpperCase()) {
            case "WEDDING10":
                return amount * 0.1; // 10% off
            case "WEDDING20":
                return amount * 0.2; // 20% off
            case "WELCOME":
                return 50.0; // $50 flat discount
            default:
                return 0.0; // Invalid code, no discount
        }
    }
    
    /**
     * Payment breakdown class for JSON response
     */
    class PaymentBreakdown {
        double baseAmount;
        double discountAmount;
        double subtotal;
        double platformFee;
        double taxAmount;
        double totalAmount;
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
