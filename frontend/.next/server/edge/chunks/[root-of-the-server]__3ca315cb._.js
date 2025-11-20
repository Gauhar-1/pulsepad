(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__3ca315cb._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/frontend/src/constants/roles.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "rolePaths": (()=>rolePaths)
});
const rolePaths = {
    admin: '/admin/projects',
    employee: '/employee/projects',
    client: '/client'
};
}}),
"[project]/frontend/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$constants$2f$roles$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/constants/roles.ts [middleware-edge] (ecmascript)");
;
;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';
const protectedRoutes = [
    {
        pattern: /^\/admin(\/|$)/,
        roles: [
            'admin'
        ]
    },
    {
        pattern: /^\/employee(\/|$)/,
        roles: [
            'employee'
        ]
    },
    {
        pattern: /^\/client(\/|$)/,
        roles: [
            'client'
        ]
    }
];
const loginPath = '/login';
async function verifyToken(token) {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });
        if (!res.ok) {
            return null;
        }
        return await res.json();
    } catch (error) {
        console.error('Token verification failed', error);
        return null;
    }
}
function redirectToLogin(request) {
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    response.cookies.delete('auth_token');
    return response;
}
async function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth_token')?.value;
    const matchedRoute = protectedRoutes.find(({ pattern })=>pattern.test(pathname));
    // Handle login redirection when already authenticated
    if (!matchedRoute) {
        if (pathname === loginPath && token) {
            const verified = await verifyToken(token);
            if (verified?.user.role) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$constants$2f$roles$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["rolePaths"][verified.user.role], request.url));
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    if (!token) {
        return redirectToLogin(request);
    }
    const verified = await verifyToken(token);
    if (!verified?.user) {
        return redirectToLogin(request);
    }
    if (!matchedRoute.roles.includes(verified.user.role)) {
        const destination = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$constants$2f$roles$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["rolePaths"][verified.user.role];
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(destination, request.url));
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/admin/:path*',
        '/employee/:path*',
        '/client/:path*',
        '/login'
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__3ca315cb._.js.map