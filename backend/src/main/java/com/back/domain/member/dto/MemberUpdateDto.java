// src/main/java/com/back/domain/member/dto/MemberUpdateDto.java
package com.back.domain.member.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record MemberUpdateDto(
        @NotBlank(message = "이름은 필수입니다.")
        @Size(min = 2, max = 20, message = "이름은 2~20자 사이여야 합니다.")
        String name,

        @Pattern(regexp = "^\\d{2,4}-?\\d{3,4}-?\\d{4}$", message = "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678 또는 01012345678)")
        String phoneNumber
) {

}