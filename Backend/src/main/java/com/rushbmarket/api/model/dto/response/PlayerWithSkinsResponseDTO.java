package com.rushbmarket.api.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerWithSkinsResponseDTO {

    private Long id;
    private String email;
    private LocalDateTime createdAt;
    private List<SkinResponseDTO> skins;
}
