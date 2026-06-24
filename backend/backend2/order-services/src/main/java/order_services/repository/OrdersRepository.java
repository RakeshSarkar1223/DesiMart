package order_services.repository;

import order_services.models.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrdersRepository extends JpaRepository<Orders, UUID> {
    java.util.List<Orders> findByUserId(String userId);
}
