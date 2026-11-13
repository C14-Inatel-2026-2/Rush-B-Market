package com.rushbmarket.api.mapper;

import com.rushbmarket.api.model.dto.request.CreatePlayerRequestDTO;
import com.rushbmarket.api.model.dto.response.PlayerResponseDTO;
import com.rushbmarket.api.model.dto.response.PlayerWithSkinsResponseDTO;
import com.rushbmarket.api.model.entity.Player;
import com.rushbmarket.api.model.entity.Skin;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Testes unitários do PlayerMapper SEM mock.
 *
 * PlayerMapper é uma classe utilitária pura (métodos estáticos),
 * sem dependências externas. Por isso não precisa de Mockito —
 * instanciamos os objetos diretamente e verificamos a conversão.
 */
@DisplayName("PlayerMapper - testes sem mock")
class PlayerMapperTest {

    // =====================================================================
    // SEM MOCK — Teste 1: toResponseDTO mapeia campos corretamente
    // =====================================================================

    @Test
    @DisplayName("Deve mapear Player para PlayerResponseDTO com todos os campos corretos")
    void deveMapearPlayerParaResponseDTO() {
        // Arrange
        LocalDateTime agora = LocalDateTime.of(2026, 9, 1, 10, 0);
        Player player = Player.builder()
                .id(1L)
                .email("bruno@rushb.com")
                .password("senha123")
                .createdAt(agora)
                .skins(new ArrayList<>())
                .build();

        // Act
        PlayerResponseDTO resultado = PlayerMapper.toResponseDTO(player);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getEmail()).isEqualTo("bruno@rushb.com");
        assertThat(resultado.getCreatedAt()).isEqualTo(agora);
    }

    // =====================================================================
    // SEM MOCK — Teste 2: toWithSkinsResponseDTO inclui a lista de skins
    // =====================================================================

    @Test
    @DisplayName("Deve mapear Player com skins para PlayerWithSkinsResponseDTO corretamente")
    void deveMapearPlayerComSkinsParaWithSkinsResponseDTO() {
        // Arrange
        LocalDateTime agora = LocalDateTime.of(2026, 9, 1, 10, 0);
        Player player = Player.builder()
                .id(2L)
                .email("bruce@rushb.com")
                .password("senha456")
                .createdAt(agora)
                .skins(new ArrayList<>())
                .build();

        Skin skin = Skin.builder()
                .id(10L)
                .name("AK-47 | Redline")
                .float_value("0.15")
                .price(45.99)
                .rarity("Classified")
                .weapon("AK-47")
                .player(player)
                .build();

        player.getSkins().add(skin);

        // Act
        PlayerWithSkinsResponseDTO resultado = PlayerMapper.toWithSkinsResponseDTO(player);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(2L);
        assertThat(resultado.getEmail()).isEqualTo("bruce@rushb.com");
        assertThat(resultado.getCreatedAt()).isEqualTo(agora);
        assertThat(resultado.getSkins()).hasSize(1);
        assertThat(resultado.getSkins().get(0).getName()).isEqualTo("AK-47 | Redline");
        assertThat(resultado.getSkins().get(0).getWeapon()).isEqualTo("AK-47");
    }

    // =====================================================================
    // SEM MOCK — Teste negativo: toWithSkinsResponseDTO com lista vazia
    // =====================================================================

    @Test
    @DisplayName("Deve retornar lista de skins vazia quando o player nao tem skins")
    void deveRetornarListaVaziaQuandoPlayerSemSkins() {
        // Arrange
        Player player = Player.builder()
                .id(3L)
                .email("samuel@rushb.com")
                .password("senha789")
                .createdAt(LocalDateTime.now())
                .skins(new ArrayList<>())
                .build();

        // Act
        PlayerWithSkinsResponseDTO resultado = PlayerMapper.toWithSkinsResponseDTO(player);

        // Assert
        assertThat(resultado.getSkins()).isNotNull();
        assertThat(resultado.getSkins()).isEmpty();
    }

    // =====================================================================
    // SEM MOCK — Teste extra: toEntity converte DTO em Player corretamente
    // =====================================================================

    @Test
    @DisplayName("Deve converter CreatePlayerRequestDTO em entidade Player com email e senha corretos")
    void deveConverterRequestDTOParaEntidadePlayer() {
        // Arrange
        CreatePlayerRequestDTO request = CreatePlayerRequestDTO.builder()
                .email("novo@rushb.com")
                .password("minhasenha")
                .build();

        // Act
        Player resultado = PlayerMapper.toEntity(request);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getEmail()).isEqualTo("novo@rushb.com");
        assertThat(resultado.getPassword()).isEqualTo("minhasenha");
        assertThat(resultado.getId()).isNull(); // ainda não persistido
        assertThat(resultado.getCreatedAt()).isNull(); // setado pelo @PrePersist
    }
}
