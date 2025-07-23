package com.back.domain.asset.service;

import com.back.domain.asset.Dto.CreateAssetRequestDto;
import com.back.domain.asset.Dto.UpdateAssetRequestDto;
import com.back.domain.asset.entity.Asset;
import com.back.domain.asset.entity.AssetType;
import com.back.domain.asset.repository.AssetRepository;
import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssetService {
    private final AssetRepository assetRepository;
    private final MemberRepository memberRepository;

    // 엔티티 빌더
    public Asset createAsset(CreateAssetRequestDto createAssetRequestDto) {
        Member member = memberRepository.findById(createAssetRequestDto.memberId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        Asset asset = Asset.builder()
                .member(member)
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
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 id는 존재하지 않는 상품입니다. id:" + id));
        if (asset != null) {
            assetRepository.deleteById(id);
        }
        return asset;
    }

    public Asset updateById(UpdateAssetRequestDto updateAssetRequestDto) {
        Asset asset = assetRepository.findById(updateAssetRequestDto.id())
                .orElseThrow(() -> new IllegalArgumentException("해당 id는 존재하지 않는 상품입니다. id:" + updateAssetRequestDto.id()));

        asset.setName(updateAssetRequestDto.name());
        asset.setAssetType(AssetType.valueOf(updateAssetRequestDto.assetType()));
        asset.setValue(updateAssetRequestDto.value());

        return assetRepository.save(asset);
    }

    public void flush() {assetRepository.flush();}
}
