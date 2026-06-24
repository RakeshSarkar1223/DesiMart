package order_services.services;

public enum PaymentMethod{
    COD,
    UPI,
    CARD;

    @com.fasterxml.jackson.annotation.JsonValue
    public String toValue(){
        return this.name().toLowerCase();
    }
}
