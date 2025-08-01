package com.back.global.security.service;

import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.MemberRepository;
import com.back.global.security.jwt.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Member member = memberRepository.findByEmailAndNotDeleted(email)
         .orElseThrow(() -> new UsernameNotFoundException("해당 이메일을 가진 회원이 존재하지 않습니다."));

        if (!member.isActive()) {
            throw new UsernameNotFoundException("비활성화된 계정입니다: " + email);
        }

        return new CustomUserDetails(member);
    }
}
