package com.rushbmarket.api.service;

import com.rushbmarket.api.exception.DuplicateSkinException;
import com.rushbmarket.api.exception.DuplicateWeaponException;
import com.rushbmarket.api.exception.MaxSkinsLimitExceededException;
import com.rushbmarket.api.exception.PlayerNotFoundException;
import com.rushbmarket.api.model.dto.request.AddSkinRequestDTO;
import com.rushbmarket.api.model.dto.response.SkinResponseDTO;
import com.rushbmarket.api.model.entity.Player;
import com.rushbmarket.api.model.entity.Skin;
import com.rushbmarket.api.repository.PlayerRepository;
import com.rushbmarket.api.repository.SkinRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Testes unitários da regra de negócio: um Player pode ter no máximo 5 skins.
 *
 * Utiliza Mockito para "imitar" os repositórios (PlayerRepository e SkinRepository),
 * permitindo testar a lógica do SkinService de forma isolada, sem acessar o banco.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("SkinService - Regra: máximo de 5 skins por player")
class SkinServiceTest {

    @Mock
    private PlayerRepository playerRepository;

    @Mock
    private SkinRepository skinRepository;

    @InjectMocks
    private SkinService skinService;

    private static final int MAX_SKINS = 5;

    private Player player;

    @BeforeEach
    void setUp() {
        // Fixture: um player recém-criado, sem skins, usado como base nos testes.
        player = Player.builder()
                .id(1L)
                .email("player@rushb.com")
                .password("senha123")
                .skins(new ArrayList<>())
                .build();
    }

