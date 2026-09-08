package com.rushbmarket.api.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddSkinRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Float is required")
    private String floatValue;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    @NotBlank(message = "Rarity is required")
    private String rarity;

    @NotBlank(message = "Weapon is required")
    private String weapon;
}
