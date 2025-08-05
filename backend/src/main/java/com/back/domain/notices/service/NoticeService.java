package com.back.domain.notices.service;

// 여기에 필요한 import들을 추가하세요
import com.back.domain.notices.repository.NoticeRepository;
import com.back.domain.notices.dto.CreateNoticeRequestDto;
import com.back.domain.notices.dto.NoticeResponseDto;
import com.back.domain.notices.entity.Notice;
import com.back.domain.member.entity.Member;
import com.back.domain.member.entity.Member.MemberRole;
import com.back.domain.notices.dto.UpdateNoticeRequestDto;
import com.back.domain.notices.dto.DeleteNoticeRequestDto;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NoticeService {
    private final NoticeRepository noticeRepository;

    public NoticeResponseDto createNotice(CreateNoticeRequestDto dto, Member member) {
        // 관리자 권한 확인
        if (member.getRole() != MemberRole.ADMIN) {
            throw new IllegalArgumentException("관리자만 공지사항을 생성할 수 있습니다.");
        }

        // Notice 엔티티 생성
        Notice notice = Notice.builder()
                .member(member)
                .title(dto.title())
                .content(dto.content())
                .fileUrl(dto.fileUrl())
                .views(0)
                .build();

        // 저장
        Notice savedNotice = noticeRepository.save(notice);

        // NoticeResponseDto로 변환하여 반환
        return NoticeResponseDto.from(savedNotice);
    }

    public List<NoticeResponseDto> getAllNotices() {
        List<Notice> notices = noticeRepository.findAll();
        return notices.stream()
                .map(NoticeResponseDto::from)
                .collect(Collectors.toList());
    }

    public NoticeResponseDto getNoticeById(int id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));
        notice.incrementViews();
        noticeRepository.save(notice);
        return NoticeResponseDto.from(notice);
    }

    public NoticeResponseDto updateNotice(int id, UpdateNoticeRequestDto dto, Member member) {
        // 1. 공지사항 존재 확인
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));

        // 2. 관리자 권한 확인
        if (member.getRole() != MemberRole.ADMIN) {
            throw new IllegalArgumentException("관리자만 공지사항을 수정할 수 있습니다.");
        }

        // 3. 엔티티 업데이트 (null이 아닌 경우에만 업데이트)
        if (dto.title() != null) {
            notice.setTitle(dto.title());
        }
        if (dto.content() != null) {
            notice.setContent(dto.content());
        }
        if (dto.fileUrl() != null) {
            notice.setFileUrl(dto.fileUrl());
        }

        // 4. 데이터베이스에 저장
        Notice updatedNotice = noticeRepository.save(notice);

        // 5. DTO로 변환하여 반환
        return NoticeResponseDto.from(updatedNotice);
    }

    public void deleteNotice(DeleteNoticeRequestDto dto, Member member) {
        // 1. 공지사항 존재 확인
        Notice notice = noticeRepository.findById(dto.id())
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));

        // 2. 관리자 권한 확인
        if (member.getRole() != MemberRole.ADMIN) {
            throw new IllegalArgumentException("관리자만 공지사항을 삭제할 수 있습니다.");
        }

        // 3. 데이터베이스에서 삭제
        noticeRepository.delete(notice);
    }    
} 