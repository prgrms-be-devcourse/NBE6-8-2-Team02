package com.back.domain.asset.repository;

import com.back.domain.asset.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Integer> {
    List<Asset> findAllByMemberId(int memberId);
}
