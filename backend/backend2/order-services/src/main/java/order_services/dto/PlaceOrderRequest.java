package order_services.dto;

import lombok.Data;
import order_services.models.Address;

@Data
public class PlaceOrderRequest {
    private Address address;
    private String paymentMethod;
//    private String productID;
}
