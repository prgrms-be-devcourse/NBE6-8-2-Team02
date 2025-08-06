package com.back.domain.member.controller;

import com.back.domain.member.dto.MemberDeleteResponseDto;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
@Tag(name = "Member", description = "회원 관련 API")
@Slf4j
public class MemberV1Controller {

    private final MemberService memberService;

    // 1. 회원 가입
    @PostMapping("/signup")
    @Operation(summary = "회원가입", description = "새로운 회원을 등록합니다.")
    public ResponseEntity<MemberResponseDto> signUp(@Valid @RequestBody MemberRequestDto requestDto) {
        log.info("회원가입 요청 시작 - 이메일: {}, 이름: {}", requestDto.email(), requestDto.name());
        
        try {
            MemberResponseDto memberResponseDto = memberService.signUp(requestDto);
            log.info("회원가입 성공 - 이메일: {}, 회원ID: {}", requestDto.email(), memberResponseDto.id());
            return ResponseEntity.status(HttpStatus.CREATED).body(memberResponseDto);
        } catch (Exception e) {
            log.error("회원가입 실패 - 이메일: {}, 오류: {}", requestDto.email(), e.getMessage(), e);
            throw e; // GlobalExceptionHandler에서 처리되도록 재throw
        }
    }

    // 4. 회원 정보 수정
    @PutMapping("/{memberId}")
    @Operation(summary = "회원정보 수정", description = "회원 정보를 수정합니다.")
    public ResponseEntity<MemberResponseDto> updateMember(
            @PathVariable int memberId,
            @Valid @RequestBody MemberUpdateDto updateDto) {
        
        // 현재 로그인한 사용자 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("인증되지 않은 사용자입니다.");
        }
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Member currentMember = userDetails.getMember();
        
        // 권한 검증: 본인의 정보만 수정 가능
        if (currentMember.getId() != memberId) {
            throw new IllegalStateException("접근 권한이 없습니다.");
        }
        
        MemberResponseDto response = memberService.updateMember(memberId, updateDto);
        return ResponseEntity.ok(response);
    }

    // 5. 회원 삭제
    @DeleteMapping("/{memberId}")
    @Operation(summary = "회원 삭제", description = "회원 정보를 삭제합니다.")
    public ResponseEntity<MemberDeleteResponseDto> deleteMember(@PathVariable int memberId) {
        
        // 현재 로그인한 사용자 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("인증되지 않은 사용자입니다.");
        }
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Member currentMember = userDetails.getMember();
        
        // 권한 검증: 본인의 정보만 삭제 가능
        if (currentMember.getId() != memberId) {
            throw new IllegalStateException("접근 권한이 없습니다.");
        }
        
        memberService.softDeleteMember(memberId);
        return ResponseEntity.ok(MemberDeleteResponseDto.of(true));
    }



    // 8 . 비밀번호 변경
    @PatchMapping("/{memberId}/password")
    @Operation(summary = "비밀번호 변경", description = "회원의 비밀번호를 변경합니다.")
    public ResponseEntity<MemberResponseDto> changePassword(
            @PathVariable int memberId,
            @RequestBody @Valid MemberPasswordChangeDto passwordChangeDto) {
        
        // 현재 로그인한 사용자 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("인증되지 않은 사용자입니다.");
        }
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Member currentMember = userDetails.getMember();
        
        // 권한 검증: 본인의 비밀번호만 변경 가능
        if (currentMember.getId() != memberId) {
            throw new IllegalStateException("접근 권한이 없습니다.");
        }
        
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
