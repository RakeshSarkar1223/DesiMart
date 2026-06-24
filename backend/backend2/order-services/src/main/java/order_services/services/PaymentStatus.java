package order_services.services;
public enum PaymentStatus {
    PENDING,
    FAILED,
    COMPLETED;

    @com.fasterxml.jackson.annotation.JsonValue
    public String toValue(){
        return this.name().toLowerCase();
    }
}