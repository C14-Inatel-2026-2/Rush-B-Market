package com.rushbmarket.api.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "skins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false, length = 255)
    private String name;

    @NotBlank(message = "Float is required")
    @Column(nullable = false, length = 50)
    private String float_value;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @Column(nullable = false)
    private Double price;

    @NotBlank(message = "Rarity is required")
    @Column(nullable = false, length = 100)
    private String rarity;

    @NotBlank(message = "Weapon is required")
    @Column(nullable = false, length = 100)
    private String weapon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id")
    @JsonIgnore
    private Player player;
}
