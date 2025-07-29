package com.back.domain.member.repository;

import com.back.domain.member.entity.Snapshot;
import com.back.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SnapshotRepository extends JpaRepository<Snapshot, Integer> {
    boolean existsByMemberAndYearAndMonth(Member member, int year, int month);
    Optional<Snapshot> findByMemberAndYearAndMonth(Member member, int year, int month);
    List<Snapshot> findByMemberOrderByYearAscMonthAsc(Member member);
    List<Snapshot> findByMemberOrderByYearDescMonthDesc(Member member);
}
