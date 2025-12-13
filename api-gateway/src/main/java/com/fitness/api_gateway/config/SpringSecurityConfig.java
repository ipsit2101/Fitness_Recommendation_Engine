package com.fitness.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SpringSecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity httpSecurity) {
        return
                httpSecurity
                        .csrf(ServerHttpSecurity.CsrfSpec::disable)
                        .authorizeExchange(
                                authorizeExchangeSpec -> authorizeExchangeSpec.anyExchange().authenticated()
                        ).oauth2ResourceServer(oauth2 ->oauth2.jwt(Customizer.withDefaults()))
                        .build();
    }
}
