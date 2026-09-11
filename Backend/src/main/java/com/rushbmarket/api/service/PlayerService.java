package com.rushbmarket.api.service;

import com.rushbmarket.api.exception.EmailAlreadyExistsException;
import com.rushbmarket.api.exception.PlayerNotFoundException;
import com.rushbmarket.api.mapper.PlayerMapper;
import com.rushbmarket.api.model.dto.request.CreatePlayerRequestDTO;
import com.rushbmarket.api.model.dto.response.PlayerResponseDTO;
import com.rushbmarket.api.model.dto.response.PlayerWithSkinsResponseDTO;
import com.rushbmarket.api.model.entity.Player;
import com.rushbmarket.api.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;

    @Transactional
    public PlayerResponseDTO createPlayer(CreatePlayerRequestDTO request) {
        if (playerRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email '" + request.getEmail() + "' already exists");
        }

        Player player = PlayerMapper.toEntity(request);
        Player savedPlayer = playerRepository.save(player);

        return PlayerMapper.toResponseDTO(savedPlayer);
    }

    @Transactional(readOnly = true)
    public PlayerWithSkinsResponseDTO getPlayerById(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new PlayerNotFoundException("Player with ID " + id + " not found"));

        return PlayerMapper.toWithSkinsResponseDTO(player);
    }

    @Transactional(readOnly = true)
    public List<PlayerResponseDTO> getAllPlayers() {
        return playerRepository.findAll().stream()
                .map(PlayerMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletePlayer(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new PlayerNotFoundException("Player with ID " + id + " not found"));

        playerRepository.delete(player);
    }
}
