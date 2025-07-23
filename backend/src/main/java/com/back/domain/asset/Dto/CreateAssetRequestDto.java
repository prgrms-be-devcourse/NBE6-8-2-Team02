package com.back.domain.asset.Dto;

import com.back.domain.member.entity.Member;
import lombok.Getter;
import lombok.Setter;

public record CreateAssetRequestDto (
    int memberId,
    String name,
    String assetType,
    int value
    ) {
    public CreateAssetRequestDto(int memberId,
                                 String name,
                                 String assetType,
                                 int value)
    {
        this.memberId = memberId;
        this.name = name;
        this.assetType = assetType;
        this.value = value;
    }
}