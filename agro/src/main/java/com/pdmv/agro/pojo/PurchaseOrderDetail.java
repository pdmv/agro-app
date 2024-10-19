package com.pdmv.agro.pojo;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "purchase_order_detail", indexes = {
        @Index(name = "purchase_order_id", columnList = "purchase_order_id"),
        @Index(name = "product_id", columnList = "product_id")
})
@Builder
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraph(
        name = "PurchaseOrderDetail.details",
        attributeNodes = {
                @NamedAttributeNode("product"),
        }
)
public class PurchaseOrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull
    @Column(name = "quantity", nullable = false, precision = 10, scale = 2)
    private BigDecimal quantity;

    @Column(name = "expected_price", precision = 10, scale = 2)
    private BigDecimal expectedPrice;

    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @ColumnDefault("(`quantity` * `unit_price`)")
    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

}