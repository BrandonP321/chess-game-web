import { ConfigSystem as System } from "../ConfigSystem";
import { ConfigParam as Param } from "../ConfigParam";

export const ServerConfig = new System({ enabled: true, description: "Settings for back end server, makes entire API inaccessible if disabled" }, {
    ConnectionSettings: new System({ enabled: true, description: "Settings for connecting mobile & web clients to API" }, {
        ClientAPIUrlString: new Param({ enabled: true, value: "http://localhost:8000", overrides: {
            live: { enabled: false, value: "live url" },
            dev: { enabled: true, value: "dev url" },
            local: { enabled: true, value: "http://localhost:8000" },
        }})
    }),
    JWTSettings: new System({ enabled: true, description: "Settings for JSON web tokens"}, {
        AccessTokenExpirationTime: new Param({ enabled: true, value: JSON.stringify(1000 * 60 * 60 * 8), overrides: {
            local: { enabled: true, value: JSON.stringify(1000 * 60 * 60 * 8) }
        }}),
        RefreshTokenExpirationTime: new Param({ enabled: true, value: JSON.stringify(1000 * 60 * 60 * 24 * 7), description: "Expiration Time for Refresh JWT.  Will force user to log back in if not refreshed before it expires", overrides: {
            local: { enabled: true, value: JSON.stringify(1000 * 60 * 60 * 24 * 7) }
        } })
    })
})