    @Test
    @DisplayName("Deve adicionar a skin quando o player ainda não atingiu o limite")
    void deveAdicionarSkinQuandoPlayerAbaixoDoLimite() {
        // Arrange: player com 3 skins (abaixo do limite de 5).
        // A skin nova usa uma arma que ainda não está no inventário, para
        // isolar a regra do limite sem esbarrar na regra de arma duplicada.
        player.setSkins(criarSkins(3));
        AddSkinRequestDTO request = novaSkinRequest("Karambit | Doppler", "Knife");

        when(playerRepository.findById(1L)).thenReturn(Optional.of(player));

        // Act
        SkinResponseDTO resultado = skinService.addSkinToPlayer(1L, request);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getName()).isEqualTo("Karambit | Doppler");
        assertThat(player.getSkins()).hasSize(4);
        verify(playerRepository).save(player);
    }

    @Test
    @DisplayName("Deve permitir adicionar exatamente a 5ª skin (limite inclusivo)")
    void devePermitirAdicionarAQuintaSkin() {
        // Arrange: player com 4 skins; a 5ª (arma nova) ainda é permitida.
        player.setSkins(criarSkins(4));
        AddSkinRequestDTO request = novaSkinRequest("Karambit | Doppler", "Knife");

        when(playerRepository.findById(1L)).thenReturn(Optional.of(player));

        // Act
        skinService.addSkinToPlayer(1L, request);

        // Assert
        assertThat(player.getSkins()).hasSize(MAX_SKINS);
    }

    @Test
    @DisplayName("Deve lançar MaxSkinsLimitExceededException quando o player já tem 5 skins")
    void deveLancarExcecaoQuandoPlayerNoLimite() {
        // Arrange: player já com 5 skins (limite atingido). A arma nova (Knife)
        // garante que a exceção lançada seja a do limite, e não a de arma duplicada.
        player.setSkins(criarSkins(MAX_SKINS));
        AddSkinRequestDTO request = novaSkinRequest("Karambit | Fade", "Knife");

        when(playerRepository.findById(1L)).thenReturn(Optional.of(player));

        // Act + Assert
        assertThatThrownBy(() -> skinService.addSkinToPlayer(1L, request))
                .isInstanceOf(MaxSkinsLimitExceededException.class)
                .hasMessageContaining("maximum of " + MAX_SKINS);
    }

    @Test
    @DisplayName("Não deve salvar o player quando o limite de skins é excedido")
    void naoDeveSalvarQuandoLimiteExcedido() {
        // Arrange: player já no limite
        player.setSkins(criarSkins(MAX_SKINS));
        AddSkinRequestDTO request = novaSkinRequest("USP-S | Kill Confirmed", "USP-S");

        when(playerRepository.findById(1L)).thenReturn(Optional.of(player));

        // Act
        try {
            skinService.addSkinToPlayer(1L, request);
        } catch (MaxSkinsLimitExceededException ignored) {
            // exceção esperada
        }

        // Assert: a skin não pode ser persistida e a lista continua com 5
        verify(playerRepository, never()).save(any(Player.class));
        assertThat(player.getSkins()).hasSize(MAX_SKINS);
    }

    @Test
    @DisplayName("Deve lançar PlayerNotFoundException quando o player não existe")
    void deveLancarExcecaoQuandoPlayerNaoExiste() {
        // Arrange: repositório não encontra o player
        AddSkinRequestDTO request = novaSkinRequest("AK-47 | Redline", "AK-47");
        when(playerRepository.findById(99L)).thenReturn(Optional.empty());

        // Act + Assert
        assertThatThrownBy(() -> skinService.addSkinToPlayer(99L, request))
                .isInstanceOf(PlayerNotFoundException.class)
                .hasMessageContaining("99");

        verify(playerRepository, never()).save(any(Player.class));
    }

    // ----- Helpers -----

    /**
     * Cria uma lista de skins válidas (nomes e armas distintos) para preencher o inventário
     * do player. Usa armas diferentes para não esbarrar nas outras regras de negócio.
     */
    private List<Skin> criarSkins(int quantidade) {
        String[] armas = {"AK-47", "AWP", "M4A4", "Desert Eagle", "Glock-18"};
        List<Skin> skins = new ArrayList<>();
        for (int i = 0; i < quantidade; i++) {
            skins.add(Skin.builder()
                    .id((long) (i + 1))
                    .name("Skin " + (i + 1))
                    .float_value("0.10")
                    .price(100.0)
                    .rarity("Classified")
                    .weapon(armas[i % armas.length])
                    .player(player)
                    .build());
        }
        return skins;
    }

    private AddSkinRequestDTO novaSkinRequest(String name, String weapon) {
        return AddSkinRequestDTO.builder()
                .name(name)
                .floatValue("0.05")
                .price(50.0)
                .rarity("Covert")
                .weapon(weapon)
                .build();
    }

    // =====================================================================
    // Regra 2: Sem Skins Duplicadas (mesmo nome)
    // =====================================================================

    @Test
    @DisplayName("Deve lançar DuplicateSkinException quando o player já tem uma skin com o mesmo nome exato")
    void deveLancarExcecaoQuandoNomeDaSkinJaExiste() {
        // Arrange: player com 1 skin de nome "AK-47 | Redline"
        Skin skinExistente = Skin.builder()
                .id(1L)
                .name("AK-47 | Redline")
                .float_value("0.15")
                .price(45.99)
                .rarity("Classified")
                .weapon("AK-47")
                .player(player)
                .build();
        player.getSkins().add(skinExistente);

        // Tenta adicionar outra skin com o mesmo nome (float diferente para isolar a regra)
        AddSkinRequestDTO request = novaSkinRequest("AK-47 | Redline", "M4A4");

        when(playerRepository.findById(1L)).thenReturn(Optional.of(player));

        // Act + Assert
        assertThatThrownBy(() -> skinService.addSkinToPlayer(1L, request))
                .isInstanceOf(DuplicateSkinException.class)
                .hasMessageContaining("AK-47 | Redline");
    }

    @Test
    @DisplayName("Deve lançar DuplicateSkinException quando o nome é igual mas em caixa diferente (case-insensitive)")
    void deveLancarExcecaoQuandoNomeDuplicadoCaseInsensitive() {
        // Arrange: skin existente com nome em maiúsculas
        Skin skinExistente = Skin.builder()
                .id(1L)
                .name("AK-47 | Redline")
                .float_value("0.15")
                .price(45.99)
                .rarity("Classified")
                .weapon("AK-47")
                .player(player)
                .build();
        player.getSkins().add(skinExistente);

        // Tenta adicionar com nome em minúsculas — deve ser bloqueado mesmo assim
        AddSkinRequestDTO request = novaSkinRequest("ak-47 | redline", "M4A4");

        when(playerRepository.findById(1L)).thenReturn(Optional.of(player));

        // Act + Assert
        assertThatThrownBy(() -> skinService.addSkinToPlayer(1L, request))
                .isInstanceOf(DuplicateSkinException.class)
                .hasMessageContaining("ak-47 | redline");
    }

    @Test
    @DisplayName("Não deve salvar o player quando a skin duplicada é detectada")
    void naoDeveSalvarQuandoSkinDuplicadaDetectada() {
        // Arrange
        Skin skinExistente = Skin.builder()
                .id(1L)
                .name("AK-47 | Redline")
                .float_value("0.15")
                .price(45.99)
                .rarity("Classified")
                .weapon("AK-47")
                .player(player)
                .build();
        player.getSkins().add(skinExistente);

        AddSkinRequestDTO request = novaSkinRequest("AK-47 | Redline", "M4A4");

        when(playerRepository.findById(1L)).thenReturn(Optional.of(player));

        // Act
        try {
            skinService.addSkinToPlayer(1L, request);
        } catch (DuplicateSkinException ignored) {
            // exceção esperada
        }

        // Assert: nenhuma persistência deve ocorrer e o inventário não muda
        verify(playerRepository, never()).save(any(Player.class));
        assertThat(player.getSkins()).hasSize(1);
    }

    @Test
    @DisplayName("Não deve lançar DuplicateSkinException quando a skin tem nome diferente (mesmo que mesma arma)")
    void naoDeveLancarDuplicateSkinExcecaoQuandoNomeDiferente() {
        // Arrange: skin existente com nome "AK-47 | Redline"
        Skin skinExistente = Skin.builder()
                .id(1L)
                .name("AK-47 | Redline")
                .float_value("0.15")
                .price(45.99)
                .rarity("Classified")
                .weapon("AK-47")
                .player(player)
                .build();
        player.getSkins().add(skinExistente);

        // Tenta adicionar com nome diferente mas mesma arma
        // — a Regra 2 (duplicata de nome) NÃO deve ser lançada; a Regra 3 sim
        AddSkinRequestDTO request = novaSkinRequest("AK-47 | Asiimov", "AK-47");

        when(playerRepository.findById(1L)).thenReturn(Optional.of(player));

        // Act + Assert: a exceção lançada deve ser DuplicateWeaponException, não DuplicateSkinException
        assertThatThrownBy(() -> skinService.addSkinToPlayer(1L, request))
                .isInstanceOf(DuplicateWeaponException.class)
                .isNotInstanceOf(DuplicateSkinException.class);
    }
}
