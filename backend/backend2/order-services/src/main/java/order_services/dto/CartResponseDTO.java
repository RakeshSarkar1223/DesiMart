package order_services.dto;

import lombok.Data;
import java.util.List;

@Data
public class CartResponseDTO {
    @com.fasterxml.jackson.annotation.JsonProperty("_id")
    private String _id;
    private String user;
    private List<CartItemDTO> items;

    @Data
    public static class CartItemDTO {
        private ProductDTO product;
        private int quantity;
    }

    @Data
    public static class ProductDTO {
        @com.fasterxml.jackson.annotation.JsonProperty("_id")
    private String _id;
        private String name;
        private Double discountedPrice;
        private Integer stock;
        private List<ImageDTO> images;
    }

    @Data
    public static class ImageDTO {
        private String url;
        private String public_id;
    }
}
