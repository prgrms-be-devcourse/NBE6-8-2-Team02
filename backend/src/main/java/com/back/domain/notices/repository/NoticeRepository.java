package com.back.domain.notices.repository;

import com.back.domain.notices.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Integer> {
    
    
} 