package com.back.domain.notices.controller;

import com.back.domain.notices.dto.CreateNoticeRequestDto;
import com.back.domain.notices.dto.DeleteNoticeRequestDto;
import com.back.domain.notices.dto.NoticeResponseDto;
import com.back.domain.notices.dto.UpdateNoticeRequestDto;
import com.back.domain.notices.service.NoticeService;
import com.back.global.rsData.RsData;
import com.back.global.security.jwt.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/v1/notices")
@RequiredArgsConstructor
@Tag(name = "NoticeController", description = "공지사항 컨트롤러")
public class ApiV1NoticeController {
    private final NoticeService noticeService;

    @GetMapping
    @Operation(summary = "공지사항 전체 조회 (검색 기능 + 페이징 포함)")
    public RsData<Page<NoticeResponseDto>> getAllNotices(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<NoticeResponseDto> notices = noticeService.getAllNotices(search, pageable);

        return new RsData<>(
                "200-1",
                "공지사항 목록을 조회했습니다.",
                notices
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "공지사항 단건 조회")
    public RsData<NoticeResponseDto> getNoticeById(@PathVariable int id) {
        NoticeResponseDto notice = noticeService.getNoticeById(id);

        return new RsData<>(
                "200-1",
                "공지사항을 조회했습니다.",
                notice
        );
    }

    @PostMapping
    @Operation(summary = "공지사항 생성")
    public RsData<NoticeResponseDto> createNotice(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateNoticeRequestDto reqBody) {

        NoticeResponseDto notice = noticeService.createNotice(reqBody, userDetails.getMember());

        return new RsData<>(
                "201-1",
                "공지사항이 생성되었습니다.",
                notice
        );
    }

    @PutMapping("/{id}")
    @Operation(summary = "공지사항 수정")
    public RsData<NoticeResponseDto> updateNotice(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable int id,
            @Valid @RequestBody UpdateNoticeRequestDto reqBody) {

        NoticeResponseDto notice = noticeService.updateNotice(id, reqBody, userDetails.getMember());

        return new RsData<>(
                "200-1",
                "공지사항이 수정되었습니다.",
                notice
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "공지사항 삭제")
    public RsData<String> deleteNotice(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable int id) {

        DeleteNoticeRequestDto dto = new DeleteNoticeRequestDto(id);
        noticeService.deleteNotice(dto, userDetails.getMember());

        return new RsData<>(
                "200-1",
                "공지사항이 삭제되었습니다.",
                null
        );
    }
} 