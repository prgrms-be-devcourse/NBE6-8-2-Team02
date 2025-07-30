package com.back.domain.asset.Dto;

import com.back.domain.member.entity.Member;
import lombok.Getter;
import lombok.Setter;

public record CreateAssetRequestDto (
    int memberId,
    String name,
    String assetType,
    Long assetValue
    ) {
    public CreateAssetRequestDto(int memberId,
                                 String name,
                                 String assetType,
                                 Long assetValue
    )
    {
        this.memberId = memberId;
        this.name = name;
        this.assetType = assetType;
        this.assetValue = assetValue;
    }
}