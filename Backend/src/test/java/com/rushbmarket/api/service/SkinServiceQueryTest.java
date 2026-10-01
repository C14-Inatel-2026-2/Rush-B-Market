package com.rushbmarket.api.service;

import com.rushbmarket.api.exception.SkinNotFoundException;
import com.rushbmarket.api.model.dto.response.SkinResponseDTO;
import com.rushbmarket.api.model.entity.Skin;
import com.rushbmarket.api.repository.PlayerRepository;
import com.rushbmarket.api.repository.SkinRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("SkinService - Consultas e remoção")
class SkinServiceQueryTest {

    @Mock
    private SkinRepository skinRepository;

    @Mock
    private PlayerRepository playerRepository;

    @InjectMocks
    private SkinService skinService;

    @Test
    @DisplayName("getAllSkins deve retornar a lista de skins convertida para DTO")
    void deveRetornarTodasAsSkins() {
        Skin akRedline = Skin.builder().id(1L).name("AK-47 | Redline").float_value("0.15")
                .price(50.0).rarity("Classified").weapon("AK-47").build();
        Skin awpDragonLore = Skin.builder().id(2L).name("AWP | Dragon Lore").float_value("0.02")
                .price(5000.0).rarity("Covert").weapon("AWP").build();
        when(skinRepository.findAll()).thenReturn(List.of(akRedline, awpDragonLore));

        List<SkinResponseDTO> todasAsSkins = skinService.getAllSkins();

        assertThat(todasAsSkins).hasSize(2);
        assertThat(todasAsSkins.get(0).getName()).isEqualTo("AK-47 | Redline");
        assertThat(todasAsSkins.get(1).getName()).isEqualTo("AWP | Dragon Lore");
    }

    @Test
    @DisplayName("getSkinById deve retornar a skin quando o ID existe")
    void deveRetornarSkinPorIdComSucesso() {
        Skin karambitFade = Skin.builder().id(1L).name("Karambit | Fade").float_value("0.01")
                .price(1200.0).rarity("Covert").weapon("Knife").build();
        when(skinRepository.findById(1L)).thenReturn(Optional.of(karambitFade));

        SkinResponseDTO skinEncontrada = skinService.getSkinById(1L);

        assertThat(skinEncontrada).isNotNull();
        assertThat(skinEncontrada.getId()).isEqualTo(1L);
        assertThat(skinEncontrada.getName()).isEqualTo("Karambit | Fade");
    }

    @Test
    @DisplayName("getSkinById deve lançar SkinNotFoundException quando o ID não existe")
    void deveLancarExcecaoAoBuscarSkinInexistente() {
        when(skinRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> skinService.getSkinById(99L))
                .isInstanceOf(SkinNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("deleteSkin deve lançar SkinNotFoundException quando o ID não existe")
    void deveLancarExcecaoAoDeletarSkinInexistente() {
        when(skinRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> skinService.deleteSkin(99L))
                .isInstanceOf(SkinNotFoundException.class)
                .hasMessageContaining("99");

        verify(skinRepository, never()).delete(any());
    }
}