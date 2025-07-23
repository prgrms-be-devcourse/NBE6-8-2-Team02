package com.back.domain.member.controller;

import com.back.domain.member.dto.MemberRequestDto;
import com.back.domain.member.dto.MemberResponseDto;
import com.back.domain.member.dto.MemberUpdateDto;
import com.back.domain.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
@Tag(name = "Member", description = "회원 관련 API")
public class MemberV1Controller {

    private final MemberService memberService;

    // 1. 회원 가입
    @PostMapping("/signup")
    @Operation(summary = "회원가입", description = "새로운 회원을 등록합니다.")
    public ResponseEntity<MemberResponseDto> signUp(@Valid @RequestBody MemberRequestDto requestDto) {
        MemberResponseDto memberResponseDto = memberService.signUp(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(memberResponseDto);
    }

    // 2. 회원 ID 조회
    @GetMapping("/{memberId}")
    @Operation(summary = "회원ID 조회", description = "회원 ID로 회원 정보를 조회합니다.")
    public ResponseEntity<MemberResponseDto> getmember(@PathVariable int memberId) {
        MemberResponseDto memberResponseDto = memberService.getMemberById(memberId);
        return ResponseEntity.ok(memberResponseDto);
    }

    // 3. 전체 회원 조회
    @GetMapping
    @Operation(summary = "전체회원 조회", description = "전체 회원 정보를 조회합니다.")
    public ResponseEntity<List<MemberResponseDto>> getAllMembers() {
        List<MemberResponseDto> response = memberService.getAllMembers();
        return ResponseEntity.ok(response);
    }

    // 4. 회원 정보 수정
    @PutMapping("/{memberId}")
    @Operation(summary = "회원정보 수정", description = "회원 정보를 수정합니다.")
    public ResponseEntity<MemberResponseDto> updateMember(
            @PathVariable int memberId,
            @Valid @RequestBody MemberUpdateDto updateDto) {
        MemberResponseDto response = memberService.updateMember(memberId, updateDto);
        return ResponseEntity.ok(response);
    }

    // 5. 회원 삭제
    @DeleteMapping("/{memberId}")
    @Operation(summary = "회원 삭제", description = "회원 정보를 삭제합니다.")
    public ResponseEntity<Void> deleteMember(@PathVariable int memberId) {
        memberService.deleteMember(memberId);
        return ResponseEntity.noContent().build();
    }

    // 6. 회원 비활성화
    @PatchMapping("/{memberId}/deactivate")
    @Operation(summary = "회원 비활성화", description = "회원의 활성 상태를 비활성으로 변경합니다.")
    public ResponseEntity<MemberResponseDto> deactivateMember(@PathVariable int memberId) {
        MemberResponseDto response = memberService.deactivateMember(memberId);
        return ResponseEntity.ok(response);
    }

    // 7. 회원 활성화
    @PatchMapping("/{memberId}/activate")
    @Operation(summary = "회원 활성화", description = "회원의 활성 상태를 활성으로 변경합니다.")
    public ResponseEntity<MemberResponseDto> activateMember(@PathVariable int memberId) {
        MemberResponseDto response = memberService.activateMember(memberId);
        return ResponseEntity.ok(response);
    }
}
