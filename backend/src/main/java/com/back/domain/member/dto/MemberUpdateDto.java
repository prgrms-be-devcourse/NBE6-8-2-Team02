// src/main/java/com/back/domain/member/dto/MemberUpdateDto.java
package com.back.domain.member.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MemberUpdateDto(
        @NotBlank @Size(min = 2, max = 20) String name,
        String phoneNumber
) {

}