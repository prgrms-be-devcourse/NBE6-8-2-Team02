package com.back.domain.asset.controller;

import com.back.domain.asset.Dto.AssetDto;
import com.back.domain.asset.Dto.CreateAssetRequestDto;
import com.back.domain.asset.entity.Asset;
import com.back.domain.asset.service.AssetService;
import com.back.global.rsData.RsData;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/assets")
public class ApiV1AssetController {
    private final AssetService assetService;

    // 생성
    @PostMapping
    @Transactional(readOnly = true)
    public RsData<Asset> createAsset(
            @RequestBody CreateAssetRequestDto createAssetRequestDto
    ) {
        Asset asset = assetService.createAsset(createAssetRequestDto);
        return new RsData<>("200-1", "자산이 등록되었습니다.", asset);
    }

    // 다건 조회
    @Transactional(readOnly = true)
    @GetMapping
    public RsData<List<AssetDto>> getAssets() {
        List<Asset> assets = assetService.findAll();
        List<AssetDto> assetDtos = assets.stream().map(AssetDto::new).toList();
        return new RsData<>("200-1", "자산 목록을 조회했습니다.", assetDtos);
    }

    // 단건 조회
    @Transactional(readOnly = true)
    @GetMapping("/{id}")
    public RsData<AssetDto> getAsset(@PathVariable int id) {
        Asset asset = assetService.findById(id).orElse(null);
        AssetDto assetDto = new AssetDto(asset);
        return new RsData<>(
                "200-1",
                "%d번 자산을 조회했습니다.".formatted(id),
                assetDto
        );
    }

    // id 기반 삭제
    @Transactional(readOnly = true)
    @DeleteMapping("/{id}")
    public RsData<AssetDto> deleteAsset(@PathVariable int id) {
        Asset asset = assetService.deleteById(id);
        AssetDto assetDto = new AssetDto(asset);
        return new RsData<>(
                "200-1",
                "%d번 자산을 삭제했습니다.".formatted(id),
                assetDto
        );
    }

    // id 기반 수정
    @Transactional(readOnly = true)
    @PutMapping("/{id}")
    public RsData<AssetDto> updateAsset(@PathVariable int id) {
        Asset asset = assetService.deleteById(id);
        AssetDto assetDto = new AssetDto(asset);
        return new RsData<>(
                "200-1",
                "%d번 자산을 삭제했습니다.".formatted(id),
                assetDto
        );
    }
}
