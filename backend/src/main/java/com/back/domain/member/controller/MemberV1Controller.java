package com.back.domain.member.controller;

import com.back.domain.member.dto.MemberPasswordChangeDto;
import com.back.domain.member.dto.MemberRequestDto;
import com.back.domain.member.dto.MemberResponseDto;
import com.back.domain.member.dto.MemberUpdateDto;
import com.back.domain.member.entity.Member;
import com.back.domain.member.service.MemberService;
import com.back.global.security.jwt.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    // 8 . 비밀번호 변경
    @PatchMapping("/{memberId}/password")
    @Operation(summary = "비밀번호 변경", description = "회원의 비밀번호를 변경합니다.")
    public ResponseEntity<MemberResponseDto> changePassword(
            @PathVariable int memberId,
            @RequestBody @Valid MemberPasswordChangeDto passwordChangeDto) {
        MemberResponseDto response = memberService.changePassword(
                memberId,
                passwordChangeDto.newPassword(),
                passwordChangeDto.currentPassword());

        return ResponseEntity.ok(response);
    }

    // 9. 이메일 중복 검사
    @GetMapping("/check-email")
    @Operation(summary = "이메일 중복 검사", description = "이메일 중복 여부를 확인합니다.")
    public ResponseEntity<Boolean> checkEmailDuplicate(@RequestParam String email) {
        boolean isDuplicate = memberService.isEmailDuplicate(email);
        return ResponseEntity.ok(isDuplicate);
    }

    // 10. 활성화된 회원 목록 조회
    @GetMapping("/active")
    @Operation(summary = "활성화된 회원 조회", description = "활성화된 회원 목록을 조회합니다.")
    public ResponseEntity<List<MemberResponseDto>> getActiveMembers() {
        List<MemberResponseDto> response = memberService.getActiveMembers();
        return ResponseEntity.ok(response);
    }

    // 11. 이메일과 이름으로 회원 조회
    @GetMapping("/search/{email}/{name}")
    @Operation(summary = "이메일과 이름으로 회원 조회", description = "이메일과 이름으로 회원을 조회합니다.")
    public ResponseEntity<MemberResponseDto> getMemberByEmailAndNamePath(
            @PathVariable String email,
            @PathVariable String name) {
        MemberResponseDto response = memberService.getMemberByEmailAndName(email, name);
        return ResponseEntity.ok(response);
    }

    // 12. 현재 로그인된 사용자 정보 조회
    @GetMapping("/me")
    @Operation(summary = "현재 사용자 조회", description = "현재 로그인된 사용자의 정보를 조회합니다.")
    public ResponseEntity<MemberResponseDto> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("인증되지 않은 사용자입니다.");
        }

        //CustomUserDetails에서 Member 엔티티를 가지고 옴
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Member currentMember = userDetails.getMember();

        // DTO로 변환하여 반환
        MemberResponseDto response = MemberResponseDto.from(currentMember);
        return ResponseEntity.ok(response);
    }

}
