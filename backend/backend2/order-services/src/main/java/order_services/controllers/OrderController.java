package order_services.controllers;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import order_services.dto.PlaceOrderRequest;
import order_services.dto.ResponceDTO;
import order_services.models.Orders;
import order_services.services.OrderServices;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class OrderController {

    private final OrderServices orderServices;

    @PostMapping("/place")
    public ResponseEntity<ResponceDTO> placeOrder(
            HttpServletRequest request,
            @RequestBody PlaceOrderRequest placeOrderRequest) {

        String userId = (String) request.getAttribute("id");
        String token = extractTokenFromRequest(request);

        if (userId == null || token == null) {
            return ResponseEntity.status(401).body(
                    new ResponceDTO(false, "Unauthorized: User session not found or invalid", null)
            );
        }

        try {
            Orders order = orderServices.placeOrder(
                    userId,
                    placeOrderRequest.getAddress(),
                    placeOrderRequest.getPaymentMethod(),
//                    placeOrderRequest.getProductID(),
                    token
            );
            return ResponseEntity.ok(new ResponceDTO(true, "Order placed successfully!", order));
        } catch (Exception e) {
            System.err.println("=== ORDER PLACEMENT ERROR ===");
            e.printStackTrace();
            
            // Extract the root cause
            Throwable cause = e;
            while (cause.getCause() != null) {
                cause = cause.getCause();
            }
            System.err.println("ROOT CAUSE: " + cause.getClass().getName() + ": " + cause.getMessage());
            System.err.println("=============================");
            
            return ResponseEntity.badRequest().body(
                    new ResponceDTO(false, "Order failed: " + cause.getMessage(), null)
            );
        }
    }

    @GetMapping
    public ResponseEntity<ResponceDTO> getUserOrders(HttpServletRequest request) {
        String userId = (String) request.getAttribute("id");
        if (userId == null) {
            return ResponseEntity.status(401).body(
                    new ResponceDTO(false, "Unauthorized: Please log in first", null)
            );
        }

        try {
            List<Orders> orders = orderServices.getOrdersByUserId(userId);
            return ResponseEntity.ok(new ResponceDTO(true, "Fetched orders successfully", orders));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ResponceDTO(false, e.getMessage(), null));
        }
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
