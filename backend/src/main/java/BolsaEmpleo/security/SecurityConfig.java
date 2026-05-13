package BolsaEmpleo.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import java.io.IOException;
import java.util.Set;

@Configuration
public class SecurityConfig {
    @Autowired
    private CustomAuthenticationFailureHandler customAuthenticationFailureHandler;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/login", "/registro/**", "/css/**", "/js/**", "/images/**", "/puestos/buscar").permitAll()
                        .requestMatchers("/presentation/empresas/**").hasRole("EMPRESA")
                        .requestMatchers("/presentation/oferentes/**").hasRole("OFERENTE")
                        .requestMatchers("/presentation/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .loginProcessingUrl("/login")
                        .usernameParameter("correo")
                        .passwordParameter("password")
                        .successHandler(this::loginSuccessHandler)
                        .failureHandler(customAuthenticationFailureHandler)
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                        .permitAll()
                );

        return http.build();
    }

    private void loginSuccessHandler(HttpServletRequest request,
                                     HttpServletResponse response,
                                     Authentication authentication) throws IOException{

        Set<String> roles = AuthorityUtils.authorityListToSet(authentication.getAuthorities());

        if (roles.contains("ROLE_EMPRESA")) {
            response.sendRedirect("/presentation/empresas/show");
        } else if (roles.contains("ROLE_OFERENTE")) {
            response.sendRedirect("/presentation/oferentes/show");
        } else if (roles.contains("ROLE_ADMIN")) {
            response.sendRedirect("/presentation/admin/show");
        } else {
            response.sendRedirect("/");
        }
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return  new BCryptPasswordEncoder();
    }
}