package com.back.domain.member.repository;

import com.back.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Integer> {

    // 이메일로 회원 찾기
    Optional<Member> findByEmail(String email);
    
    // 이메일 중복 체크
    boolean existsByEmail(String email);

    // 회원 활성화 상태 조회
    List<Member> findByIsActiveTrue();

    // 이메일과 이름으로 찾기
    Optional<Member> findByEmailAndName(String email, String name);


}
