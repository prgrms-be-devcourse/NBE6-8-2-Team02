
package com.back.global.security.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class RateLimitService {

    private static final int MAX_ATTEMPTS = 10;
    private static final int RESET_TIME = 30;

    // IP 주소별 시도 횟수와 마지막 시도 시간을 저장
    private final ConcurrentHashMap<String, AttemptInfo> attemptMap = new ConcurrentHashMap<>();


    public boolean isAllowed(String ipAddress) {
        AttemptInfo info = attemptMap.get(ipAddress);

        if (info == null) {
            return true;
        }

        // 30분이 지났으면 초기화
        if (info.lastAttempt.isBefore(LocalDateTime.now().minusHours(RESET_TIME))) {
            attemptMap.remove(ipAddress);
            return true;
        }

        return info.attemptCount < MAX_ATTEMPTS;
    }

    // IP 주소로 시도 횟수를 기록
    // 시도 횟수가 최대치를 초과하면 false를 반환
    public void recordAttempt(String ipAddress) {
        AttemptInfo info = attemptMap.get(ipAddress);

        if (info == null) {
            attemptMap.put(ipAddress, new AttemptInfo(1, LocalDateTime.now()));
        } else {
            // 30분이 지났으면 초기화
            if (info.lastAttempt.isBefore(LocalDateTime.now().minusHours(RESET_TIME))) {
                attemptMap.put(ipAddress, new AttemptInfo(1, LocalDateTime.now()));
            } else {
                info.attemptCount++;
                info.lastAttempt = LocalDateTime.now();
            }
        }

        log.warn("Rate limit attempt recorded for IP: {} (attempts: {})",
                ipAddress, attemptMap.get(ipAddress).attemptCount);
    }

    // IP 주소로 남은 시도 횟수를 반환
    // 30분이 지난 경우 최대 시도 횟수를 반환
    public int getRemainingAttempts(String ipAddress) {
        AttemptInfo info = attemptMap.get(ipAddress);
        if (info == null) {
            return MAX_ATTEMPTS;
        }

        // 30분이 지났으면 초기화
        if (info.lastAttempt.isBefore(LocalDateTime.now().minusHours(RESET_TIME))) {
            return MAX_ATTEMPTS;
        }

        return Math.max(0, MAX_ATTEMPTS - info.attemptCount);
    }

    private static class AttemptInfo {
        int attemptCount;
        LocalDateTime lastAttempt;

        AttemptInfo(int attemptCount, LocalDateTime lastAttempt) {
            this.attemptCount = attemptCount;
            this.lastAttempt = lastAttempt;
        }
    }
}
