package com.back.domain.asset.Dto;

public record UpdateAssetRequestDto (
        String name,
        String assetType,
        int value
) {
    public UpdateAssetRequestDto(String name, String assetType, int value) {
        this.name = name;
        this.assetType = assetType;
        this.value = value;
    }
}
