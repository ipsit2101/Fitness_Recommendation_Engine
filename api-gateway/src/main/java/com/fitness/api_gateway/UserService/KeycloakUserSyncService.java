package com.fitness.api_gateway.UserService;

import com.fitness.api_gateway.UserService.dto.RegisterRequest;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.text.ParseException;

@Component
@Slf4j
public class KeycloakUserSyncService implements WebFilter {

    @Autowired
    private UserServiceClient userServiceClient;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {

        String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");
        String jwtToken = exchange.getRequest().getHeaders().getFirst("Authorization");
        RegisterRequest request = jwtToken != null
                                            ? getUserDetailsFromJwtToken(jwtToken)
                                            : null;
        if (request != null) {
            if (userId == null) {
                userId = request.getKeycloakId();
            }

            if (userId != null) {
                String finalUserId = userId;
                return userServiceClient.validateUser(userId)
                        .flatMap(exists -> {
                            if (!exists) {
                                return userServiceClient.registerUser(request)
                                        .then(Mono.empty());
                            } else {
                                log.info("User already exists. Skipping registration/sync");
                                return Mono.empty();
                            }
                        }).then(
                                Mono.defer(() -> {
                                    // modifying the request and adding user-id in the header
                                    ServerHttpRequest mutatedRequest = exchange.getRequest()
                                            .mutate().header("X-User-ID", finalUserId).build();
                                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                })
                        );
            }
        }
        return chain.filter(exchange);
    }

    private RegisterRequest getUserDetailsFromJwtToken(String jwtToken) {
        try {
            String tokenWithoutBearer = jwtToken.replace("Bearer", "").trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();

            return RegisterRequest.builder()
                    .email(claimsSet.getStringClaim("email"))
                    .keycloakId(claimsSet.getStringClaim("sub"))
                    .password("dummy@123")
                    .firstName(claimsSet.getStringClaim("given_name"))
                    .lastName(claimsSet.getStringClaim("family_name"))
                    .build();
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
}
