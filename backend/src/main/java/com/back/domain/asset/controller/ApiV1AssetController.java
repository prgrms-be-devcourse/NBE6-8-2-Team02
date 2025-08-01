package com.back.domain.asset.controller;

import com.back.domain.asset.Dto.AssetDto;
import com.back.domain.asset.Dto.CreateAssetRequestDto;
import com.back.domain.asset.Dto.CreateWithoutMemberDto;
import com.back.domain.asset.Dto.UpdateAssetRequestDto;
import com.back.domain.asset.entity.Asset;
import com.back.domain.asset.service.AssetService;
import com.back.global.rsData.RsData;
import com.back.global.security.jwt.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/assets")
@Tag(name = "ApiV1AssetController", description = "자산 컨트롤러")
public class ApiV1AssetController {
    private final AssetService assetService;

    // 생성
    @PostMapping
    @Operation(summary = "자산 등록")
    public RsData<AssetDto> createAsset(
            @RequestBody CreateAssetRequestDto createAssetRequestDto
    ) {
        Asset asset = assetService.createAsset(createAssetRequestDto);
        AssetDto assetDto = new AssetDto(asset);
        return new RsData<>("200-1", "자산이 등록되었습니다.", assetDto);
    }

    // 다건 조회
    @GetMapping
    @Operation(summary = "자산 다건 조회")
    public RsData<List<AssetDto>> getAssets() {
        List<Asset> assets = assetService.findAll();
        List<AssetDto> assetDtos = assets.stream().map(AssetDto::new).toList();
        return new RsData<>("200-1", "자산 목록을 조회했습니다.", assetDtos);
    }

    // 단건 조회
    @GetMapping("/{id}")
    @Operation(summary = "자산 단건 조회")
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
    @DeleteMapping("/{id}")
    @Operation(summary = "자산 삭제 (id 기반)")
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
    @PutMapping("/{id}")
    @Operation(summary = "자산 수정 (id 기반)")
    public RsData<AssetDto> updateAsset(@RequestBody UpdateAssetRequestDto updateAssetRequestDto) {
        Asset asset = assetService.updateById(updateAssetRequestDto);
        AssetDto assetDto = new AssetDto(asset);
        return new RsData<>(
                "200-1",
                "%d번 자산을 수정했습니다.".formatted(updateAssetRequestDto.id()),
                assetDto
        );
    }

    @GetMapping("/member")
    @Operation(summary = "사용자 기반 자산 목록 조회")
    public RsData<List<AssetDto>> getAssetsByCurrentMember(@AuthenticationPrincipal CustomUserDetails userDetails) {
        int memberId = userDetails.getMember().getId();

        List<Asset> assets = assetService.findAllByMemberId(memberId);
        List<AssetDto> assetDtos = assets.stream().map(AssetDto::new).toList();
        return new RsData<>(
                "200-1",
                "%d번 사용자의 자산 목록을 조회했습니다.".formatted(memberId),
                assetDtos
        );
    }

    @PostMapping("/member")
    @Operation(summary = "사용자 기반 자산 등록")
    public RsData<AssetDto> createAssetByCurrentMember(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CreateWithoutMemberDto createWithoutMemberDto
    ) {
        int memberId = userDetails.getMember().getId();

        Asset asset = assetService.createAssetByMember(memberId, createWithoutMemberDto);
        AssetDto assetDto = new AssetDto(asset);
        return new RsData<>("200-1", "자산이 등록되었습니다.", assetDto);
    }
}
