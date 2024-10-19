package com.pdmv.agro.pojo;

import com.pdmv.agro.enums.PaymentMethod;
import com.pdmv.agro.enums.PaymentStatus;
import com.pdmv.agro.validator.EnumConstraint;
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
@Table(name = "payment", indexes = {
        @Index(name = "supplier_id", columnList = "supplier_id"),
        @Index(name = "staff_id", columnList = "staff_id")
})
@Builder
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraph(
        name = "Payment.details",
        attributeNodes = {
                @NamedAttributeNode("supplier"),
                @NamedAttributeNode("staff"),
        }
)
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "staff_id", nullable = false)
    private UserInfo staff;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Size(max = 20)
    @ColumnDefault("'cash'")
    @Column(name = "payment_method", length = 20)
    @EnumConstraint(enumClass = PaymentMethod.class, message = "INVALID_PAYMENT_METHOD")
    private String paymentMethod;

    @Size(max = 20)
    @Column(name = "status", nullable = false, length = 20)
    @EnumConstraint(enumClass = PaymentStatus.class, message = "INVALID_PAYMENT_STATUS")
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