package com.back.domain.transactions.service;

import com.back.domain.asset.entity.Asset;
import com.back.domain.asset.repository.AssetRepository;
import com.back.domain.transactions.Dto.CreateTransactionRequestDto;
import com.back.domain.transactions.entity.Transaction;
import com.back.domain.transactions.entity.TransactionType;
import com.back.domain.transactions.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class TransactionServiceTest {

    @Test
    void createTransaction_정상_생성() {
        // 1. 가짜(모킹) 객체 준비
        TransactionRepository transactionRepository = Mockito.mock(TransactionRepository.class);
        AssetRepository assetRepository = Mockito.mock(AssetRepository.class);

        // 2. 테스트용 서비스 생성
        TransactionService transactionService = new TransactionService(transactionRepository, assetRepository);

        // 3. 테스트용 데이터 준비
        Asset asset = Asset.builder().build();
        // 테스트에서는 리플렉션을 사용해 id 값을 강제로 세팅할 수 있습니다.
        try {
            java.lang.reflect.Field idField = asset.getClass().getSuperclass().getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(asset, 1);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        CreateTransactionRequestDto dto = new CreateTransactionRequestDto(1, "DEPOSIT", 1000, "테스트", "2024-07-23T15:00:00");

        // 4. 가짜 동작 정의
        when(assetRepository.findById(1)).thenReturn(Optional.of(asset));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // 5. 테스트 실행
        Transaction result = transactionService.createTransaction(dto);

        // 6. 결과 검증
        assertThat(result.getAsset().getId()).isEqualTo(1);
        assertThat(result.getType()).isEqualTo(TransactionType.DEPOSIT);
        assertThat(result.getAmount()).isEqualTo(1000);
        assertThat(result.getContent()).isEqualTo("테스트");
        assertThat(result.getDate()).isEqualTo(LocalDateTime.parse("2024-07-23T15:00:00"));
    }
} 