package com.rushbmarket.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rushbmarket.api.exception.DuplicateSkinException;
import com.rushbmarket.api.exception.DuplicateWeaponException;
import com.rushbmarket.api.exception.MaxSkinsLimitExceededException;
import com.rushbmarket.api.exception.SkinNotFoundException;
import com.rushbmarket.api.model.dto.request.AddSkinRequestDTO;
import com.rushbmarket.api.model.dto.response.SkinResponseDTO;
import com.rushbmarket.api.service.SkinService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Testes de integração da camada HTTP do SkinController.
 *
 * @WebMvcTest sobe apenas o slice web. O SkinService é mockado com
 * @MockitoBean (Spring Boot 3.4+), isolando a lógica de negócio.
 */
@WebMvcTest(SkinController.class)
@DisplayName("SkinController - testes HTTP")
class SkinControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SkinService skinService;

    // =====================================================================
    // POST /skins/player/{playerId}
    // =====================================================================

    @Test
    @DisplayName("POST /skins/player/{id} → 201 e dados da skin quando válido")
    void adicionarSkinValida_retorna201() throws Exception {
        AddSkinRequestDTO request = AddSkinRequestDTO.builder()
                .name("AK-47 | Redline")
                .floatValue("0.15")
                .price(45.99)
                .rarity("Classified")
                .weapon("AK-47")
                .build();

        SkinResponseDTO response = SkinResponseDTO.builder()
                .id(1L)
                .name("AK-47 | Redline")
                .floatValue("0.15")
                .price(45.99)
                .rarity("Classified")
                .weapon("AK-47")
                .playerId(1L)
                .build();

        when(skinService.addSkinToPlayer(eq(1L), any(AddSkinRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/skins/player/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("AK-47 | Redline"))
                .andExpect(jsonPath("$.weapon").value("AK-47"))
                .andExpect(jsonPath("$.playerId").value(1));
    }

    @Test
    @DisplayName("POST /skins/player/{id} → 400 quando nome de skin duplicado")
    void adicionarSkinNomeDuplicado_retorna400() throws Exception {
        AddSkinRequestDTO request = AddSkinRequestDTO.builder()
                .name("AK-47 | Redline")
                .floatValue("0.20")
                .price(40.0)
                .rarity("Classified")
                .weapon("AK-47")
                .build();

        when(skinService.addSkinToPlayer(eq(1L), any(AddSkinRequestDTO.class)))
                .thenThrow(new DuplicateSkinException("Player already has a skin named 'AK-47 | Redline'"));

        mockMvc.perform(post("/skins/player/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Duplicate Skin"));
    }

    @Test
    @DisplayName("POST /skins/player/{id} → 400 quando arma já tem skin cadastrada")
    void adicionarSkinArmaRepetida_retorna400() throws Exception {
        AddSkinRequestDTO request = AddSkinRequestDTO.builder()
                .name("AK-47 | Asiimov")
                .floatValue("0.10")
                .price(60.0)
                .rarity("Covert")
                .weapon("AK-47")
                .build();

        when(skinService.addSkinToPlayer(eq(1L), any(AddSkinRequestDTO.class)))
                .thenThrow(new DuplicateWeaponException("Player already has a skin for weapon 'AK-47'"));

        mockMvc.perform(post("/skins/player/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Duplicate Weapon"));
    }

    @Test
    @DisplayName("POST /skins/player/{id} → 400 quando player já atingiu limite de 5 skins")
    void adicionarSkinLimiteExcedido_retorna400() throws Exception {
        AddSkinRequestDTO request = AddSkinRequestDTO.builder()
                .name("USP-S | Kill Confirmed")
                .floatValue("0.12")
                .price(180.0)
                .rarity("Covert")
                .weapon("USP-S")
                .build();

        when(skinService.addSkinToPlayer(eq(1L), any(AddSkinRequestDTO.class)))
                .thenThrow(new MaxSkinsLimitExceededException("Player already has maximum of 5 skins"));

        mockMvc.perform(post("/skins/player/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Max Skins Limit Exceeded"))
                .andExpect(jsonPath("$.message").value("Player already has maximum of 5 skins"));
    }

    @Test
    @DisplayName("POST /skins/player/{id} → 400 quando campos obrigatórios estão em branco (validação de DTO)")
    void adicionarSkinCamposEmBranco_retorna400() throws Exception {
        AddSkinRequestDTO request = AddSkinRequestDTO.builder()
                .name("")
                .floatValue("0.15")
                .price(45.99)
                .rarity("")
                .weapon("")
                .build();

        mockMvc.perform(post("/skins/player/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.rarity").exists())
                .andExpect(jsonPath("$.errors.weapon").exists());
    }

    // =====================================================================
    // GET /skins
    // =====================================================================

    @Test
    @DisplayName("GET /skins → 200 e lista de skins")
    void listarSkins_retorna200() throws Exception {
        SkinResponseDTO s1 = SkinResponseDTO.builder()
                .id(1L).name("AK-47 | Redline").floatValue("0.15")
                .price(45.99).rarity("Classified").weapon("AK-47").playerId(1L).build();
        SkinResponseDTO s2 = SkinResponseDTO.builder()
                .id(2L).name("AWP | Dragon Lore").floatValue("0.03")
                .price(2500.0).rarity("Covert").weapon("AWP").playerId(1L).build();

        when(skinService.getAllSkins()).thenReturn(List.of(s1, s2));

        mockMvc.perform(get("/skins"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("AK-47 | Redline"))
                .andExpect(jsonPath("$[1].name").value("AWP | Dragon Lore"));
    }

    // =====================================================================
    // GET /skins/{id}
    // =====================================================================

    @Test
    @DisplayName("GET /skins/{id} → 200 e dados da skin quando ID existe")
    void buscarSkinPorId_retorna200() throws Exception {
        SkinResponseDTO response = SkinResponseDTO.builder()
                .id(1L).name("Karambit | Fade").floatValue("0.01")
                .price(1200.0).rarity("Covert").weapon("Knife").playerId(2L).build();

        when(skinService.getSkinById(1L)).thenReturn(response);

        mockMvc.perform(get("/skins/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Karambit | Fade"))
                .andExpect(jsonPath("$.price").value(1200.0));
    }

    @Test
    @DisplayName("GET /skins/{id} → 404 quando ID não existe")
    void buscarSkinPorIdInexistente_retorna404() throws Exception {
        when(skinService.getSkinById(99L))
                .thenThrow(new SkinNotFoundException("Skin with ID 99 not found"));

        mockMvc.perform(get("/skins/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Skin Not Found"))
                .andExpect(jsonPath("$.message").value("Skin with ID 99 not found"));
    }

    // =====================================================================
    // DELETE /skins/{id}
    // =====================================================================

    @Test
    @DisplayName("DELETE /skins/{id} → 204 quando skin existe")
    void deletarSkin_retorna204() throws Exception {
        doNothing().when(skinService).deleteSkin(1L);

        mockMvc.perform(delete("/skins/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /skins/{id} → 404 quando ID não existe")
    void deletarSkinInexistente_retorna404() throws Exception {
        doThrow(new SkinNotFoundException("Skin with ID 99 not found"))
                .when(skinService).deleteSkin(99L);

        mockMvc.perform(delete("/skins/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Skin Not Found"));
    }
}
