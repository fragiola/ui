import { type ChildProcess, spawn } from "node:child_process";
import { createServer, request } from "node:http";
import { connect } from "node:net";
import path from "node:path";
import { parseArgs } from "node:util";
import { BASES, baseOutputDir } from "../../packages/registry/bases.ts";

// `pnpm site:dev --base /<slug> --port <n>` — serves the embed app with hot
// reload under `<base>/embed/react/`, so fragiola.com's dev server can proxy
// `/<slug>/embed/**` to it (contract §1). The pages are read by the site
// from an export; only the examples need a live server.
//
// Every base of the registry gets its embed app where a v1.8 export puts it
// (§5.6): the default base at `<base>/embed/react/`, another at
// `<base>/embed/react/<name>/`. One Vite server resolves `#/` against one
// base, so each base runs its own on a port of its own (`--port` + 1, + 2,
// …), and the port given is a proxy in front of them that sends a request,
// and its websocket (hot reload), to the server of the base its path names.

const ROOT = path.resolve(import.meta.dirname, "../..");

const { values } = parseArgs({
    options: {
        base: { type: "string", default: "/ui" },
        port: { type: "string", default: "5174" },
    },
});
const base = `/${values.base.replace(/^\/+|\/+$/g, "")}`.replace(/^\/$/, "");
const port = Number(values.port);

// the default base first: the longest prefixes (the others') are tried first
const servers = [
    ...BASES.filter((entry) => entry.default),
    ...BASES.filter((entry) => !entry.default),
].map((entry, index) => {
    const dir = baseOutputDir(entry);
    return {
        name: entry.name,
        prefix: `${base}/embed/react/${dir ? `${dir}/` : ""}`,
        port: port + 1 + index,
    };
});

const children: ChildProcess[] = servers.map((server) =>
    spawn(
        "pnpm",
        [
            "--filter",
            "examples-react",
            "exec",
            "vite",
            "--port",
            String(server.port),
            "--strictPort",
        ],
        {
            cwd: ROOT,
            stdio: "inherit",
            env: {
                ...process.env,
                FRAGIOLA_BASE: server.name,
                EMBED_BASE: server.prefix,
            },
        },
    ),
);

/** The server of the base a path names: the longest matching prefix. */
function serverFor(url = "/") {
    return (
        [...servers]
            .sort((a, b) => b.prefix.length - a.prefix.length)
            .find((server) => url.startsWith(server.prefix)) ?? servers[0]
    );
}

const proxy = createServer((req, res) => {
    const target = serverFor(req.url);
    const upstream = request(
        {
            host: "127.0.0.1",
            port: target?.port,
            path: req.url,
            method: req.method,
            headers: req.headers,
        },
        (response) => {
            res.writeHead(response.statusCode ?? 502, response.headers);
            response.pipe(res);
        },
    );
    upstream.on("error", () => {
        res.writeHead(502).end(`site:dev: ${target?.name} is not up yet`);
    });
    req.pipe(upstream);
});

// hot reload: a websocket goes to the same server, byte for byte
proxy.on("upgrade", (req, socket, head) => {
    const target = serverFor(req.url);
    const upstream = connect(target?.port ?? port + 1, "127.0.0.1", () => {
        const headers = Object.entries(req.headers)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\r\n");
        upstream.write(
            `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n${headers}\r\n\r\n`,
        );
        upstream.write(head);
        socket.pipe(upstream).pipe(socket);
    });
    upstream.on("error", () => socket.destroy());
    socket.on("error", () => upstream.destroy());
});

proxy.listen(port, () => {
    for (const server of servers) {
        console.log(
            `site:dev — ${server.name}: http://localhost:${port}${server.prefix}`,
        );
    }
});

function stop(signal: NodeJS.Signals) {
    for (const child of children) child.kill(signal);
    proxy.close();
}
for (const child of children) {
    child.on("exit", (code) => {
        stop("SIGTERM");
        process.exit(code ?? 1);
    });
}
for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => stop(signal));
}
