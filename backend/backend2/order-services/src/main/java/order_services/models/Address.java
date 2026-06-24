package order_services.models;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    private String fullName;

    private String phoneNo;

    private String address;

    private String city;

    private String state;

    private String pinCode;

    private String country = "India";
}