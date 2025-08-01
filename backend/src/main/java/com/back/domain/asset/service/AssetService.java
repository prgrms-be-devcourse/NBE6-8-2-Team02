package com.back.domain.asset.service;

import com.back.domain.asset.Dto.CreateAssetRequestDto;
import com.back.domain.asset.Dto.CreateWithoutMemberDto;
import com.back.domain.asset.Dto.UpdateAssetRequestDto;
import com.back.domain.asset.entity.Asset;
import com.back.domain.asset.entity.AssetType;
import com.back.domain.asset.repository.AssetRepository;
import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssetService {
    private final AssetRepository assetRepository;
    private final MemberRepository memberRepository;

    // 엔티티 빌더
    @Transactional
    public Asset createAsset(CreateAssetRequestDto createAssetRequestDto) {
        Member member = memberRepository.findById(createAssetRequestDto.memberId())
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        Asset asset = Asset.builder()
                .member(member)
                .name(createAssetRequestDto.name())
                .assetType(AssetType.valueOf(createAssetRequestDto.assetType()))
                .assetValue(createAssetRequestDto.assetValue())
                .status(true)
                .build();

        assetRepository.save(asset);
        return asset;
    }

    @Transactional
    public Asset createAssetByMember(int memberId, CreateWithoutMemberDto createWithoutMemberDto) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        Asset asset = Asset.builder()
                .member(member)
                .name(createWithoutMemberDto.name())
                .assetType(AssetType.valueOf(createWithoutMemberDto.assetType()))
                .assetValue(createWithoutMemberDto.assetValue())
                .status(true)
                .build();

        assetRepository.save(asset);
        return asset;
    }

    // ------- 일반 서비스 -------- //
    /* 기존 count() 코드
    @Transactional(readOnly = true)
    public long count() {return assetRepository.count();}
     */

    @Transactional(readOnly = true)
    public long count() {return assetRepository.countAllByStatusTrue();} // status == true 인 경우만 찾음.

    /* 기존 findById 코드
    @Transactional(readOnly = true)
    public Optional<Asset> findById(int id) {return assetRepository.findById(id);}
     */

    @Transactional(readOnly = true)
    public Optional<Asset> findById(int id) {return assetRepository.findByIdAndStatusTrue(id);} // status == true 인 경우만 찾음.

    /* 기존 findAll 코드
    @Transactional(readOnly = true)
    public List<Asset> findAll() {return assetRepository.findAll();}
     */

    @Transactional(readOnly = true)
    public List<Asset> findAll() {return assetRepository.findAllByStatusTrue();}

    @Transactional(readOnly = true)
    public List<Asset> findAllByMemberId(int memberId) {return assetRepository.findAllByStatusTrueAndMemberId(memberId);}// status == true 인 경우만 찾음.

    /* 기존 deleteById 코드
    @Transactional
    public Asset deleteById(int id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("해당 id는 존재하지 않는 자산입니다. id:" + id));
        if (asset != null) {
            return assetRepository.deleteById(id);
        }
        return asset;
    }
     */

    @Transactional
    public Asset deleteById(int id) {
        Asset asset = assetRepository.findByIdAndStatusTrue(id)
                .orElseThrow(() -> new NoSuchElementException("해당 id는 존재하지 않는 자산입니다. id:" + id));
        if (asset != null) {
            assetRepository.softDeleteById(id);
        }
        return asset;
    }

    @Transactional
    public Asset updateById(UpdateAssetRequestDto updateAssetRequestDto) {
        Asset asset = assetRepository.findById(updateAssetRequestDto.id())
                .orElseThrow(() -> new NoSuchElementException("해당 id는 존재하지 않는 자산입니다. id:" + updateAssetRequestDto.id()));

        asset.setName(updateAssetRequestDto.name());
        asset.setAssetType(AssetType.valueOf(updateAssetRequestDto.assetType()));
        asset.setAssetValue(updateAssetRequestDto.assetValue());

        return assetRepository.save(asset);
    }

    @Transactional(readOnly = true)
    public List<Asset> getAssetsByMemberId(int memberId) {
        return assetRepository.findAllByMemberId(memberId);
    }

    @Transactional
    public void flush() {assetRepository.flush();}
}
