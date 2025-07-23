package com.back.domain.asset.Dto;

public record UpdateAssetRequestDto (
        int id,
        String name,
        String assetType,
        int assetValue
) {
    public UpdateAssetRequestDto(int id, String name, String assetType, int assetValue) {
        this.id = id;
        this.name = name;
        this.assetType = assetType;
        this.assetValue = assetValue;
    }
}
