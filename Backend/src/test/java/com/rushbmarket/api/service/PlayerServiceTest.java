package com.rushbmarket.api.service;

import com.rushbmarket.api.exception.EmailAlreadyExistsException;
import com.rushbmarket.api.exception.PlayerNotFoundException;
import com.rushbmarket.api.model.dto.request.CreatePlayerRequestDTO;
import com.rushbmarket.api.model.dto.response.PlayerResponseDTO;
import com.rushbmarket.api.model.dto.response.PlayerWithSkinsResponseDTO;
import com.rushbmarket.api.model.entity.Player;
import com.rushbmarket.api.repository.PlayerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Testes unitários do PlayerService com Mock (Mockito).
 *
 * O PlayerRepository é mockado, isolando a lógica do service
 * sem necessidade de banco de dados.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("PlayerService - testes com mock")
class PlayerServiceTest {

    @Mock
    private PlayerRepository playerRepository;

    @InjectMocks
    private PlayerService playerService;

    private Player player;

    @BeforeEach
    void setUp() {
        // Fixture: player base reutilizado nos testes
        player = Player.builder()
                .id(1L)
                .email("bruno@rushb.com")
                .password("senha123")
                .createdAt(LocalDateTime.of(2026, 9, 1, 10, 0))
                .skins(new ArrayList<>())
                .build();
    }

    // =====================================================================
    // COM MOCK — Teste 1: criar player com sucesso
    // =====================================================================

    @Test
    @DisplayName("Deve criar player com sucesso e retornar o DTO com os dados corretos")
    void deveCriarPlayerComSucesso() {
        // Arrange
        CreatePlayerRequestDTO request = CreatePlayerRequestDTO.builder()
                .email("bruno@rushb.com")
                .password("senha123")
                .build();

        when(playerRepository.existsByEmail("bruno@rushb.com")).thenReturn(false);
        when(playerRepository.save(any(Player.class))).thenReturn(player);

        // Act
        PlayerResponseDTO resultado = playerService.createPlayer(request);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getEmail()).isEqualTo("bruno@rushb.com");
        verify(playerRepository).save(any(Player.class));
    }

    // =====================================================================
    // COM MOCK — Teste 2: buscar player por ID com sucesso
    // =====================================================================

    @Test
    @DisplayName("Deve retornar o player com suas skins ao buscar por ID existente")
    void deveBuscarPlayerPorIdComSucesso() {
        // Arrange
        when(playerRepository.findById(1L)).thenReturn(Optional.of(player));

        // Act
        PlayerWithSkinsResponseDTO resultado = playerService.getPlayerById(1L);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getEmail()).isEqualTo("bruno@rushb.com");
        assertThat(resultado.getSkins()).isEmpty();
        verify(playerRepository).findById(1L);
    }

    // =====================================================================
    // COM MOCK — Teste negativo 1: buscar player com ID inexistente
    // =====================================================================

    @Test
    @DisplayName("Deve lançar PlayerNotFoundException ao buscar por ID inexistente")
    void deveLancarExcecaoAoBuscarPlayerInexistente() {
        // Arrange
        when(playerRepository.findById(99L)).thenReturn(Optional.empty());

        // Act + Assert
        assertThatThrownBy(() -> playerService.getPlayerById(99L))
                .isInstanceOf(PlayerNotFoundException.class)
                .hasMessageContaining("99");

        verify(playerRepository).findById(99L);
    }

    // =====================================================================
    // COM MOCK — Teste negativo 2 (bônus): email duplicado ao criar player
    // =====================================================================

    @Test
    @DisplayName("Deve lançar EmailAlreadyExistsException ao tentar cadastrar email já existente")
    void deveLancarExcecaoQuandoEmailJaCadastrado() {
        // Arrange
        CreatePlayerRequestDTO request = CreatePlayerRequestDTO.builder()
                .email("bruno@rushb.com")
                .password("senha123")
                .build();

        when(playerRepository.existsByEmail("bruno@rushb.com")).thenReturn(true);

        // Act + Assert
        assertThatThrownBy(() -> playerService.createPlayer(request))
                .isInstanceOf(EmailAlreadyExistsException.class)
                .hasMessageContaining("bruno@rushb.com");
    }

    // =====================================================================
    // COM MOCK — Teste 3: deletePlayer com sucesso
    // =====================================================================

    @Test
    @DisplayName("Deve deletar o player quando o ID existe e chamar delete() no repositório")
    void deveDeletarPlayerComSucesso() {
        // Arrange
        when(playerRepository.findById(1L)).thenReturn(Optional.of(player));

        // Act
        playerService.deletePlayer(1L);

        // Assert: delete foi chamado exatamente uma vez com o player correto
        verify(playerRepository).findById(1L);
        verify(playerRepository).delete(player);
    }

    // =====================================================================
    // COM MOCK — Teste negativo: deletePlayer com ID inexistente
    // =====================================================================

    @Test
    @DisplayName("Deve lançar PlayerNotFoundException ao deletar player com ID inexistente")
    void deveLancarExcecaoAoDeletarPlayerInexistente() {
        // Arrange
        when(playerRepository.findById(99L)).thenReturn(Optional.empty());

        // Act + Assert
        assertThatThrownBy(() -> playerService.deletePlayer(99L))
                .isInstanceOf(PlayerNotFoundException.class)
                .hasMessageContaining("99");

        // Assert: delete nunca deve ser chamado
        verify(playerRepository, never()).delete(any(Player.class));
    }
}
