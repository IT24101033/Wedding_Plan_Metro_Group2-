
package backend.servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/home")
public class HomeServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Features data that would be displayed on the home page
        String[] features = {
            "Find Your Perfect Match: Browse hundreds of wedding vendors filtered by your preferences and budget",
            "Book Services Online: Schedule appointments, make reservations, and secure the best vendors in minutes",
            "Vendor Collaboration: Connect directly with your vendors through our messaging platform",
            "Secure Payments: Make deposits and payments safely through our protected payment system"
        };
        
        request.setAttribute("features", features);
        request.setAttribute("pageTitle", "Your Perfect Wedding Journey Begins Here");
        request.setAttribute("pageDescription", "Find and book the best wedding vendors to create memories that will last a lifetime");
        
        // Forward to the JSP that would render the home page
        request.getRequestDispatcher("/WEB-INF/views/home.jsp").forward(request, response);
    }
}
