package com.rushbmarket.api.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkinResponseDTO {

    private Long id;
    private String name;
    private String floatValue;
    private Double price;
    private String rarity;
    private String weapon;
    private Long playerId;
}
