package com.back.domain.member.controller;

import com.back.domain.member.dto.SnapshotResponse;
import com.back.domain.member.entity.Member;
import com.back.domain.member.service.SnapshotService;
import com.back.domain.member.service.MemberService;
import com.back.global.rsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/v1/snapshot")
@RequiredArgsConstructor
public class SnapshotController {
    private final SnapshotService snapshotService;
    private final MemberService memberService;

    @PostMapping("/save/{memberId}")
    public RsData<?> saveSnapshot(@PathVariable int memberId, @RequestParam Long totalAsset) {
        Member member = memberService.findById(memberId)
                .orElseThrow(() -> new NoSuchElementException("해당 id의 사용자가 없습니다." + memberId));

        snapshotService.saveMonthlySnapshot(member, totalAsset);
        return new RsData<>("200-1", "스냅샷을 저장했습니다.", totalAsset);
    }

    @GetMapping("/{memberId}")
    public RsData<List<SnapshotResponse>> getSnapshots(@PathVariable int memberId) {
        Member member = memberService.findById(memberId)
                .orElseThrow(() -> new NoSuchElementException("해당 id의 사용자가 없습니다." + memberId));

        List<SnapshotResponse> snapshots = snapshotService.getSnapshots(member);
        return new RsData<>("200-1", "스냅샷을 정상적으로 불러왔습니다.", snapshots);
    }
}
