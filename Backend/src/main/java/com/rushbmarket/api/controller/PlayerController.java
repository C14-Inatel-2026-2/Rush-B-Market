package com.rushbmarket.api.controller;

import com.rushbmarket.api.model.dto.request.CreatePlayerRequestDTO;
import com.rushbmarket.api.model.dto.response.PlayerResponseDTO;
import com.rushbmarket.api.model.dto.response.PlayerWithSkinsResponseDTO;
import com.rushbmarket.api.service.PlayerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/players")
@RequiredArgsConstructor
@Tag(name = "Players", description = "Player management endpoints")
public class PlayerController {

    private final PlayerService playerService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new player")
    public PlayerResponseDTO createPlayer(@RequestBody @Valid CreatePlayerRequestDTO request) {
        return playerService.createPlayer(request);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get player by ID with their skins")
    public PlayerWithSkinsResponseDTO getPlayerById(@PathVariable Long id) {
        return playerService.getPlayerById(id);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get all players")
    public List<PlayerResponseDTO> getAllPlayers() {
        return playerService.getAllPlayers();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a player")
    public void deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
    }
}
