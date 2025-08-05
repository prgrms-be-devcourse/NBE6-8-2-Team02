package com.back.global.aop;

import com.back.global.security.jwt.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Component;

import java.lang.annotation.Annotation;
import java.lang.reflect.Parameter;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Pointcut("execution(* com.back.domain.account.controller..*(..))")
    public void accountControllerMethods(){}

    @Before("accountControllerMethods()")
    public void logBefore(JoinPoint joinPoint) {
        System.out.println("===AOP 작동됨===");
        //메서드 이름
        String methodName=joinPoint.getSignature().toShortString(); //JoinPoint: 현재 실행 중인 메서드 정보 객체

        StringBuilder logMessage = new StringBuilder("\n요청: ").append(methodName);

        //메서드 파라미터에서 CustomUserDetails 추출
        Object[] args = joinPoint.getArgs();
        MethodSignature methodSignature=(MethodSignature) joinPoint.getSignature(); //MethodSignature : 메서드 이름, 파라미터 등 메서드 정보 가져옴
        Parameter[] parameters=methodSignature.getMethod().getParameters();

        for(int i=0;i<parameters.length;i++){
            Parameter parameter=parameters[i];
            Object arg = args[i];

            //@AuthenticationPrincipal이 붙은 파라미터인지 확인
            for(Annotation annotation:parameter.getAnnotations()){
                if (annotation.annotationType().equals(AuthenticationPrincipal.class) && arg instanceof CustomUserDetails userDetails) {
                    logMessage.append("\n사용자:").append(userDetails.getUsername());
                }
            }
        }
        log.info(logMessage.toString());
    }
}

