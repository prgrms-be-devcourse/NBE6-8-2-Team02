package com.back.domain.asset.Dto;

import com.back.domain.asset.entity.Asset;

import java.time.LocalDateTime;

public record AssetDto (
        int id,
        int memberId,
        String name,
        String assetType,
        Long assetValue,
        LocalDateTime createDate,
        LocalDateTime modifyDate
) {
    public AssetDto(Asset asset)
    {
        this(
                asset.getId(),
                asset.getMember().getId(),
                asset.getName(),
                asset.getAssetType().toString(),
                asset.getAssetValue(),
                asset.getCreateDate(),
                asset.getModifyDate()
        );
    }
}
