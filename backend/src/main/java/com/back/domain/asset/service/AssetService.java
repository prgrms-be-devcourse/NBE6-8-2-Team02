package com.back.domain.asset.service;

import com.back.domain.asset.Dto.CreateAssetRequestDto;
import com.back.domain.asset.entity.Asset;
import com.back.domain.asset.entity.AssetType;
import com.back.domain.asset.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssetService {
    private final AssetRepository assetRepository;

    // 엔티티 빌더
    public Asset createAsset(CreateAssetRequestDto createAssetRequestDto) {
        Asset asset = Asset.builder()
                .member(createAssetRequestDto.member())
                .name(createAssetRequestDto.name())
                .assetType(AssetType.valueOf(createAssetRequestDto.assetType()))
                .value(createAssetRequestDto.value())
                .build();

        assetRepository.save(asset);
        return asset;
    }

    // ------- 일반 서비스 -------- //
    public long count() {return assetRepository.count();}
    public Optional<Asset> findById(int id) {return assetRepository.findById(id);}
    public List<Asset> findAll() {return assetRepository.findAll();}

    public Asset deleteById(int id) {
        Asset asset = assetRepository.findById(id).orElse(null);
        if (asset != null) {
            assetRepository.deleteById(id);
        }
        return asset;
    }

    public Asset updateById(int id) {return null;}

    public void flush() {assetRepository.flush();}
}
