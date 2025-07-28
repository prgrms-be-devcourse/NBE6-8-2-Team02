package com.back.domain.member.service;

import com.back.domain.member.dto.SnapshotResponse;
import com.back.domain.member.entity.Snapshot;
import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.SnapshotRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SnapshotService {

    private final SnapshotRepository snapshotRepository;

    @Transactional
    public void saveMonthlySnapshot(Member member, int totalAsset) {
        YearMonth now = YearMonth.now();

        boolean exists = snapshotRepository.existsByMemberAndYearAndMonth(
                member, now.getYear(), now.getMonthValue()
        );
        if (exists) return;

        Snapshot snapshot = Snapshot.builder()
                .member(member)
                .year(now.getYear())
                .month(now.getMonthValue())
                .totalAsset(totalAsset)
                .build();

        snapshotRepository.save(snapshot);

        // 6개월 초과 삭제
        List<Snapshot> snapshots = snapshotRepository.findByMemberOrderByYearAscMonthAsc(member);
        if (snapshots.size() > 6) {
            List<Snapshot> toDelete = snapshots.subList(0, snapshots.size() - 6);
            snapshotRepository.deleteAll(toDelete);
        }
    }

    public List<SnapshotResponse> getSnapshots(Member member) {
        return snapshotRepository.findByMemberOrderByYearAscMonthAsc(member).stream()
                .map(s -> SnapshotResponse.builder()
                        .year(s.getYear())
                        .month(s.getMonth())
                        .totalAsset(s.getTotalAsset())
                        .build())
                .collect(Collectors.toList());
    }

    public long count() {return snapshotRepository.count();}
    public Optional<Snapshot> findById(int id) {return snapshotRepository.findById(id);}
    public List<Snapshot> findAll() {return snapshotRepository.findAll();}
}
