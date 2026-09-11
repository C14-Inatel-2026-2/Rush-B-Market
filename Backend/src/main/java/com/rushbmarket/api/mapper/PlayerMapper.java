package com.rushbmarket.api.mapper;

import com.rushbmarket.api.model.dto.request.CreatePlayerRequestDTO;
import com.rushbmarket.api.model.dto.response.PlayerResponseDTO;
import com.rushbmarket.api.model.dto.response.PlayerWithSkinsResponseDTO;
import com.rushbmarket.api.model.entity.Player;

import java.util.stream.Collectors;

public class PlayerMapper {

    public static Player toEntity(CreatePlayerRequestDTO dto) {
        return Player.builder()
                .email(dto.getEmail())
                .password(dto.getPassword())
                .build();
    }

    public static PlayerResponseDTO toResponseDTO(Player player) {
        return PlayerResponseDTO.builder()
                .id(player.getId())
                .email(player.getEmail())
                .createdAt(player.getCreatedAt())
                .build();
    }

    public static PlayerWithSkinsResponseDTO toWithSkinsResponseDTO(Player player) {
        return PlayerWithSkinsResponseDTO.builder()
                .id(player.getId())
                .email(player.getEmail())
                .createdAt(player.getCreatedAt())
                .skins(player.getSkins().stream()
                        .map(SkinMapper::toResponseDTO)
                        .collect(Collectors.toList()))
                .build();
    }
}
