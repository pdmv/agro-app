package com.pdmv.agro.pojo;

import com.pdmv.agro.enums.Gender;
import com.pdmv.agro.validator.DobConstraint;
import com.pdmv.agro.validator.EnumConstraint;
import com.pdmv.agro.validator.PhoneNumberConstraint;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "user_info", indexes = {
        @Index(name = "account_id", columnList = "account_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "email", columnNames = {"email"})
})
@Builder
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraph(name = "UserInfo.account", attributeNodes = @NamedAttributeNode("account"))
public class UserInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(min = 1, max = 255, message = "INVALID_FIRSTNAME")
    @NotNull
    @Column(name = "firstname", nullable = false)
    private String firstname;

    @Size(min = 1, max = 255, message = "INVALID_LASTNAME")
    @NotNull
    @Column(name = "lastname", nullable = false)
    private String lastname;

    @Lob
    @Column(name = "address")
    private String address;

    @Size(max = 15, message = "INVALID_PHONE_NUMBER")
    @Column(name = "phone_number", length = 15)
    @PhoneNumberConstraint
    private String phoneNumber;

    @Size(max = 10)
    @Column(name = "gender", length = 10)
    @EnumConstraint(enumClass = Gender.class, message = "INVALID_GENDER")
    private String gender;

    @Column(name = "dob")
    @DobConstraint(min = 18, message = "INVALID_DOB")
    private LocalDate dob;

    @Size(max = 255)
    @Column(name = "email")
    @Email(message = "INVALID_EMAIL")
    private String email;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

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