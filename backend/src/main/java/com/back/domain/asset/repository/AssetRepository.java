package com.back.domain.asset.repository;

import com.back.domain.asset.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AssetRepository extends JpaRepository<Asset, Integer> {
    List<Asset> findAllByStatusTrue();
    List<Asset> findAllByStatusTrueAndMemberId(int memberId);
    long countAllByStatusTrue();

    Optional<Asset> findByIdAndStatusTrue(int id);

    /*
        dirty checking, flush 과정을 거치지 않는 직접 쿼리
        대규모 DB 에서의 속도 보장
     */
    @Modifying
    @Query("UPDATE Asset a SET a.status = false WHERE a.id = :id")
    void softDeleteById(@Param("id") int id);

    List<Asset> findAllByMemberId(int memberId);
}
