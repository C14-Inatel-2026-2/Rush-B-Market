package com.rushbmarket.api.mapper;

import com.rushbmarket.api.model.dto.request.AddSkinRequestDTO;
import com.rushbmarket.api.model.dto.response.SkinResponseDTO;
import com.rushbmarket.api.model.entity.Skin;

public class SkinMapper {

    public static Skin toEntity(AddSkinRequestDTO dto) {
        return Skin.builder()
                .name(dto.getName())
                .float_value(dto.getFloatValue())
                .price(dto.getPrice())
                .rarity(dto.getRarity())
                .weapon(dto.getWeapon())
                .build();
    }

    public static SkinResponseDTO toResponseDTO(Skin skin) {
        return SkinResponseDTO.builder()
                .id(skin.getId())
                .name(skin.getName())
                .floatValue(skin.getFloat_value())
                .price(skin.getPrice())
                .rarity(skin.getRarity())
                .weapon(skin.getWeapon())
                .playerId(skin.getPlayer() != null ? skin.getPlayer().getId() : null)
                .build();
    }
}
