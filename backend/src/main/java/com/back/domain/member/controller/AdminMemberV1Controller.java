package com.back.domain.member.controller;

import com.back.domain.member.dto.AdminMemberDto;
import com.back.domain.member.dto.MemberResponseDto;
import com.back.domain.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/members")
@PreAuthorize("hasRole('ADMIN')")  // 클래스 레벨 권한 설정!
@Slf4j
@Tag(name = "Admin Member", description = "관리자 회원 관리 API")
public class AdminMemberV1Controller {

    private final MemberService memberService;

    // 전체 회원 조회 (개인정보 마스킹)
    @GetMapping
    @Operation(summary = "전체회원 조회", description = "전체 회원 정보를 조회합니다.")
    public ResponseEntity<List<AdminMemberDto>> getAllMembers() {
        List<MemberResponseDto> members = memberService.getAllMembers();
        List<AdminMemberDto> adminMemberDtos = members.stream()
                .map(this::convertToAdminDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(adminMemberDtos);
    }

    // 특정 회원 조회 (개인정보 마스킹)
    @GetMapping("/{memberId}")
    @Operation(summary = "회원ID 조회", description = "회원 ID로 회원 정보를 조회합니다.")
    public ResponseEntity<AdminMemberDto> getMember(@PathVariable int memberId) {
        MemberResponseDto memberDto = memberService.getMemberById(memberId);
        AdminMemberDto adminMemberDto = convertToAdminDto(memberDto);
        return ResponseEntity.ok(adminMemberDto);
    }

    // 회원 활성화
    @PatchMapping("/{memberId}/activate")
    @Operation(summary = "회원 활성화", description = "회원의 활성 상태를 활성으로 변경합니다.")
    public ResponseEntity<MemberResponseDto> activateMember(@PathVariable int memberId) {
        MemberResponseDto response = memberService.activateMember(memberId);
        log.info("관리자가 회원 {}를 활성화했습니다.", memberId);
        return ResponseEntity.ok(response);
    }

    // 회원 비활성화
    @PatchMapping("/{memberId}/deactivate")
    @Operation(summary = "회원 비활성화", description = "회원의 활성 상태를 비활성으로 변경합니다.")
    public ResponseEntity<MemberResponseDto> deactivateMember(@PathVariable int memberId) {
        MemberResponseDto response = memberService.deactivateMember(memberId);
        log.info("관리자가 회원 {}를 비활성화했습니다.", memberId);
        return ResponseEntity.ok(response);
    }

    // 활성 회원 목록 조회
    @GetMapping("/active")
    @Operation(summary = "활성화된 회원 조회", description = "활성화된 회원 목록을 조회합니다.")
    public ResponseEntity<List<AdminMemberDto>> getActiveMembers() {
        List<MemberResponseDto> activeMembers = memberService.getActiveMembers();
        List<AdminMemberDto> adminMemberDtos = activeMembers.stream()
                .map(this::convertToAdminDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(adminMemberDtos);
    }

    // 회원 검색
    @GetMapping("/search")
    @Operation(summary = "회원 검색", description = "이메일과 이름으로 회원을 검색합니다.")
    public ResponseEntity<AdminMemberDto> searchMember(
            @RequestParam String email,
            @RequestParam String name) {
        MemberResponseDto memberDto = memberService.getMemberByEmailAndName(email, name);
        AdminMemberDto adminMemberDto = convertToAdminDto(memberDto);
        return ResponseEntity.ok(adminMemberDto);
    }

    // MemberResponseDto를 AdminMemberDto로 변환하는 헬퍼 메서드
    private AdminMemberDto convertToAdminDto(MemberResponseDto memberDto) {
        return AdminMemberDto.builder()
                .id(memberDto.id())
                .maskedEmail(maskEmail(memberDto.email()))
                .maskedName(maskName(memberDto.name()))
                .maskedPhone(maskPhone(memberDto.phoneNumber()))
                .status(memberDto.isActive() ? "ACTIVE" : "INACTIVE")
                .createdAt(memberDto.createdAt())
                .updatedAt(memberDto.updatedAt())
                .build();
    }

    // 마스킹 메서드 재정의 (AdminMemberDto의 private 메서드와 동일하게 사용)
    private String maskEmail(String email) {
        if (email == null || email.length() < 3) return "***";
        int atIndex = email.indexOf('@');
        if (atIndex <= 1) return "***" + email.substring(atIndex);
        return email.charAt(0) + "***" + email.substring(atIndex);
    }

    private String maskName(String name) {
        if (name == null || name.length() < 2) return "**";
        return name.charAt(0) + "*".repeat(name.length() - 1);
    }

    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 8) return "***-****-****";
        if (phone.contains("-")) {
            String[] parts = phone.split("-");
            if (parts.length == 3) {
                return parts[0] + "-****-" + parts[2];
            }
        }
        return "***-****-****";
    }

}
