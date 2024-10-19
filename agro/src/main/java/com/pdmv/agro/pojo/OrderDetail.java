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
@Table(name = "order_detail", indexes = {
        @Index(name = "order_id", columnList = "order_id"),
        @Index(name = "product_id", columnList = "product_id"),
        @Index(name = "price_id", columnList = "price_id")
})
@Builder
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraph(
        name = "OrderDetail.details",
        attributeNodes = {
                @NamedAttributeNode("product"),
                @NamedAttributeNode("price"),
        }
)
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "price_id", nullable = false)
    private Price price;

    @NotNull
    @Column(name = "quantity", nullable = false, precision = 10, scale = 2)
    private BigDecimal quantity;

    @NotNull
    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @ColumnDefault("(`quantity` * `unit_price`)")
    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

}