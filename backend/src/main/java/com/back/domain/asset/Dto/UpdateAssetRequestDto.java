package com.back.domain.asset.Dto;

public record UpdateAssetRequestDto (
        int id,
        String name,
        String assetType,
        Long assetValue
) {
    public UpdateAssetRequestDto(int id, String name, String assetType, Long assetValue) {
        this.id = id;
        this.name = name;
        this.assetType = assetType;
        this.assetValue = assetValue;
    }
}
