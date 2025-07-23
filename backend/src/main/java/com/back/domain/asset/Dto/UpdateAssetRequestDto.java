package com.back.domain.asset.Dto;

public record UpdateAssetRequestDto (
        int id,
        String name,
        String assetType,
        int value
) {
    public UpdateAssetRequestDto(int id, String name, String assetType, int value) {
        this.id = id;
        this.name = name;
        this.assetType = assetType;
        this.value = value;
    }
}
