package com.pdmv.agro.pojo;

import com.pdmv.agro.enums.OrderStatus;
import com.pdmv.agro.enums.PaymentMethod;
import com.pdmv.agro.validator.EnumConstraint;
import com.pdmv.agro.validator.PhoneNumberConstraint;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "`order`", indexes = {
        @Index(name = "customer_id", columnList = "customer_id"),
        @Index(name = "staff_id", columnList = "staff_id")
})
@Builder
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraph(
        name = "Order.details",
        attributeNodes = {
                @NamedAttributeNode("customer"),
                @NamedAttributeNode("staff"),
        }
)
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private UserInfo customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "staff_id", nullable = false)
    private UserInfo staff;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @ColumnDefault("0.00")
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount;

    @ColumnDefault("(`total_amount` - `discount_amount`)")
    @Column(name = "net_amount", precision = 10, scale = 2)
    private BigDecimal netAmount;

    @Lob
    @Column(name = "shipping_address")
    private String shippingAddress;

    @Size(max = 20)
    @Column(name = "shipping_phone", length = 20)
    @PhoneNumberConstraint
    private String shippingPhone;

    @Size(max = 20)
    @ColumnDefault("'cash'")
    @Column(name = "payment_method", length = 20)
    @EnumConstraint(enumClass = PaymentMethod.class, message = "INVALID_PAYMENT_METHOD")
    private String paymentMethod;

    @Size(max = 20)
    @NotNull
    @Column(name = "status", nullable = false, length = 20)
    @EnumConstraint(enumClass = OrderStatus.class, message = "INVALID_ORDER_STATUS")
    private String status;

    @Lob
    @Column(name = "note")
    private String note;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ColumnDefault("1")
    @Column(name = "active")
    private Boolean active;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        active = true;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}