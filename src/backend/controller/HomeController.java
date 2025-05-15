
package backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller //Spring MVC katha karanne kalla
public class HomeController {
    
    @GetMapping("/home") //This annotation binds HTTP GET requests made to the /home URL to this method.
    public String home(Model model) {
        // Features data that would be displayed on the home page
        String[] features = {
            "Find Your Perfect Match: Browse hundreds of wedding vendors filtered by your preferences and budget",
            "Book Services Online: Schedule appointments, make reservations, and secure the best vendors in minutes",
            "Vendor Collaboration: Connect directly with your vendors through our messaging platform",
            "Secure Payments: Make deposits and payments safely through our protected payment system"
        };
        
        model.addAttribute("features", features);
        model.addAttribute("pageTitle", "Your Perfect Wedding Journey Begins Here");
        model.addAttribute("pageDescription", "Find and book the best wedding vendors to create memories that will last a lifetime");
        
        return "home";
    }
}

//This code is for a Spring MVC Controller that handles requests to the home page of your wedding vendor website.