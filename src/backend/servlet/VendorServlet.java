
package backend.servlet;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import backend.model.Vendor;

@WebServlet("/vendors")
public class VendorServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // In a real application, these would come from a database
        List<Vendor> vendors = getMockVendors();
        request.setAttribute("vendors", vendors);
        
        // Forward to the JSP that would render the vendors page
        request.getRequestDispatcher("/WEB-INF/views/vendors.jsp").forward(request, response);
    }
    
    private List<Vendor> getMockVendors() {
        List<Vendor> vendors = new ArrayList<>();
        
        Vendor vendor1 = new Vendor();
        vendor1.setId("v1");
        vendor1.setName("Elegant Events");
        vendor1.setCategory("Event Planner");
        vendor1.setRating(4.8);
        vendor1.setDescription("Full-service wedding planning with personalized attention to every detail.");
        vendor1.setPrice("$$$");
        vendors.add(vendor1);
        
        Vendor vendor2 = new Vendor();
        vendor2.setId("v2");
        vendor2.setName("Divine Photography");
        vendor2.setCategory("Photographer");
        vendor2.setRating(4.9);
        vendor2.setDescription("Capturing your special moments with artistry and passion.");
        vendor2.setPrice("$$");
        vendors.add(vendor2);
        
        Vendor vendor3 = new Vendor();
        vendor3.setId("v3");
        vendor3.setName("Floral Dreams");
        vendor3.setCategory("Florist");
        vendor3.setRating(4.7);
        vendor3.setDescription("Beautiful floral arrangements customized for your wedding theme.");
        vendor3.setPrice("$$");
        vendors.add(vendor3);
        
        return vendors;
    }
}
