package com.back.domain.notices.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Integer> {
    
    // 활성화된 공지사항만 조회
    List<Notice> findByStatusOrderByCreateDateDesc(Notice.NoticeStatus status);
    
    // 특정 작성자의 공지사항 조회
    List<Notice> findByMember_IdOrderByCreateDateDesc(int memberId);
    
    // 제목으로 검색
    List<Notice> findByTitleContainingIgnoreCaseOrderByCreateDateDesc(String title);
    
    // 내용으로 검색
    List<Notice> findByContentContainingIgnoreCaseOrderByCreateDateDesc(String content);
    
    // 조회수 높은 순으로 조회
    @Query("SELECT n FROM Notice n WHERE n.status = :status ORDER BY n.views DESC")
    List<Notice> findTopViewedNotices(@Param("status") Notice.NoticeStatus status);
} 