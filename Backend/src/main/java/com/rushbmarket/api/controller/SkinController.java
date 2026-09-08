package com.rushbmarket.api.controller;

import com.rushbmarket.api.model.dto.request.AddSkinRequestDTO;
import com.rushbmarket.api.model.dto.response.SkinResponseDTO;
import com.rushbmarket.api.service.SkinService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skins")
@RequiredArgsConstructor
@Tag(name = "Skins", description = "Skin management endpoints")
public class SkinController {

    private final SkinService skinService;

    @PostMapping("/player/{playerId}")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add a skin to a player (validates business rules)")
    public SkinResponseDTO addSkinToPlayer(
            @PathVariable Long playerId,
            @RequestBody @Valid AddSkinRequestDTO request
    ) {
        return skinService.addSkinToPlayer(playerId, request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get all skins")
    public List<SkinResponseDTO> getAllSkins() {
        return skinService.getAllSkins();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get skin by ID")
    public SkinResponseDTO getSkinById(@PathVariable Long id) {
        return skinService.getSkinById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a skin")
    public void deleteSkin(@PathVariable Long id) {
        skinService.deleteSkin(id);
    }
}
