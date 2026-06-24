package order_services.services;

import lombok.RequiredArgsConstructor;
import order_services.dto.CartResponseDTO;
import order_services.models.*;
import order_services.repository.OrdersRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderServices {
    private final OrdersRepository ordersRepository;
    private final WebClient.Builder webClientBuilder;

    private WebClient getWebClient() {
        return webClientBuilder.baseUrl("http://localhost:5000").build();
    }

    public Orders placeOrder(String userId, Address address, String paymentMethodStr, String token) {
        // 1. Fetch user's cart from Node.js Express Backend via WebClient
        CartResponseDTO cart = getWebClient().get()
                .uri("/api/v1/cart/all")
                .header("Cookie", "token=" + token)
                .retrieve()
                .bodyToMono(CartResponseDTO.class)
                .block();

        if (cart == null || cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cannot place order. Your shopping cart is empty!");
        }
        System.out.println(cart.getItems().toString());

        // 2. Build the Orders and OrderItems objects
        Orders order = new Orders();
        order.setUserId(userId);
        order.setAddress(address);
        
        // Parse Payment Method
        PaymentMethod paymentMethod;
        try {
            paymentMethod = PaymentMethod.valueOf(paymentMethodStr.toUpperCase());
        } catch (Exception e) {
            paymentMethod = PaymentMethod.UPI;
        }
        order.setPaymentMethod(paymentMethod);

        // COD is pending, UPI/CARD can be COMPLETED as mock success
        if (paymentMethod == PaymentMethod.COD) {
            order.setPaymentStatus(PaymentStatus.PENDING);
        } else {
            order.setPaymentStatus(PaymentStatus.COMPLETED);
        }
        
        // Generate Mock Transaction ID
        order.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 18).toUpperCase());

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartResponseDTO.CartItemDTO item : cart.getItems()) {
            if (item.getProduct() == null) continue;

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(item.getProduct().get_id());
            orderItem.setProductName(item.getProduct().getName());
            
            // Extract the first image URL if present
            String imgUrl = "";
            if (item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()) {
                imgUrl = item.getProduct().getImages().get(0).getUrl();
            }
            orderItem.setProductImage(imgUrl);
            
            orderItem.setQuantity(item.getQuantity());
            
            Double discountedPrice = item.getProduct().getDiscountedPrice();
            long itemPrice = discountedPrice != null ? discountedPrice.longValue() : 0L;
            orderItem.setPrice(itemPrice);
            orderItem.setOrder(order);
            
            orderItems.add(orderItem);

            BigDecimal itemCost = BigDecimal.valueOf(discountedPrice != null ? discountedPrice : 0.0)
                    .multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(itemCost);
        }

        order.setList(orderItems);
        order.setTotalPrice(total);

        // Validation constraint: Orders minimum price is 100.00
        if (total.compareTo(new BigDecimal("100.00")) < 0) {
            throw new IllegalArgumentException("Total order amount must be at least ₹100.00");
        }

        // 3. Save order into Postgres database
        Orders savedOrder = ordersRepository.save(order);

        // 4. Update product quantity (decrease stock) in Node.js backend
        for (OrderItem item : savedOrder.getList()) {
            try {
                Map<String, Object> body = Map.of(
                        "productId", item.getProductId(),
                        "quantity", item.getQuantity()
                );
                
                getWebClient().post()
                        .uri("/api/v1/products/buy")
                        .bodyValue(body)
                        .retrieve()
                        .toBodilessEntity()
                        .block();
            } catch (Exception e) {
                System.err.println("Warning: Failed to decrease quantity for product ID " 
                        + item.getProductId() + ": " + e.getMessage());
            }
        }

        // 5. Clear the user's cart in the Node.js backend
        try {
            getWebClient().put()
                    .uri("/api/v1/cart/clear")
                    .header("Cookie", "token=" + token)
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        } catch (Exception e) {
            System.err.println("Warning: Failed to clear user cart in Node.js: " + e.getMessage());
        }

        return savedOrder;
    }

    public List<Orders> getOrdersByUserId(String userId) {
        return ordersRepository.findByUserId(userId);
    }
}
