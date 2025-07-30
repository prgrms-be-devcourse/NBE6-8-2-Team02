package com.back.domain.member.controller;

import com.back.domain.member.dto.SnapshotResponse;
import com.back.domain.member.entity.Member;
import com.back.domain.member.service.SnapshotService;
import com.back.domain.member.service.MemberService;
import com.back.global.rsData.RsData;
import com.back.global.security.jwt.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/snapshot")
@RequiredArgsConstructor
public class SnapshotController {
    private final SnapshotService snapshotService;
    private final MemberService memberService;

    @PostMapping("/save")
    public RsData<?> saveSnapshot(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestParam Long totalAsset) {
        Member member = Optional.ofNullable(userDetails.getMember())
                .orElseThrow(() -> new IllegalStateException("인증된 사용자 정보가 없습니다."));

        snapshotService.saveMonthlySnapshot(member, totalAsset);
        return new RsData<>("200-1", "스냅샷을 저장했습니다.", totalAsset);
    }

    @GetMapping()
    public RsData<List<SnapshotResponse>> getSnapshots(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Member member = Optional.ofNullable(userDetails.getMember())
                .orElseThrow(() -> new IllegalStateException("인증된 사용자 정보가 없습니다."));

        List<SnapshotResponse> snapshots = snapshotService.getSnapshots(member);
        return new RsData<>("200-1", "스냅샷을 정상적으로 불러왔습니다.", snapshots);
    }
}
