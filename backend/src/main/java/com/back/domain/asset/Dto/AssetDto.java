package com.back.domain.asset.Dto;

import com.back.domain.asset.entity.Asset;
import com.back.domain.asset.entity.AssetType;
import com.back.domain.member.entity.Member;
import lombok.NonNull;

public record AssetDto (
        Member member,
        String name,
        String assetType,
        int value
) {
    public AssetDto(Asset asset)
    {
        this(
                asset.getMember(),
                asset.getName(),
                asset.getAssetType().toString(),
                asset.getValue()
        );
    }
}
