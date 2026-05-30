package BolsaEmpleo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootApplication
@ComponentScan(
        basePackages = {"BolsaEmpleo"},
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.REGEX,
                pattern = "BolsaEmpleo\\.presentation\\.(admin|empresas|login|oferentes|publico)\\..*"
        )
)
public class ProyectoBolsaDeEmpleoApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProyectoBolsaDeEmpleoApplication.class, args);
    }
}