
package com.weddingvendor.backend;

/**
 * Service class to store vendor service details
 */
public class Service {
    private String id;
    private String name;
    private String category;
    private String description;
    private double price;
    private String duration;
    
    public Service() {}
    
    public Service(String id, String name, String category, String description, double price, String duration) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.price = price;
        this.duration = duration;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
}
