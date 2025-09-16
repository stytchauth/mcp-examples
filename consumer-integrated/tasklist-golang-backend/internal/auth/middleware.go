package auth

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/stytchauth/mcp-examples/consumer-integrated/tasklist-golang-backend/internal/config"
)

type contextKey string

const userIDKey contextKey = "userID"

func WithUserID(ctx context.Context, userID string) context.Context {
	return context.WithValue(ctx, userIDKey, userID)
}

func UserIDFrom(ctx context.Context) (string, bool) {
	v := ctx.Value(userIDKey)
	s, ok := v.(string)
	return s, ok
}

// For this example, we accept a cookie 'stytch_session_jwt' or Authorization: Bearer <jwt>.
// We do not perform remote verification here; in production, verify JWT using JWKS.
func Middleware(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			jwt := ""
			if c, err := r.Cookie("stytch_session_jwt"); err == nil && c.Value != "" {
				jwt = c.Value
			}
			if jwt == "" {
				authz := r.Header.Get("Authorization")
				if strings.HasPrefix(strings.ToLower(authz), "bearer ") {
					jwt = strings.TrimSpace(authz[7:])
				}
			}
			if jwt == "" {
				unauthorized(w)
				return
			}

			// Minimal decode to extract `sub` claim without verification for demo purposes
			// In production, use JWKS at cfg.StytchDomain + "/.well-known/jwks.json" and verify.
			sub := extractSubClaim(jwt)
			if sub == "" {
				unauthorized(w)
				return
			}
			ctx := WithUserID(r.Context(), sub)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func unauthorized(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusUnauthorized)
	_ = json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized"})
}

// extractSubClaim attempts to decode the middle JWT section as JSON and read 'sub'
func extractSubClaim(jwt string) string {
	parts := strings.Split(jwt, ".")
	if len(parts) != 3 {
		return ""
	}
	// base64url decode without padding
	decoded, err := base64urlDecode(parts[1])
	if err != nil {
		return ""
	}
	var m map[string]any
	if err := json.Unmarshal(decoded, &m); err != nil {
		return ""
	}
	if v, ok := m["sub"].(string); ok {
		return v
	}
	return ""
}

func base64urlDecode(s string) ([]byte, error) {
	// add padding if needed
	if m := len(s) % 4; m != 0 {
		s += strings.Repeat("=", 4-m)
	}
	// replace URL chars
	r := strings.NewReplacer("-", "+", "_", "/")
	b64 := r.Replace(s)
	return base64.StdEncoding.DecodeString(b64)
}
