package com.back.domain.asset.Dto;

import com.back.domain.asset.entity.Asset;
import com.back.domain.asset.entity.AssetType;
import com.back.domain.member.entity.Member;
import lombok.NonNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AssetDto (
        int memberId,
        String name,
        String assetType,
        int value,
        LocalDateTime createDate,
        LocalDateTime modifyDate
) {
    public AssetDto(Asset asset)
    {
        this(
                asset.getMember().getId(),
                asset.getName(),
                asset.getAssetType().toString(),
                asset.getValue(),
                asset.getCreateDate(),
                asset.getModifyDate()
        );
    }
}
