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

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    // 1. 회원 가입
    @Transactional
    public MemberResponseDto signUp(MemberRequestDto requestDto) {
        // 이메일 중복 확인
        if (memberRepository.existsByEmail(requestDto.email())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        String encodedPassword = passwordEncoder.encode(requestDto.password());

        Member member = requestDto.toEntity();
        Member savedMember = memberRepository.save(member);
        return new MemberResponseDto.from(savedMember);
    }

    // 2. 회원 정보 조회
    public MemberResponseDto getMemberById(int memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        return new MemberResponseDto(member);
    }

    // 3. 회원 정보 수정
    @Transactional
    public MemberResponseDto updateMemberProfile(int memberId, MemberUpdateDto updateDto) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new NoSuchElementException("해당 회원을 찾을 수 없습니다."));

        member.updateProfile(updateDto.name(), updateDto.phoneNumber());

        return new MemberResponseDto(member);
    }

    // 4. 회원 탈퇴
    @Transactional
    public void deleteMember(int memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new NoSuchElementException("해당 회원을 찾을 수 없습니다."));
        memberRepository.delete(member);
    }

}
