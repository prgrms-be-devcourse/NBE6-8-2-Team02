package com.back.domain.member.repository;

import com.back.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    // 이름과 전화번호로 찾기 (계정 찾기용)
    Optional<Member> findByNameAndPhoneNumber(String name, String phoneNumber);

    // 이메일, 이름, 전화번호로 찾기 (비밀번호 재설정용)
    Optional<Member> findByEmailAndNameAndPhoneNumber(String email, String name, String phoneNumber);

    // 비활성화된 회원 제외하고 모든 회원 조회
    @Query("SELECT m FROM Member m WHERE m.isDeleted = false")
    List<Member> findAllActive();

    // 이메일로 회원 찾기 (소프트 삭제된 회원 제외)
    @Query("SELECT m FROM Member m WHERE m.email = :email AND m.isDeleted = false")
    Optional<Member> findByEmailAndNotDeleted(@Param("email") String email);

    // ID로 회원 찾기 (소프트 삭제된 회원 제외)
    @Query("SELECT m FROM Member m WHERE m.id = :id AND m.isDeleted = false")
    Optional<Member> findByIdAndNotDeleted(@Param("id") Integer id);

    //이름과 전화번호로 찾기 (소프트 삭제된 회원 제외)
    @Query("SELECT m FROM Member m WHERE m.name = :name AND m.phoneNumber = :phoneNumber AND m.isDeleted = false")
    Optional<Member> findByNameAndPhoneNumberAndNotDeleted(@Param("name") String name, @Param("phoneNumber") String phoneNumber);

    // 이메일, 이름, 전화번호로 찾기 (소프트 삭제된 회원 제외)
    @Query("SELECT m FROM Member m WHERE m.email = :email AND m.name = :name AND m.phoneNumber = :phoneNumber AND m.isDeleted = false")
    Optional<Member> findByEmailAndNameAndPhoneNumberAndNotDeleted(@Param("email") String email, @Param("name") String name, @Param("phoneNumber") String phoneNumber);

    // 이메일로 회원 존재 여부 확인 (소프트 삭제된 회원 제외)
    boolean existsByEmailAndIsDeletedFalse(String email);

}
