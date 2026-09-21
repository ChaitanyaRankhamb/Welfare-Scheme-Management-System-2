import { CookieOptions } from "express";

/**
 * Returns base cookie security options configured for development mode
 */
export const getBaseCookieOptions = (): CookieOptions => {
  return {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  };
};

/**
 * Returns cookie options for the short-lived access token (30 minutes)
 */
export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...getBaseCookieOptions(),
  maxAge: 30 * 60 * 1000, // 30 minutes
});

/**
 * Returns cookie options for the long-lived refresh token (7 days)
 */
export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...getBaseCookieOptions(),
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

/**
 * Returns cookie options required to properly clear authentication cookies in the browser
 */
export const getClearCookieOptions = (): CookieOptions => ({
  ...getBaseCookieOptions(),
});
