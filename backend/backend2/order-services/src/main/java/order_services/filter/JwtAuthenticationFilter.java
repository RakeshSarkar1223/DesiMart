package order_services.filter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import order_services.utils.JwtUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("=== JWT FILTER DEBUG ===");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Method: " + request.getMethod());
        System.out.println("Cookies Present: " + (request.getCookies() != null));

        String token = null;

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                System.out.println("Cookie found: " + cookie.getName() + " = " + cookie.getValue());
                if ("token".equals(cookie.getName())) {

                    token = cookie.getValue();
                    break;
                }
            }
        } else {
            // Also check Authorization header in case cookie wasn't sent but header is
            String authHeader = request.getHeader("Authorization");
            System.out.println("Authorization Header: " + authHeader);
        }

        System.out.println("Resolved Token string: " + (token != null ? "Token found" : "null"));

        if (token != null) {

            if (!jwtUtils.isValid(token)) {
                System.out.println("Token validation failed in Filter!");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            Claims claims = jwtUtils.validateToken(token);
            System.out.println("Token Claims: ID=" + claims.get("id") + ", Email=" + claims.get("email"));

            request.setAttribute("id", claims.get("id"));
            request.setAttribute("email", claims.get("email"));
            request.setAttribute("role", claims.get("role"));

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            claims.get("id"),
                            null,
                            Collections.emptyList()
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}