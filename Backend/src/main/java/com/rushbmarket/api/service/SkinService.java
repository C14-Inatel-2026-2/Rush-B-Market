package com.rushbmarket.api.service;

import com.rushbmarket.api.exception.*;
import com.rushbmarket.api.mapper.SkinMapper;
import com.rushbmarket.api.model.dto.request.AddSkinRequestDTO;
import com.rushbmarket.api.model.dto.response.SkinResponseDTO;
import com.rushbmarket.api.model.entity.Player;
import com.rushbmarket.api.model.entity.Skin;
import com.rushbmarket.api.repository.PlayerRepository;
import com.rushbmarket.api.repository.SkinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkinService {

    private final SkinRepository skinRepository;
    private final PlayerRepository playerRepository;

    private static final int MAX_SKINS_PER_PLAYER = 5;

    @Transactional
    public SkinResponseDTO addSkinToPlayer(Long playerId, AddSkinRequestDTO request) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException("Player with ID " + playerId + " not found"));

        // Regra 1: Player não pode ter mais de 5 skins
        if (player.getSkins().size() >= MAX_SKINS_PER_PLAYER) {
            throw new MaxSkinsLimitExceededException(
                    String.format("Player already has maximum of %d skins", MAX_SKINS_PER_PLAYER)
            );
        }

        // Regra 2: Player não pode ter skin duplicada (mesmo nome)
        boolean hasDuplicateName = player.getSkins().stream()
                .anyMatch(skin -> skin.getName().equalsIgnoreCase(request.getName()));

        if (hasDuplicateName) {
            throw new DuplicateSkinException("Player already has a skin named '" + request.getName() + "'");
        }

        // Regra 3: Player não pode ter mais de uma skin da mesma arma
        boolean hasSameWeapon = player.getSkins().stream()
                .anyMatch(skin -> skin.getWeapon().equalsIgnoreCase(request.getWeapon()));

        if (hasSameWeapon) {
            throw new DuplicateWeaponException("Player already has a skin for weapon '" + request.getWeapon() + "'");
        }

        Skin skin = SkinMapper.toEntity(request);
        player.addSkin(skin);

        playerRepository.save(player);

        return SkinMapper.toResponseDTO(skin);
    }

    @Transactional(readOnly = true)
    public List<SkinResponseDTO> getAllSkins() {
        return skinRepository.findAll().stream()
                .map(SkinMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SkinResponseDTO getSkinById(Long id) {
        Skin skin = skinRepository.findById(id)
                .orElseThrow(() -> new SkinNotFoundException("Skin with ID " + id + " not found"));

        return SkinMapper.toResponseDTO(skin);
    }

    @Transactional
    public void deleteSkin(Long id) {
        Skin skin = skinRepository.findById(id)
                .orElseThrow(() -> new SkinNotFoundException("Skin with ID " + id + " not found"));

        skinRepository.delete(skin);
    }
}
