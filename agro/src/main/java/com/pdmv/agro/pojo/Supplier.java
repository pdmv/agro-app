package com.pdmv.agro.pojo;

import com.pdmv.agro.validator.PhoneNumberConstraint;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "supplier")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(min = 1, max = 255, message = "INVALID_SUPPLIER_NAME")
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "address")
    private String address;

    @Size(max = 15)
    @Column(name = "phone_number", length = 15)
    @PhoneNumberConstraint
    private String phoneNumber;

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