package com.back.domain.notices.repository;

import com.back.domain.notices.entity.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NoticeRepository extends JpaRepository<Notice, Integer> {
    // 제목에만 검색어가 포함된 공지사항 조회 (페이징 적용)
    @Query("SELECT n FROM Notice n WHERE LOWER(n.title) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Notice> findByTitleContainingIgnoreCase(@Param("search") String search, Pageable pageable);
}