package com.rushbmarket.api.mapper;

import com.rushbmarket.api.model.dto.request.AddSkinRequestDTO;
import com.rushbmarket.api.model.dto.response.SkinResponseDTO;
import com.rushbmarket.api.model.entity.Skin;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("SkinMapper")
class SkinMapperTest {

    @Test
    @DisplayName("toEntity deve converter o DTO de requisição em uma entidade Skin equivalente")
    void deveConverterRequestDtoParaEntidade() {
        AddSkinRequestDTO requestDeNovaSkin = AddSkinRequestDTO.builder()
                .name("M4A4 | Howl")
                .floatValue("0.07")
                .price(3000.0)
                .rarity("Contraband")
                .weapon("M4A4")
                .build();

        Skin skinConvertida = SkinMapper.toEntity(requestDeNovaSkin);

        assertThat(skinConvertida.getName()).isEqualTo("M4A4 | Howl");
        assertThat(skinConvertida.getFloat_value()).isEqualTo("0.07");
        assertThat(skinConvertida.getPrice()).isEqualTo(3000.0);
        assertThat(skinConvertida.getRarity()).isEqualTo("Contraband");
        assertThat(skinConvertida.getWeapon()).isEqualTo("M4A4");
        assertThat(skinConvertida.getId()).isNull();
    }

    @Test
    @DisplayName("toResponseDTO deve converter a entidade Skin em DTO de resposta, incluindo o playerId")
    void deveConverterEntidadeParaResponseDto() {
        Skin glockFade = Skin.builder()
                .id(10L)
                .name("Glock-18 | Fade")
                .float_value("0.03")
                .price(450.0)
                .rarity("Restricted")
                .weapon("Glock-18")
                .build();

        SkinResponseDTO dtoConvertido = SkinMapper.toResponseDTO(glockFade);

        assertThat(dtoConvertido.getId()).isEqualTo(10L);
        assertThat(dtoConvertido.getName()).isEqualTo("Glock-18 | Fade");
        assertThat(dtoConvertido.getPlayerId()).isNull();
    }
}