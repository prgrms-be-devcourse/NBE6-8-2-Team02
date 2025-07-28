package com.back.domain.member.service;

import com.back.domain.member.dto.MemberRequestDto;
import com.back.domain.member.dto.MemberResponseDto;
import com.back.domain.member.dto.MemberUpdateDto;
import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
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
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    //일반 서비스//
    public Optional<Member> findById(int id){
        return memberRepository.findById(id);
    }

    // 회원 가입
    // 회원 가입
    @Transactional
    public MemberResponseDto signUp(MemberRequestDto requestDto) {

        if (memberRepository.existsByEmail(requestDto.email())) {
            throw new NoSuchElementException("이미 존재하는 이메일입니다.");
        }

        // 비밀번호 암호화 추가
        String encodedPassword = passwordEncoder.encode(requestDto.password());

        // 멤버 객체 생성
        Member member = requestDto.toEntity(encodedPassword);
        Member savedMember = memberRepository.save(member);

        return MemberResponseDto.from(savedMember);
    }

    // ID로 회원 조회
    public MemberResponseDto getMemberById(int memberId) {
        Member member = memberRepository.findById(memberId)
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
        List<Member> members = memberRepository.findAll();
        return members.stream()
                .map(MemberResponseDto::from)
                .collect(Collectors.toList());
    }

    // 회원 정보 수정
    @Transactional
    public MemberResponseDto updateMember(int memberId, MemberUpdateDto updateDto) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        member.updateProfile(updateDto.name(), updateDto.phoneNumber());

        return MemberResponseDto.from(member);
    }

    // 비밀번호 변경
    @Transactional
    public MemberResponseDto changePassword(int memberId, String newPassword) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(newPassword);
        member.changePassword(encodedPassword);

        return MemberResponseDto.from(member);
    }

    // 회원 탈퇴
    @Transactional
    public void deleteMember(int memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        memberRepository.delete(member);
    }

    // 회원 비활성화 (관리자 기능)
    @Transactional
    public MemberResponseDto deactivateMember(int memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        member.deactivate(); // 비활성화 메서드 호출

        return MemberResponseDto.from(member);
    }

    // 회원 활성화 (관리자 기능)
    @Transactional
    public MemberResponseDto activateMember(int memberId) {
        Member member = memberRepository.findById(memberId)
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
        return memberRepository.existsByEmail(email);
    }
}