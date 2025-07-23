package com.back.domain.member.repository;

import com.back.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Integer> {

    // 회원 가입 시 이메일 중복 체크
    Optional<Member> findByEmail(String email);
    boolean existsByEmail(String email);

    // 회원 활성화 상태 조회
    List<Member> findByIsActiveTrue();
    List<Member> findByIsActiveFalse();

    // 이메일과 이름으로 찾기
    Optional<Member> findByEmailAndName(String email, String name);


    String name(String name);
}
