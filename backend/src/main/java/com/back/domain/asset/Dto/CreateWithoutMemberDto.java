package com.back.domain.asset.Dto;

import com.back.domain.member.entity.Member;
import lombok.Getter;
import lombok.Setter;

public record CreateWithoutMemberDto(
        String name,
        String assetType,
        Long assetValue
) {
    public CreateWithoutMemberDto(
                                 String name,
                                 String assetType,
                                 Long assetValue
    )
    {
        this.name = name;
        this.assetType = assetType;
        this.assetValue = assetValue;
    }
}