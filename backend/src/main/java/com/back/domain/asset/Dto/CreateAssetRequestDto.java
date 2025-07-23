package com.back.domain.asset.Dto;

import com.back.domain.member.entity.Member;
import lombok.Getter;
import lombok.Setter;

public record CreateAssetRequestDto (
    Member member,
    String name,
    String assetType,
    int value
    ) {
    public CreateAssetRequestDto(Member member,
                                 String name,
                                 String assetType,
                                 int value)
    {
        this.member = member;
        this.name = name;
        this.assetType = assetType;
        this.value = value;
    }
}