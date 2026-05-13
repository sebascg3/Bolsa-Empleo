package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootApplication
@ComponentScan(
        basePackages = {"BolsaEmpleo", "com.example.backend"},
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.REGEX,
                pattern = "BolsaEmpleo\\.presentation\\.(admin|empresas|login|oferentes|publico)\\..*"
        )
)
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}

