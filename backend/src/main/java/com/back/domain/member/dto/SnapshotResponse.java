package com.back.domain.member.dto;

import lombok.Builder;

@Builder
public record SnapshotResponse(
        int year,
        int month,
        Long totalAsset
) {}