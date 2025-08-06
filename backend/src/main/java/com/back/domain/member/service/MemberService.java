package com.back.domain.member.service;

import com.back.domain.member.dto.MemberRequestDto;
import com.back.domain.member.dto.MemberResponseDto;
import com.back.domain.member.dto.MemberUpdateDto;
import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;



@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    //일반 서비스//
    public Optional<Member> findById(int id){
        return memberRepository.findById(id);
    }


    // 회원 가입
    @Transactional
    public MemberResponseDto signUp(MemberRequestDto requestDto) {
        log.info("MemberService.signUp 시작 - 이메일: {}", requestDto.email());
        
        try {
            // 이메일 중복 체크
            if (memberRepository.existsByEmailAndIsDeletedFalse(requestDto.email())) {
                log.warn("회원가입 실패: 이미 존재하는 이메일 - {}", requestDto.email());
                throw new NoSuchElementException("이미 존재하는 이메일입니다.");
            }
            log.debug("이메일 중복 체크 통과 - {}", requestDto.email());

            // 비밀번호 암호화
            String encodedPassword = passwordEncoder.encode(requestDto.password());
            log.debug("비밀번호 암호화 완료");

            // 멤버 객체 생성
            Member member = requestDto.toEntity(encodedPassword);
            log.debug("Member 엔티티 생성 완료");
            
            // 데이터베이스 저장
            Member savedMember = memberRepository.save(member);
            log.info("회원가입 성공: ID={}, 이메일={}", savedMember.getId(), savedMember.getEmail());

            return MemberResponseDto.from(savedMember);
        } catch (Exception e) {
            log.error("회원가입 중 오류 발생 - 이메일: {}, 오류: {}", requestDto.email(), e.getMessage(), e);
            throw e;
        }
    }

    // ID로 회원 조회
    public MemberResponseDto getMemberById(int memberId) {
        Member member = memberRepository.findByIdAndNotDeleted(memberId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        return MemberResponseDto.from(member);
    }

    // 이름과 이메일로 회원 조회
    public MemberResponseDto getMemberByEmailAndName(String email, String name) {
        Member member = memberRepository.findByEmailAndName(email, name)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        return MemberResponseDto.from(member);
    }

    // 모든 회원 조회(관리자)
    public List<MemberResponseDto> getAllMembers() {
        List<Member> members = memberRepository.findAllActive();
        return members.stream()
                .map(MemberResponseDto::from)
                .collect(Collectors.toList());
    }

    // 회원 정보 수정
    @Transactional
    public MemberResponseDto updateMember(int memberId, MemberUpdateDto updateDto) {
        Member member = memberRepository.findByIdAndNotDeleted(memberId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        member.updateProfile(updateDto.name(), updateDto.phoneNumber());

        return MemberResponseDto.from(member);
    }

    // 비밀번호 변경
    @Transactional
    public MemberResponseDto changePassword(int memberId, String newPassword, String currentPassword) {
        Member member = memberRepository.findByIdAndNotDeleted(memberId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        // 현재 비밀번호 검증
        if (!passwordEncoder.matches(currentPassword, member.getPassword())) {
            throw new NoSuchElementException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(newPassword);
        member.changePassword(encodedPassword);

        return MemberResponseDto.from(member);
    }

    // 회원 탈퇴
    @Transactional
    public void deleteMember(int memberId) {
        Member member = memberRepository.findByIdAndNotDeleted(memberId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        memberRepository.delete(member);
    }

    // 회원 소프트 삭제 (관리자 기능)
    @Transactional
    public void softDeleteMember(int memberId) {
        Member member = memberRepository.findByIdAndNotDeleted(memberId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        member.softDelete();
        memberRepository.save(member);
    }

    // 회원 비활성화 (관리자 기능)
    @Transactional
    public MemberResponseDto deactivateMember(int memberId) {
        Member member = memberRepository.findByIdAndNotDeleted(memberId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        member.deactivate(); // 비활성화 메서드 호출

        return MemberResponseDto.from(member);
    }

    // 회원 활성화 (관리자 기능)
    @Transactional
    public MemberResponseDto activateMember(int memberId) {
        Member member = memberRepository.findByIdAndNotDeleted(memberId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        member.activate(); // 활성화 메서드 호출

        return MemberResponseDto.from(member);
    }

    // 활성화된 회원 목록 조회 (관리자 기능)
    public List<MemberResponseDto> getActiveMembers() {
        List<Member> activeMembers = memberRepository.findByIsActiveTrue();
        return activeMembers.stream()
                .map(MemberResponseDto::from)
                .collect(Collectors.toList());
    }

    // 이메일 중복 검사
    public boolean isEmailDuplicate(String email) {
        return memberRepository.existsByEmailAndIsDeletedFalse(email);
    }
}