package com.rushbmarket.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rushbmarket.api.exception.EmailAlreadyExistsException;
import com.rushbmarket.api.exception.PlayerNotFoundException;
import com.rushbmarket.api.model.dto.request.CreatePlayerRequestDTO;
import com.rushbmarket.api.model.dto.response.PlayerResponseDTO;
import com.rushbmarket.api.model.dto.response.PlayerWithSkinsResponseDTO;
import com.rushbmarket.api.service.PlayerService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Testes de integração da camada HTTP do PlayerController.
 *
 * @WebMvcTest sobe apenas o slice web (controllers, filters, handlers),
 * sem banco de dados. O PlayerService é mockado com @MockitoBean (Spring Boot 3.4+).
 */
@WebMvcTest(PlayerController.class)
@DisplayName("PlayerController - testes HTTP")
class PlayerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private PlayerService playerService;

    // =====================================================================
    // POST /players
    // =====================================================================

    @Test
    @DisplayName("POST /players → 201 e corpo com id e email quando dados válidos")
    void criarPlayerValido_retorna201() throws Exception {
        CreatePlayerRequestDTO request = CreatePlayerRequestDTO.builder()
                .email("bruno@rushb.com")
                .password("senha123")
                .build();

        PlayerResponseDTO response = PlayerResponseDTO.builder()
                .id(1L)
                .email("bruno@rushb.com")
                .createdAt(LocalDateTime.of(2026, 9, 1, 10, 0))
                .build();

        when(playerService.createPlayer(any(CreatePlayerRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("bruno@rushb.com"));
    }

    @Test
    @DisplayName("POST /players → 409 quando e-mail já cadastrado")
    void criarPlayerEmailDuplicado_retorna409() throws Exception {
        CreatePlayerRequestDTO request = CreatePlayerRequestDTO.builder()
                .email("bruno@rushb.com")
                .password("senha123")
                .build();

        when(playerService.createPlayer(any(CreatePlayerRequestDTO.class)))
                .thenThrow(new EmailAlreadyExistsException("Email 'bruno@rushb.com' already exists"));

        mockMvc.perform(post("/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Email Already Exists"));
    }

    @Test
    @DisplayName("POST /players → 400 quando e-mail inválido (validação de DTO)")
    void criarPlayerEmailInvalido_retorna400() throws Exception {
        CreatePlayerRequestDTO request = CreatePlayerRequestDTO.builder()
                .email("nao-e-um-email")
                .password("senha123")
                .build();

        mockMvc.perform(post("/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors.email").exists());
    }

    @Test
    @DisplayName("POST /players → 400 quando senha tem menos de 6 caracteres (validação de DTO)")
    void criarPlayerSenhaCurta_retorna400() throws Exception {
        CreatePlayerRequestDTO request = CreatePlayerRequestDTO.builder()
                .email("bruno@rushb.com")
                .password("123")
                .build();

        mockMvc.perform(post("/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors.password").exists());
    }

    // =====================================================================
    // GET /players/{id}
    // =====================================================================

    @Test
    @DisplayName("GET /players/{id} → 200 e dados do player quando ID existe")
    void buscarPlayerPorId_retorna200() throws Exception {
        PlayerWithSkinsResponseDTO response = PlayerWithSkinsResponseDTO.builder()
                .id(1L)
                .email("bruno@rushb.com")
                .createdAt(LocalDateTime.of(2026, 9, 1, 10, 0))
                .skins(List.of())
                .build();

        when(playerService.getPlayerById(1L)).thenReturn(response);

        mockMvc.perform(get("/players/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("bruno@rushb.com"))
                .andExpect(jsonPath("$.skins").isArray());
    }

    @Test
    @DisplayName("GET /players/{id} → 404 quando ID não existe")
    void buscarPlayerPorIdInexistente_retorna404() throws Exception {
        when(playerService.getPlayerById(99L))
                .thenThrow(new PlayerNotFoundException("Player with ID 99 not found"));

        mockMvc.perform(get("/players/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Player Not Found"))
                .andExpect(jsonPath("$.message").value("Player with ID 99 not found"));
    }

    // =====================================================================
    // GET /players
    // =====================================================================

    @Test
    @DisplayName("GET /players → 200 e lista de players")
    void listarPlayers_retorna200() throws Exception {
        PlayerResponseDTO p1 = PlayerResponseDTO.builder()
                .id(1L).email("p1@rushb.com").createdAt(LocalDateTime.now()).build();
        PlayerResponseDTO p2 = PlayerResponseDTO.builder()
                .id(2L).email("p2@rushb.com").createdAt(LocalDateTime.now()).build();

        when(playerService.getAllPlayers()).thenReturn(List.of(p1, p2));

        mockMvc.perform(get("/players"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].email").value("p1@rushb.com"))
                .andExpect(jsonPath("$[1].email").value("p2@rushb.com"));
    }

    // =====================================================================
    // DELETE /players/{id}
    // =====================================================================

    @Test
    @DisplayName("DELETE /players/{id} → 204 quando player existe")
    void deletarPlayer_retorna204() throws Exception {
        doNothing().when(playerService).deletePlayer(1L);

        mockMvc.perform(delete("/players/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /players/{id} → 404 quando ID não existe")
    void deletarPlayerInexistente_retorna404() throws Exception {
        doThrow(new PlayerNotFoundException("Player with ID 99 not found"))
                .when(playerService).deletePlayer(99L);

        mockMvc.perform(delete("/players/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Player Not Found"));
    }
}
