package com.rushbmarket.api.model.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Testes unitários SEM mock da entidade Player.
 *
 * Verifica o comportamento dos métodos addSkin() e removeSkin()
 * diretamente no objeto de domínio, sem envolver repositórios ou serviços.
 */
@DisplayName("Player Entity - addSkin e removeSkin")
class PlayerEntityTest {

    private Player player;
    private Skin skin;

    @BeforeEach
    void setUp() {
        player = Player.builder()
                .id(1L)
                .email("player@rushb.com")
                .password("senha123")
                .skins(new ArrayList<>())
                .build();

        skin = Skin.builder()
                .id(1L)
                .name("AK-47 | Redline")
                .float_value("0.15")
                .price(45.99)
                .rarity("Classified")
                .weapon("AK-47")
                .build();
    }

    // =====================================================================
    // SEM MOCK — Teste 1: addSkin adiciona a skin e seta o dono
    // =====================================================================

    @Test
    @DisplayName("addSkin deve adicionar a skin ao inventário e setar o player como dono")
    void deveAdicionarSkinESetarDono() {
        // Act
        player.addSkin(skin);

        // Assert: a skin está na lista do player
        assertThat(player.getSkins()).hasSize(1);
        assertThat(player.getSkins()).contains(skin);

        // Assert: o dono da skin foi setado corretamente (bidirecional)
        assertThat(skin.getPlayer()).isEqualTo(player);
    }

    // =====================================================================
    // SEM MOCK — Teste 2: removeSkin remove a skin e limpa o dono
    // =====================================================================

    @Test
    @DisplayName("removeSkin deve remover a skin do inventário e limpar o dono")
    void deveRemoverSkinELimparDono() {
        // Arrange: adiciona primeiro para depois remover
        player.addSkin(skin);
        assertThat(player.getSkins()).hasSize(1);

        // Act
        player.removeSkin(skin);

        // Assert: inventário vazio
        assertThat(player.getSkins()).isEmpty();

        // Assert: referência ao dono foi nulificada
        assertThat(skin.getPlayer()).isNull();
    }
}
