package order_services.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    public Key getSigningKeys(){
        return new javax.crypto.spec.SecretKeySpec(
                jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8),
                io.jsonwebtoken.SignatureAlgorithm.HS256.getJcaName()
        );
    }

    public Claims validateToken(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(getSigningKeys())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isValid(String token){
        try{
            validateToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("JWT Verification Failed: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
